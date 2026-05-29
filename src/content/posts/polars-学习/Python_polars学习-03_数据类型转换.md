---
title: polars学习-03_数据类型转换
slug: polars-学习/Python_polars学习-03_数据类型转换
published: 2024-05-13
description: Polars 数据类型转换
image: /polars.svg
tags: [python, polars]
category: Python/Polars-学习
draft: false
---

# 背景
polars学习系列文章，第3篇 数据类型转换 <br/>
该系列文章会分享到github，大家可以去下载jupyter文件

仓库地址：[https://github.com/DataShare-duo/polars_learn](https://github.com/DataShare-duo/polars_learn)

# 小编运行环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.5 

import polars as pl

print("polars 版本：",pl.__version__)
#polars 版本： 0.20.22
```

# 数据类型转换
数据类型转换，主要是通过 `cast` 方法来进行操作，该方法中有个参数 `strict` ，该参数决定当原数据类型不能转换为目标数据类型时，应该如何处理
- 严格模式， `strict=True`(该参数默认是True)，就会进行报错，打印出详细的错误信息
- 非严格模式， `strict=False` ,不会报错，无法转换为目标数据类型的值都会被置为 `null`

*`pandas` 中数据类型转换使用的是 `astype` 方法*

# 示例
**数值类型  Numerics**

浮点型数值转换为整型时，会向下取整；大范围的数据类型转换为小范围数据类型时，如果数值溢出时，默认会报错，如果设置了 `strict=False`，则会被置为 `null`
```python
df = pl.DataFrame(
    {
        "integers": [1, 2, 3, 4, 5],
        "big_integers": [1, 10000002, 3, 10000004, 10000005],
        "floats": [4.0, 5.0, 6.0, 7.0, 8.0],
        "floats_with_decimal": [4.532, 5.5, 6.5, 7.5, 8.5],
    }
)

print(df)
shape: (5, 4)
┌──────────┬──────────────┬────────┬─────────────────────┐
│ integers ┆ big_integers ┆ floats ┆ floats_with_decimal │
│ ---      ┆ ---          ┆ ---    ┆ ---                 │
│ i64      ┆ i64          ┆ f64    ┆ f64                 │
╞══════════╪══════════════╪════════╪═════════════════════╡
│ 1        ┆ 1            ┆ 4.0    ┆ 4.532               │
│ 2        ┆ 10000002     ┆ 5.0    ┆ 5.5                 │
│ 3        ┆ 3            ┆ 6.0    ┆ 6.5                 │
│ 4        ┆ 10000004     ┆ 7.0    ┆ 7.5                 │
│ 5        ┆ 10000005     ┆ 8.0    ┆ 8.5                 │
└──────────┴──────────────┴────────┴─────────────────────┘

out=df.select(
        pl.col("integers").cast(pl.Float32).alias("integers_as_floats"),
        pl.col("floats").cast(pl.Int32).alias("floats_as_integers"),
        pl.col("floats_with_decimal").cast(pl.Int32).alias("floats_with_decimal_as_integers")
    )

print(out)
shape: (5, 3)
┌────────────────────┬────────────────────┬─────────────────────────────────┐
│ integers_as_floats ┆ floats_as_integers ┆ floats_with_decimal_as_integers │
│ ---                ┆ ---                ┆ ---                             │
│ f32                ┆ i32                ┆ i32                             │
╞════════════════════╪════════════════════╪═════════════════════════════════╡
│ 1.0                ┆ 4                  ┆ 4                               │
│ 2.0                ┆ 5                  ┆ 5                               │
│ 3.0                ┆ 6                  ┆ 6                               │
│ 4.0                ┆ 7                  ┆ 7                               │
│ 5.0                ┆ 8                  ┆ 8                               │
└────────────────────┴────────────────────┴─────────────────────────────────┘

#如果不溢出的类型转换，可以节省内存
out=df.select(
        pl.col("integers").cast(pl.Int16).alias("integers_smallfootprint"),
        pl.col("floats").cast(pl.Float32).alias("floats_smallfootprint"),
    )

print(out)
shape: (5, 2)
┌─────────────────────────┬───────────────────────┐
│ integers_smallfootprint ┆ floats_smallfootprint │
│ ---                     ┆ ---                   │
│ i16                     ┆ f32                   │
╞═════════════════════════╪═══════════════════════╡
│ 1                       ┆ 4.0                   │
│ 2                       ┆ 5.0                   │
│ 3                       ┆ 6.0                   │
│ 4                       ┆ 7.0                   │
│ 5                       ┆ 8.0                   │
└─────────────────────────┴───────────────────────┘

try:
    out = df.select(pl.col("big_integers").cast(pl.Int8))
    print(out)
except Exception as e:
    print(e)
#conversion from `i64` to `i8` failed in column 'big_integers' for 3 out of 5 values: [10000002, 10000004, 10000005]

out=df.select(pl.col("big_integers").cast(pl.Int8, strict=False))
print(out)
shape: (5, 1)
┌──────────────┐
│ big_integers │
│ ---          │
│ i8           │
╞══════════════╡
│ 1            │
│ null         │
│ 3            │
│ null         │
│ null         │
└──────────────┘
```
<br/>

**字符串类型  Strings**
```python
df = pl.DataFrame(
    {
        "integers": [1, 2, 3, 4, 5],
        "float": [4.0, 5.03, 6.0, 7.0, 8.0],
        "floats_as_string": ["4.0", "5.0", "6.0", "7.0", "8.0"],
    }
)

print(df)
shape: (5, 3)
┌──────────┬───────┬──────────────────┐
│ integers ┆ float ┆ floats_as_string │
│ ---      ┆ ---   ┆ ---              │
│ i64      ┆ f64   ┆ str              │
╞══════════╪═══════╪══════════════════╡
│ 1        ┆ 4.0   ┆ 4.0              │
│ 2        ┆ 5.03  ┆ 5.0              │
│ 3        ┆ 6.0   ┆ 6.0              │
│ 4        ┆ 7.0   ┆ 7.0              │
│ 5        ┆ 8.0   ┆ 8.0              │
└──────────┴───────┴──────────────────┘

out=df.select(
        pl.col("integers").cast(pl.String),
        pl.col("float").cast(pl.String),
        pl.col("floats_as_string").cast(pl.Float64),
    )

print(out)
shape: (5, 3)
┌──────────┬───────┬──────────────────┐
│ integers ┆ float ┆ floats_as_string │
│ ---      ┆ ---   ┆ ---              │
│ str      ┆ str   ┆ f64              │
╞══════════╪═══════╪══════════════════╡
│ 1        ┆ 4.0   ┆ 4.0              │
│ 2        ┆ 5.03  ┆ 5.0              │
│ 3        ┆ 6.0   ┆ 6.0              │
│ 4        ┆ 7.0   ┆ 7.0              │
│ 5        ┆ 8.0   ┆ 8.0              │
└──────────┴───────┴──────────────────┘

df = pl.DataFrame({"strings_not_float": ["4.0", "not_a_number", "6.0", "7.0", "8.0"]})
print(df)
shape: (5, 1)
┌───────────────────┐
│ strings_not_float │
│ ---               │
│ str               │
╞═══════════════════╡
│ 4.0               │
│ not_a_number      │
│ 6.0               │
│ 7.0               │
│ 8.0               │
└───────────────────┘

#运行会报错
out=df.select(pl.col("strings_not_float").cast(pl.Float64))

#设置非严格模式，忽略错误，置为null
out=df.select(pl.col("strings_not_float").cast(pl.Float64,strict=False))
print(out)
shape: (5, 1)
┌───────────────────┐
│ strings_not_float │
│ ---               │
│ f64               │
╞═══════════════════╡
│ 4.0               │
│ null              │
│ 6.0               │
│ 7.0               │
│ 8.0               │
└───────────────────┘
```
<br/>

**布尔类型  Booleans**

数值型与布尔型可以相互转换，但是不允许字符型转换为布尔型
```python
df = pl.DataFrame(
    {
        "integers": [-1, 0, 2, 3, 4],
        "floats": [0.0, 1.0, 2.0, 3.0, 4.0],
        "bools": [True, False, True, False, True],
    }
)

print(df)
shape: (5, 3)
┌──────────┬────────┬───────┐
│ integers ┆ floats ┆ bools │
│ ---      ┆ ---    ┆ ---   │
│ i64      ┆ f64    ┆ bool  │
╞══════════╪════════╪═══════╡
│ -1       ┆ 0.0    ┆ true  │
│ 0        ┆ 1.0    ┆ false │
│ 2        ┆ 2.0    ┆ true  │
│ 3        ┆ 3.0    ┆ false │
│ 4        ┆ 4.0    ┆ true  │
└──────────┴────────┴───────┘

out=df.select(pl.col("integers").cast(pl.Boolean), 
              pl.col("floats").cast(pl.Boolean)
             )
print(out)
shape: (5, 2)
┌──────────┬────────┐
│ integers ┆ floats │
│ ---      ┆ ---    │
│ bool     ┆ bool   │
╞══════════╪════════╡
│ true     ┆ false  │
│ false    ┆ true   │
│ true     ┆ true   │
│ true     ┆ true   │
│ true     ┆ true   │
└──────────┴────────┘
```
<br/>

**时间类型  Dates**

`Date` 或 `Datetime` 等时间数据类型表示为自纪元（1970年1月1日）以来的天数（`Date`）和微秒数（`Datetime`），因此数值类型与时间数据类型能直接相互转换

字符串类型与时间类型，可以通过 dt.to_string、str.to_datetime进行相互转换
```python
from datetime import date, datetime

df = pl.DataFrame(
    {
        "date": pl.date_range(date(2022, 1, 1), date(2022, 1, 5), eager=True),
        "datetime": pl.datetime_range(
            datetime(2022, 1, 1), datetime(2022, 1, 5), eager=True
        ),
    }
)

print(df)
shape: (5, 2)
┌────────────┬─────────────────────┐
│ date       ┆ datetime            │
│ ---        ┆ ---                 │
│ date       ┆ datetime[μs]        │
╞════════════╪═════════════════════╡
│ 2022-01-01 ┆ 2022-01-01 00:00:00 │
│ 2022-01-02 ┆ 2022-01-02 00:00:00 │
│ 2022-01-03 ┆ 2022-01-03 00:00:00 │
│ 2022-01-04 ┆ 2022-01-04 00:00:00 │
│ 2022-01-05 ┆ 2022-01-05 00:00:00 │
└────────────┴─────────────────────┘

out=df.select(pl.col("date").cast(pl.Int64),
              pl.col("datetime").cast(pl.Int64)
             )

print(out)
shape: (5, 2)
┌───────┬──────────────────┐
│ date  ┆ datetime         │
│ ---   ┆ ---              │
│ i64   ┆ i64              │
╞═══════╪══════════════════╡
│ 18993 ┆ 1640995200000000 │
│ 18994 ┆ 1641081600000000 │
│ 18995 ┆ 1641168000000000 │
│ 18996 ┆ 1641254400000000 │
│ 18997 ┆ 1641340800000000 │
└───────┴──────────────────┘

df = pl.DataFrame(
    {
        "date": pl.date_range(date(2022, 1, 1), date(2022, 1, 5), eager=True),
        "string": [
            "2022-01-01",
            "2022-01-02",
            "2022-01-03",
            "2022-01-04",
            "2022-01-05",
        ],
    }
)

print(df)
shape: (5, 2)
┌────────────┬────────────┐
│ date       ┆ string     │
│ ---        ┆ ---        │
│ date       ┆ str        │
╞════════════╪════════════╡
│ 2022-01-01 ┆ 2022-01-01 │
│ 2022-01-02 ┆ 2022-01-02 │
│ 2022-01-03 ┆ 2022-01-03 │
│ 2022-01-04 ┆ 2022-01-04 │
│ 2022-01-05 ┆ 2022-01-05 │
└────────────┴────────────┘

out=df.select(
    pl.col("date").dt.to_string("%Y-%m-%d"),
    pl.col("string").str.to_datetime("%Y-%m-%d"),
    pl.col("string").str.to_date("%Y-%m-%d").alias("string_to_data")
)

print(out)
shape: (5, 3)
┌────────────┬─────────────────────┬────────────────┐
│ date       ┆ string              ┆ string_to_data │
│ ---        ┆ ---                 ┆ ---            │
│ str        ┆ datetime[μs]        ┆ date           │
╞════════════╪═════════════════════╪════════════════╡
│ 2022-01-01 ┆ 2022-01-01 00:00:00 ┆ 2022-01-01     │
│ 2022-01-02 ┆ 2022-01-02 00:00:00 ┆ 2022-01-02     │
│ 2022-01-03 ┆ 2022-01-03 00:00:00 ┆ 2022-01-03     │
│ 2022-01-04 ┆ 2022-01-04 00:00:00 ┆ 2022-01-04     │
│ 2022-01-05 ┆ 2022-01-05 00:00:00 ┆ 2022-01-05     │
└────────────┴─────────────────────┴────────────────┘
```

# 历史相关文章
- [Python polars学习-01 读取与写入文件](../Python_polars学习-01_读取与写入文件/)
- [Python polars学习-02 上下文与表达式](../../polars-学习/Python_polars学习-02_上下文与表达式/)
- [Python pandas 里面的数据类型坑，astype要慎用](../../Python数据处理/Python-pandas-里面的数据类型坑，astype要慎用/)
- [Python pandas.str.replace 不起作用](../../Python数据处理/Python-pandas-str-replace-不起作用/)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
