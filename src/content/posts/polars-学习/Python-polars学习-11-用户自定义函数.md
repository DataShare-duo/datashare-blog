---
title: polars学习-11-用户自定义函数
slug: polars-学习/Python_polars学习-11-用户自定义函数
published: 2026-01-26
description: Polars python 自定义函数如何与 polars 结合使用
image: /polars.svg
tags: [python, polars]
category: Python/Polars-学习
draft: false
---

# 背景
polars学习系列文章，第11篇 用户自定义函数，python 自定义函数如何与 polars 结合使用

该库目前已更新到 `1.37.1` 版本，近一年版本更新迭代的速度非常快，之前分享的前10篇文章的版本是 `1.2.1`

该系列文章会分享到github，大家可以去下载jupyter文件，进行参考学习
仓库地址：[https://github.com/DataShare-duo/polars_learn](https://github.com/DataShare-duo/polars_learn)

# 小编运行环境
```python
import sys

print('python 版本：', sys.version.split('|')[0])
#python 版本： 3.11.11 

import polars as pl

print("polars 版本：", pl.__version__)
#polars 版本： 1.37.1
```
# 提供的 api 函数/接口/方法
- `map_elements` ：对列中的每个值，传入函数，类似pandas中的map
- `map_batches` ：整个列全部传入函数，类似pandas中的apply
## 示例数据
```python
df = pl.DataFrame(
    {
        "keys": ["a", "a", "b", "b"],
        "values": [10, 7, 1, 23],
    }
)
print(df)
shape: (4, 2)
┌──────┬────────┐
│ keys ┆ values │
│ ---  ┆ ---    │
│ str  ┆ i64    │
╞══════╪════════╡
│ a    ┆ 10     │
│ a    ┆ 7      │
│ b    ┆ 1      │
│ b    ┆ 23     │
└──────┴────────┘
```
## map_elements 用法
```python
import math 

def my_log(value):
    return math.log(value)  # math.log 应用与每个值

out = df.select(pl.col("values").map_elements(my_log, return_dtype=pl.Float64))
print(out)
shape: (4, 1)
┌──────────┐
│ values   │
│ ---      │
│ f64      │
╞══════════╡
│ 2.302585 │
│ 1.94591  │
│ 0.0      │
│ 3.135494 │
└──────────┘
```
存在问题：
1. **限于单个项**：只用应用在单个值上面，而不能一次应用到整个列
2. **性能开销**：为每个单独的项调用函数也很慢，所有这些额外的函数调用会增加大量的开销

## map_batches 用法
```python
def diff_from_mean(series):
    total = 0
    for value in series:
        total += value
    mean = total / len(series)
    return pl.Series([value - mean for value in series])

out = df.select(pl.col("values").map_batches(diff_from_mean, return_dtype=pl.Float64))
print("== select() with UDF ==")
print(out)
== select() with UDF ==
shape: (4, 1)
┌────────┐
│ values │
│ ---    │
│ f64    │
╞════════╡
│ -0.25  │
│ -3.25  │
│ -9.25  │
│ 12.75  │
└────────┘

print("== group_by() with UDF ==")
out = df.group_by("keys").agg(
    pl.col("values").map_batches(diff_from_mean, return_dtype=pl.Float64)
)
print(out)
== group_by() with UDF ==
shape: (2, 2)
┌──────┬───────────────┐
│ keys ┆ values        │
│ ---  ┆ ---           │
│ str  ┆ list[f64]     │
╞══════╪═══════════════╡
│ a    ┆ [1.5, -1.5]   │
│ b    ┆ [-11.0, 11.0] │
└──────┴───────────────┘
```

# 提升用户自定义函数性能
## numpy 通用函数
纯python实现的自定义函数一般速度都比较慢，要尽量减少代用python实现的方法，可以调用 numpy 中的实现的通用函数/算子，来加速，实际是通过调用C语言的轮子来加速
```python
import numpy as np

out = df.select(pl.col("values").map_batches(np.log, return_dtype=pl.Float64))
print(out)
```

## 通过 Numba 提升自定义函数性能
如果 numpy 中没有可用的函数，那么自定义函数可以通过 Numba 来提速，即时编译
```python
from numba import guvectorize, int64, float64

@guvectorize([(int64[:], float64[:])], "(n)->(n)")
def diff_from_mean_numba(arr, result):
    total = 0
    for value in arr:
        total += value
    mean = total / len(arr)
    for i, value in enumerate(arr):
        result[i] = value - mean


out = df.select(
    pl.col("values").map_batches(diff_from_mean_numba, return_dtype=pl.Float64)
)
print("== select() with UDF ==")
print(out)

out = df.group_by("keys").agg(
    pl.col("values").map_batches(diff_from_mean_numba, return_dtype=pl.Float64)
)
print("== group_by() with UDF ==")
print(out)
```

## 注意事项
**加速时，数据缺失是不行的**，在利用numba装饰器`@guvectorize`加速时，要么填充缺失值，要么删除缺失值，否则polars会报错

# 组合多列
```python
@guvectorize([(int64[:], int64[:], float64[:])], "(n),(n)->(n)")
def add(arr, arr2, result):
    for i in range(len(arr)):
        result[i] = arr[i] + arr2[i]


df3 = pl.DataFrame({"values_1": [1, 2, 3], "values_2": [10, 20, 30]})

out = df3.select(
    pl.struct(["values_1", "values_2"])
    .map_batches(
        lambda combined: add(
            combined.struct.field("values_1"), combined.struct.field("values_2")
        ),
        return_dtype=pl.Float64,
    )
    .alias("add_columns")
)
print(out)
```

# 流式计算
可以使用 `map_batches` 的 `is_elementwise=True` 参数将结果流式传输到函数中

设置流式计算，需要确保是针对每个值进行计算，更节省内存

# 返回数据类型
返回数据类型是自动推断的，第一个非空值类型，作为结果类型

python 与 polars 数据类型映射：
- int -> Int64
- float -> Float64
- bool -> Boolean
- str -> String
- list[tp] -> List[tp]
- dict[str, [tp]] -> struct 
- any -> object  尽量禁止这种情况

可以将 `return_dtype` 参数传递给 `map_batches`


# 历史相关文章
- [Python polars学习-01 读取与写入文件](../Python_polars学习-01_读取与写入文件/)
- [Python polars学习-02 上下文与表达式](../../polars-学习/Python_polars学习-02_上下文与表达式/)
- [Python polars学习-03 数据类型转换](../../polars-学习/Python_polars学习-03_数据类型转换/)
- [Python polars学习-04 字符串数据处理](../../polars-学习/Python_polars学习-04_字符串数据处理/)
- [Python polars学习-05 包含的数据结构](../../polars-学习/Python_polars学习-05_包含的数据结构/)
- [Python polars学习-06 Lazy-Eager-API](../../polars-学习/Python_polars学习-06_Lazy-Eager-API/)
- [Python polars学习-07 缺失值](../../polars-学习/Python_polars学习-07_缺失值/)
- [Python polars学习-08 分类数据处理](../../polars-学习/Python_polars学习-08_分类数据处理/)
- [Python polars学习-09 数据框关联与拼接](../../polars-学习/Python_polars学习-09_数据框关联与拼接/)
- [Python polars学习-10 时间序列类型](../../polars-学习/Python-polars学习-10-时间序列类型/)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
