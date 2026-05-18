---
title: polars学习-07_缺失值
slug: polars-学习/Python_polars学习-07_缺失值
published: 2024-06-25
description: Polars 缺失值处理
image: ./polars.svg
tags: [python, polars]
category: Polars-学习
draft: false
---

# 背景
polars学习系列文章，第7篇 缺失值

该系列文章会分享到github，大家可以去下载jupyter文件，进行参考学习

仓库地址：[https://github.com/DataShare-duo/polars_learn](https://github.com/DataShare-duo/polars_learn)

# 小编运行环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.9

import polars as pl

print("polars 版本：",pl.__version__)
#polars 版本： 0.20.22
```

# polars 中缺失值的定义
在 polars 中缺失值用 `null` 来表示，只有这1种表示方式，这个与 pandas 不同，在 pandas 中 `NaN`（NotaNumber）也代表是缺失值，但在polars中把 `NaN` 归属为一种浮点数据
```python
df = pl.DataFrame(
    {
        "value": [1,2,3, None,5,6,None,8,9],
    },
)
print(df)
#shape: (9, 1)
┌───────┐
│ value │
│ ---   │
│ i64   │
╞═══════╡
│ 1     │
│ 2     │
│ 3     │
│ null  │
│ 5     │
│ 6     │
│ null  │
│ 8     │
│ 9     │
└───────┘
```

# polars中缺失值包括的2种元信息
- 缺失值数量，可以通过 `null_count` 方法来快速获取，因为已经是计算好的，所以调用该方法会立即返回结果
- 有效位图（validity bitmap），代表是否是缺失值，在内存中用 0 或 1 进行编码来表示，所占的内存空间非常小，通常占用空间为（数据框长度 / 8) bytes，通过 `is_null` 方法来查看数据是否是缺失值

```python
null_count_df = df.null_count()
print(null_count_df)
#shape: (1, 1)
┌───────┐
│ value │
│ ---   │
│ u32   │
╞═══════╡
│ 2     │
└───────┘


is_null_series = df.select(
    pl.col("value").is_null(),
)
print(is_null_series)
#shape: (9, 1)
┌───────┐
│ value │
│ ---   │
│ bool  │
╞═══════╡
│ false │
│ false │
│ false │
│ true  │
│ false │
│ false │
│ true  │
│ false │
│ false │
└───────┘
```
# 缺失值填充
缺失值填充主要通过 `fill_null`方法来处理，但是需求指定填充缺失值的方法
- 常量，比如用 0 来填充
- 填充策略，例如：向前、向后 等
- 通过表达式，比如利用其他列来填充
- 插值法
```python
df = pl.DataFrame(
    {
        "col1": [1, 2, 3],
        "col2": [1, None, 3],
    },
)
print(df)
#shape: (3, 2)
┌──────┬──────┐
│ col1 ┆ col2 │
│ ---  ┆ ---  │
│ i64  ┆ i64  │
╞══════╪══════╡
│ 1    ┆ 1    │
│ 2    ┆ null │
│ 3    ┆ 3    │
└──────┴──────┘
```
## 常量填充
```python
fill_literal_df = df.with_columns(
    fill=pl.col("col2").fill_null(pl.lit(2)),
)
print(fill_literal_df)
#shape: (3, 3)
┌──────┬──────┬──────┐
│ col1 ┆ col2 ┆ fill │
│ ---  ┆ ---  ┆ ---  │
│ i64  ┆ i64  ┆ i64  │
╞══════╪══════╪══════╡
│ 1    ┆ 1    ┆ 1    │
│ 2    ┆ null ┆ 2    │
│ 3    ┆ 3    ┆ 3    │
└──────┴──────┴──────┘
```
## 填充策略
填充策略：{'forward', 'backward', 'min', 'max', 'mean', 'zero', 'one'}
```python
fill_df = df.with_columns(
    forward=pl.col("col2").fill_null(strategy="forward"),
    backward=pl.col("col2").fill_null(strategy="backward"),
)
print(fill_df)
#shape: (3, 4)
┌──────┬──────┬─────────┬──────────┐
│ col1 ┆ col2 ┆ forward ┆ backward │
│ ---  ┆ ---  ┆ ---     ┆ ---      │
│ i64  ┆ i64  ┆ i64     ┆ i64      │
╞══════╪══════╪═════════╪══════════╡
│ 1    ┆ 1    ┆ 1       ┆ 1        │
│ 2    ┆ null ┆ 1       ┆ 3        │
│ 3    ┆ 3    ┆ 3       ┆ 3        │
└──────┴──────┴─────────┴──────────┘
```
## 通过表达式
```python
fill_median_df = df.with_columns(
    fill=pl.col("col2").fill_null(pl.median("col2")), #类型会转换为浮点型
)
print(fill_median_df)
#shape: (3, 3)
┌──────┬──────┬──────┐
│ col1 ┆ col2 ┆ fill │
│ ---  ┆ ---  ┆ ---  │
│ i64  ┆ i64  ┆ f64  │
╞══════╪══════╪══════╡
│ 1    ┆ 1    ┆ 1.0  │
│ 2    ┆ null ┆ 2.0  │
│ 3    ┆ 3    ┆ 3.0  │
└──────┴──────┴──────┘
```
## 通过插值法
```python
fill_interpolation_df = df.with_columns(
    fill=pl.col("col2").interpolate(),  
)
print(fill_interpolation_df)
#shape: (3, 3)
┌──────┬──────┬──────┐
│ col1 ┆ col2 ┆ fill │
│ ---  ┆ ---  ┆ ---  │
│ i64  ┆ i64  ┆ f64  │
╞══════╪══════╪══════╡
│ 1    ┆ 1    ┆ 1.0  │
│ 2    ┆ null ┆ 2.0  │
│ 3    ┆ 3    ┆ 3.0  │
└──────┴──────┴──────┘
```
# 历史相关文章
- [Python polars学习-01 读取与写入文件](./Python_polars学习-01_读取与写入文件.md)
- [Python polars学习-02 上下文与表达式](./Python_polars学习-02_上下文与表达式.md)
- [Python polars学习-03 数据类型转换](./Python_polars学习-03_数据类型转换.md)
- [Python polars学习-04 字符串数据处理](./Python_polars学习-04_字符串数据处理.md)
- [Python polars学习-05 包含的数据结构](./Python_polars学习-05_包含的数据结构.md)
- [Python polars学习-06 Lazy / Eager API](./Python_polars学习-06_Lazy-Eager-API.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
