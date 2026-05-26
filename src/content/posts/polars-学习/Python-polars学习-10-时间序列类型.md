---
title: polars学习-10-时间序列类型
slug: polars-学习/Python_polars学习-10-时间序列类型
published: 2024-08-05
description: Polars 时间序列类型（Time series）
image: ./polars.svg
tags: [python, polars]
category: Python/Polars-学习
draft: false
---

# 背景
polars学习系列文章，第10篇 时间序列类型（Time series）

该系列文章会分享到github，大家可以去下载jupyter文件，进行参考学习
仓库地址：[https://github.com/DataShare-duo/polars_learn](https://github.com/DataShare-duo/polars_learn)

# 小编运行环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.9

import polars as pl

print("polars 版本：",pl.__version__)
#polars 版本： 1.2.1
```

# 日期时间类型
Polars 原生支持解析时间序列数据，而且能执行一些复杂的操作

包含的日期时间类型：
- **Date**：日期类型，例如：2014-07-08，内部表示为自1970-01-01的天数，用32位有符号整数表示
- **Datetime**：日期时间类型，例如：2014-07-08 07:00:00
- **Duration**：时间间隔类型
- **Time**：时间类型

# 从文件加载数据时，解析时间
从csv文件加载数据时，可以指定 `try_parse_dates=True`，让polars去尝试解析日期时间
```python
df = pl.read_csv("./data/apple_stock.csv", try_parse_dates=True)
print(df)
#shape: (100, 2)
┌────────────┬────────┐
│ Date       ┆ Close  │
│ ---        ┆ ---    │
│ date       ┆ f64    │
╞════════════╪════════╡
│ 1981-02-23 ┆ 24.62  │
│ 1981-05-06 ┆ 27.38  │
│ 1981-05-18 ┆ 28.0   │
│ 1981-09-25 ┆ 14.25  │
│ 1982-07-08 ┆ 11.0   │
│ …          ┆ …      │
│ 2012-05-16 ┆ 546.08 │
│ 2012-12-04 ┆ 575.85 │
│ 2013-07-05 ┆ 417.42 │
│ 2013-11-07 ┆ 512.49 │
│ 2014-02-25 ┆ 522.06 │
└────────────┴────────┘
```
# 字符串转换为日期时间类型
通过调用字符串的 `str.to_date` 方法，需要指定日期时间解析时的格式

日期时间解析格式，可参考该文档：<br/>
[https://docs.rs/chrono/latest/chrono/format/strftime/index.html](https://docs.rs/chrono/latest/chrono/format/strftime/index.html)
```python
df = pl.read_csv("./data/apple_stock.csv", try_parse_dates=False)

df = df.with_columns(pl.col("Date").str.to_date("%Y-%m-%d"))
print(df)
shape: (100, 2)
┌────────────┬────────┐
│ Date       ┆ Close  │
│ ---        ┆ ---    │
│ date       ┆ f64    │
╞════════════╪════════╡
│ 1981-02-23 ┆ 24.62  │
│ 1981-05-06 ┆ 27.38  │
│ 1981-05-18 ┆ 28.0   │
│ 1981-09-25 ┆ 14.25  │
│ 1982-07-08 ┆ 11.0   │
│ …          ┆ …      │
│ 2012-05-16 ┆ 546.08 │
│ 2012-12-04 ┆ 575.85 │
│ 2013-07-05 ┆ 417.42 │
│ 2013-11-07 ┆ 512.49 │
│ 2014-02-25 ┆ 522.06 │
└────────────┴────────┘
```

# 从日期时间类型中提取特定的日期类型
比如从日期时间类型列中提取年份、日期等，通过 `.dt` 来提取
```python
df_with_year = df.with_columns(pl.col("Date").dt.year().alias("year"))
print(df_with_year)
#shape: (100, 3)
┌────────────┬────────┬──────┐
│ Date       ┆ Close  ┆ year │
│ ---        ┆ ---    ┆ ---  │
│ date       ┆ f64    ┆ i32  │
╞════════════╪════════╪══════╡
│ 1981-02-23 ┆ 24.62  ┆ 1981 │
│ 1981-05-06 ┆ 27.38  ┆ 1981 │
│ 1981-05-18 ┆ 28.0   ┆ 1981 │
│ 1981-09-25 ┆ 14.25  ┆ 1981 │
│ 1982-07-08 ┆ 11.0   ┆ 1982 │
│ …          ┆ …      ┆ …    │
│ 2012-05-16 ┆ 546.08 ┆ 2012 │
│ 2012-12-04 ┆ 575.85 ┆ 2012 │
│ 2013-07-05 ┆ 417.42 ┆ 2013 │
│ 2013-11-07 ┆ 512.49 ┆ 2013 │
│ 2014-02-25 ┆ 522.06 ┆ 2014 │
└────────────┴────────┴──────┘
```

# 混合时差
当有混合时差（例如，由于跨越夏令时），可以使用 `dt.convert_time_zone` 来进行转换
```python
data = [
    "2021-03-27T00:00:00+0100",
    "2021-03-28T00:00:00+0100",
    "2021-03-29T00:00:00+0200",
    "2021-03-30T00:00:00+0200",
]
mixed_parsed = (
    pl.Series(data)
    .str.to_datetime("%Y-%m-%dT%H:%M:%S%z")
    .dt.convert_time_zone("Europe/Brussels")
)


print(mixed_parsed)
#shape: (4,)
Series: '' [datetime[μs, Europe/Brussels]]
[
	2021-03-27 00:00:00 CET
	2021-03-28 00:00:00 CET
	2021-03-29 00:00:00 CEST
	2021-03-30 00:00:00 CEST
]
```
# 日期时间数据筛选
```python
from datetime import datetime

df = pl.read_csv("./data/apple_stock.csv", try_parse_dates=True)

print(df)
#shape: (100, 2)
┌────────────┬────────┐
│ Date       ┆ Close  │
│ ---        ┆ ---    │
│ date       ┆ f64    │
╞════════════╪════════╡
│ 1981-02-23 ┆ 24.62  │
│ 1981-05-06 ┆ 27.38  │
│ 1981-05-18 ┆ 28.0   │
│ 1981-09-25 ┆ 14.25  │
│ 1982-07-08 ┆ 11.0   │
│ …          ┆ …      │
│ 2012-05-16 ┆ 546.08 │
│ 2012-12-04 ┆ 575.85 │
│ 2013-07-05 ┆ 417.42 │
│ 2013-11-07 ┆ 512.49 │
│ 2014-02-25 ┆ 522.06 │
└────────────┴────────┘
```
## 筛选单个日期时间对象
```python
filtered_df = df.filter(
    pl.col("Date") == datetime(1995, 10, 16),
)
print(filtered_df)
#shape: (1, 2)
┌────────────┬───────┐
│ Date       ┆ Close │
│ ---        ┆ ---   │
│ date       ┆ f64   │
╞════════════╪═══════╡
│ 1995-10-16 ┆ 36.13 │
└────────────┴───────┘
```

## 筛选一个日期范围
通过 `is_between` 方法，指定一个范围
```python
filtered_range_df = df.filter(
    pl.col("Date").is_between(datetime(1995, 7, 1), datetime(1995, 11, 1)),
)
print(filtered_range_df)
#shape: (2, 2)
┌────────────┬───────┐
│ Date       ┆ Close │
│ ---        ┆ ---   │
│ date       ┆ f64   │
╞════════════╪═══════╡
│ 1995-07-06 ┆ 47.0  │
│ 1995-10-16 ┆ 36.13 │
└────────────┴───────┘
```

## 筛选 负数日期
考古领域数据可能会涉及这类日期
```python
ts = pl.Series(["-1300-05-23", "-1400-03-02"]).str.to_date()

negative_dates_df = pl.DataFrame({"ts": ts, "values": [3, 4]})

negative_dates_filtered_df = negative_dates_df.filter(pl.col("ts").dt.year() < -1300)
print(negative_dates_filtered_df)
#shape: (1, 2)
┌─────────────┬────────┐
│ ts          ┆ values │
│ ---         ┆ ---    │
│ date        ┆ i64    │
╞═════════════╪════════╡
│ -1400-03-02 ┆ 4      │
└─────────────┴────────┘
```
# 历史相关文章
- [Python polars学习-01 读取与写入文件](./Python_polars学习-01_读取与写入文件.md)
- [Python polars学习-02 上下文与表达式](./Python_polars学习-02_上下文与表达式.md)
- [Python polars学习-03 数据类型转换](./Python_polars学习-03_数据类型转换.md)
- [Python polars学习-04 字符串数据处理](./Python_polars学习-04_字符串数据处理.md)
- [Python polars学习-05 包含的数据结构](./Python_polars学习-05_包含的数据结构.md)
- [Python polars学习-06 Lazy / Eager API](./Python_polars学习-06_Lazy-Eager-API.md)
- [Python polars学习-07 缺失值](./Python_polars学习-07_缺失值.md)
- [Python polars学习-08 分类数据处理](./Python_polars学习-08_分类数据处理.md)
- [Python polars学习-09 数据框关联与拼接](./Python_polars学习-09_数据框关联与拼接.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**


