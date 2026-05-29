---
title: polars学习-02 上下文与表达式
slug: polars-学习/Python_polars学习-02_上下文与表达式
published: 2024-04-29
description: Polars Contexts 上下文 与 Expressions 表达式
image: /polars.svg
tags: [python, polars]
category: Python/Polars-学习
draft: false
---


# 背景
polars学习系列文章，第2篇，上下文与表达式 <br/>
该系列文章会分享到github，大家可以去下载jupyter文件

仓库地址：[https://github.com/DataShare-duo/polars_learn](https://github.com/DataShare-duo/polars_learn)

# 上下文与表达式概述
**官方文档表述：**

>Polars has developed its own Domain Specific Language (DSL) for transforming data.
The language is very easy to use and allows for complex queries that remain human readable.
The two core components of the language are Contexts and Expressions

**机器翻译：**
Polars 开发了自己的特定领域语言 (DSL)，用于转换数据。
该语言非常容易使用，允许进行复杂的查询，但仍保持人类可读性。
该语言的两个核心组成部分是上下文和表达式

**小编加工后的翻译：**
Polars 自己设计了一套用于处理数据的功能。
该功能易于使用，而且能以易理解的方式进行复杂的数据处理。
上下文与表达式是该功能的两个核心组成部分。

**1. Contexts 上下文**
上下文是指需要计算表达式的上下文
- 选择：df.select(...)，df.with_columns(...)
- 过滤：df.filter()
- 分组聚合：df.group_by(...).agg(...)

**2. Expressions 表达式**
表达式是许多数据科学运算的核心：
- 选取特定的列
- 从一列中抽取特定的行
- 将一列与值相乘
- 从一个日期列中，提取年份
- 将一列字符串转换为小写
- ......

**综上所述，在Polars中，Contexts 上下文 与 Expressions 表达式，需要结合使用**

# 小编运行环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.5 

import polars as pl

print("polars 版本：",pl.__version__)
#polars 版本： 0.20.22
```
# 演示数据
```python
df=pl.read_csv('./data/iris.csv')

print(df.head(10))
#shape: (10, 6)
┌───────┬──────────────┬─────────────┬──────────────┬─────────────┬─────────┐
│ index ┆ Sepal.Length ┆ Sepal.Width ┆ Petal.Length ┆ Petal.Width ┆ Species │
│ ---   ┆ ---          ┆ ---         ┆ ---          ┆ ---         ┆ ---     │
│ i64   ┆ f64          ┆ f64         ┆ f64          ┆ f64         ┆ str     │
╞═══════╪══════════════╪═════════════╪══════════════╪═════════════╪═════════╡
│ 1     ┆ 5.1          ┆ 3.5         ┆ 1.4          ┆ 0.2         ┆ setosa  │
│ 2     ┆ 4.9          ┆ 3.0         ┆ 1.4          ┆ 0.2         ┆ setosa  │
│ 3     ┆ 4.7          ┆ 3.2         ┆ 1.3          ┆ 0.2         ┆ setosa  │
│ 4     ┆ 4.6          ┆ 3.1         ┆ 1.5          ┆ 0.2         ┆ setosa  │
│ 5     ┆ 5.0          ┆ 3.6         ┆ 1.4          ┆ 0.2         ┆ setosa  │
│ 6     ┆ 5.4          ┆ 3.9         ┆ 1.7          ┆ 0.4         ┆ setosa  │
│ 7     ┆ 4.6          ┆ 3.4         ┆ 1.4          ┆ 0.3         ┆ setosa  │
│ 8     ┆ 5.0          ┆ 3.4         ┆ 1.5          ┆ 0.2         ┆ setosa  │
│ 9     ┆ 4.4          ┆ 2.9         ┆ 1.4          ┆ 0.2         ┆ setosa  │
│ 10    ┆ 4.9          ┆ 3.1         ┆ 1.5          ┆ 0.1         ┆ setosa  │
└───────┴──────────────┴─────────────┴──────────────┴─────────────┴─────────┘

df.shape
#(150, 6)
```

# 选取需要的列
```python
df.select(pl.col("Sepal.Length"))  #选取特定的列

df.select(pl.col("Sepal.Length","Petal.Length"))

df.select(pl.col("*"))  #选取所有列

df.select(pl.all())  #选取所有列

df.select(pl.col("*").exclude("index", "Species"))  #选取列时，排除特定列

df.select(pl.col("^.*Length$"))  #支持正则表达式，需要以 ^ 开始 $ 结尾

df.select(pl.col(pl.Float64))  #根据列的类型，进行选取
```

# 筛选出需要的行
```python
df.filter(pl.col("Sepal.Length")>5)  

df.filter((pl.col("Sepal.Length")>5) & (pl.col("Petal.Length")>5))  
#需要把2个条件分别括起来！！！

df.filter((pl.col("Sepal.Length")>5) | (pl.col("Petal.Length")>5))

df.select(pl.col("Sepal.Width","Petal.Width").filter(pl.col("Sepal.Length")>5))
#根据过滤条件，选取特定列
```

# 增加新列
```python
df.with_columns(pl.lit(10),pl.lit(2).alias("lit_5"))  #增加常数列，并设置别名

df.with_columns(pl.max("Sepal.Length").alias("max_Sepal.Length"),
                pl.min("Sepal.Length").alias("min_Sepal.Length"),
                pl.mean("Sepal.Length").alias("avg_Sepal.Length"),
                pl.std("Sepal.Length").alias("std_Sepal.Length")
               )  #有点类似窗口函数
```

# 数值列运算
```python
df.select(pl.col("Sepal.Length"),
          (pl.col("Sepal.Length")*100).alias("Sepal.Length * 100"),
          (pl.col("Sepal.Length")/100).alias("Sepal.Length / 100"),
          (pl.col("Sepal.Length")/pl.max("Sepal.Length")).alias("Sepal.Length /max_Sepal.Length")
         )
```

# 字段串列运算
```python
df.select(pl.col("Species"),
          pl.col("Species").str.len_bytes().alias("byte_count"),
          pl.col("Species").str.len_chars().alias("chars_count")
         )

df.select(pl.col("Species"),
          pl.col("Species").str.contains("set|vir").alias("regex"),
          pl.col("Species").str.starts_with("set").alias("starts_with"),
          pl.col("Species").str.ends_with("ca").alias("ends_with"),
         )
```

# 去重统计
```python
df.select(pl.col("Species").n_unique())
```

# 分组聚合运算
```python
df.group_by("Species").agg(
    pl.len(),
    pl.col("index"),
    pl.count("Sepal.Length").name.suffix("_count_1"),  #别名，另一种方式
    pl.col("Sepal.Length").count().name.suffix("_count_2"),
    pl.mean("Sepal.Length").name.suffix("_mean"),
    pl.std("Sepal.Length").name.suffix("_std"),
)

df.group_by("Species").agg(
    (pl.col("Sepal.Length")>5).sum().alias("Sepal.Length>5"),
    (pl.col("Petal.Length")>5).sum().alias("Petal.Length>5"),
)
```

# 排序
```python
df.sort("Sepal.Length",descending=True)

df.sort(["Sepal.Length","Petal.Length"],descending=[True,False])
```

# 历史相关文章
- [Python polars学习-01 读取与写入文件](../Python_polars学习-01_读取与写入文件/)
- [Python pandas遍历行数据的2种方法](../../Python数据处理/Python-pandas遍历行数据的2种方法/)
- [Python 利用pandas对数据进行特定排序](../../Python数据处理/Python-利用pandas对数据进行特定排序/)
- [Python pandas.str.replace 不起作用](../../Python数据处理/Python-pandas-str-replace-不起作用/)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
