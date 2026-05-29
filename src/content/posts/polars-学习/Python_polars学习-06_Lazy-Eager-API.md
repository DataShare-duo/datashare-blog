---
title: polars学习-06_Lazy-Eager-API
slug: polars-学习/Python_polars学习-06_Lazy-Eager-API
published: 2024-06-20
description: Polars Lazy（延迟、惰性）、Eager（即时、实时）计算引擎
image: /polars.svg
tags: [python, polars]
category: Python/Polars-学习
draft: false
---

# 背景
polars学习系列文章，第6篇 Lazy / Eager API <br/>
**Lazy：** 延迟、惰性<br/>
**Eager：** 即时、实时

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

# Lazy / Eager API 区别
- **Eager API（即时、实时）**
实时进行计算，每一步操作都会进行计算，类似pandas那样，每操作一步都会进行计算，得到这一步的结果，所见即所得，如果没有明确指定或者调用特定的方法之外，polars 基本都是使用该模式
    

- **Lazy API（延迟、惰性）**
推迟进行计算，把所有的操作步骤先记下来，Query plan（查询计划），等到需要结果时，才统一进行计算，polars 会对这些计算步骤自动进行优化，提升性能
    - `pl.scan_csv` 等 `pl.scan_` 函数
    - 调用DataFrame 的 `.lazy` 方法，转换为 Lazy 模式

# Eager API 数据处理案例
```python
df = pl.read_csv("./data/iris.csv")
df_small = df.filter(pl.col("Sepal.Length") > 5)
df_agg = df_small.group_by("Species").agg(pl.col("Sepal.Width").mean())
print(df_agg)

#shape: (3, 2)
┌────────────┬─────────────┐
│ Species    ┆ Sepal.Width │
│ ---        ┆ ---         │
│ str        ┆ f64         │
╞════════════╪═════════════╡
│ versicolor ┆ 2.804255    │
│ virginica  ┆ 2.983673    │
│ setosa     ┆ 3.713636    │
└────────────┴─────────────┘
```

# Lazy API 数据处理案例
```python
q = (
    pl.scan_csv("./data/iris.csv")
    .filter(pl.col("Sepal.Length") > 5)
    .group_by("Species")
    .agg(pl.col("Sepal.Width").mean())
)

df = q.collect()
print(df)

#shape: (3, 2)
┌────────────┬─────────────┐
│ Species    ┆ Sepal.Width │
│ ---        ┆ ---         │
│ str        ┆ f64         │
╞════════════╪═════════════╡
│ virginica  ┆ 2.983673    │
│ versicolor ┆ 2.804255    │
│ setosa     ┆ 3.713636    │
└────────────┴─────────────┘
```
在数据处理中会对`Sepal.Length`进行过滤，polars 在把数据加载进内存时，只会加载符合条件的数据行，同时计算时只用到了 `Species`、`Sepal.Width` 2列，polars 只会加载这2 列到内存，进行计算

这样的话会显著降低内存和CPU的负载，从而能够在内存中容纳更大的数据集并加快处理速度

# 使用建议
- 如果你是在进行探索性分析，想知道中间的每个步骤数据情况，那么可以使用 Eager 模式
- 如果想得到最终的计算结果，那么可以使用 Lazy 模式，让polars对中间的计算进行优化，提升数据处理效率

***注：在大部分情况下，Eager API 背后其实调用的是 Lazy API，Eager 模式其实也是有查询优化***

# 历史相关文章
- [Python polars学习-01 读取与写入文件](../Python_polars学习-01_读取与写入文件/)
- [Python polars学习-02 上下文与表达式](../../polars-学习/Python_polars学习-02_上下文与表达式/)
- [Python polars学习-03 数据类型转换](../../polars-学习/Python_polars学习-03_数据类型转换/)
- [Python polars学习-04 字符串数据处理](../../polars-学习/Python_polars学习-04_字符串数据处理/)
- [Python polars学习-05 包含的数据结构](../../polars-学习/Python_polars学习-05_包含的数据结构/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
