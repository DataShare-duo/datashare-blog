---
title: polars学习-08_分类数据处理
slug: polars-学习/Python_polars学习-08_分类数据处理
published: 2024-07-08
description: Polars 分类数据处理
image: ./polars.svg
tags: [python, polars]
category: Python/Polars-学习
draft: false
---

# 背景
polars学习系列文章，第8篇 分类数据处理（Categorical data）

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
# 分类数据 Categorical data
分类数据就是平时在数据库中能进行编码的数据，比如：性别、年龄、国家、城市、职业 等等，可以对这些数据进行编码，可以节省存储空间

Polars 支持两种不同的数据类型来处理分类数据：`Enum` 和 `Categorical`
- 当类别预先已知时使用 `Enum`，需要提前提供所有类别
- 当不知道类别或类别不固定时，可以使用 `Categorical`
```python
enum_dtype = pl.Enum(["Polar", "Panda", "Brown"])
enum_series = pl.Series(
    ["Polar", "Panda", "Brown", "Brown", "Polar"], 
    dtype=enum_dtype)

cat_series = pl.Series(
    ["Polar", "Panda", "Brown", "Brown", "Polar"], 
    dtype=pl.Categorical
)
```
# Categorical 类型
`Categorical` 相对比较灵活，不用提前获取所有的类别，当有新类别时，会自动进行编码

当对来自2个不同的 Categorical 类别列直接进行拼接时，以下这种方式会比较慢，polars 是根据字符串出现的先后顺序进行编码，不同的字符串在不同的序列里面编码可能不一样，直接合并的话全局会再进行一次编码，速度会比较慢：
```python
cat_series = pl.Series(
    ["Polar", "Panda", "Brown", "Brown", "Polar"], dtype=pl.Categorical
)
cat2_series = pl.Series(
    ["Panda", "Brown", "Brown", "Polar", "Polar"], dtype=pl.Categorical
)

#CategoricalRemappingWarning: Local categoricals have different encodings, 
#expensive re-encoding is done to perform this merge operation. 
#Consider using a StringCache or an Enum type if the categories are known in advance
print(cat_series.append(cat2_series))
```

可以通过使用 polars 提供的全局字符缓存 `StringCache`，来提升数据处理效率
```python
with pl.StringCache():
    cat_series = pl.Series(
        ["Polar", "Panda", "Brown", "Brown", "Polar"], dtype=pl.Categorical
    )
    cat2_series = pl.Series(
        ["Panda", "Brown", "Brown", "Polar", "Polar"], dtype=pl.Categorical
    )
    print(cat_series.append(cat2_series))
```
# Enum
上面来自2个不同类型列进行拼接的耗时的情况，在`Enum`中不会存在，因为已经提前获取到了全部的类别
```python
dtype = pl.Enum(["Polar", "Panda", "Brown"])
cat_series = pl.Series(["Polar", "Panda", "Brown", "Brown", "Polar"], dtype=dtype)
cat2_series = pl.Series(["Panda", "Brown", "Brown", "Polar", "Polar"], dtype=dtype)

print(cat_series.append(cat2_series))
#shape: (10,)
#Series: '' [enum]
[
	"Polar"
	"Panda"
	"Brown"
	"Brown"
	"Polar"
	"Panda"
	"Brown"
	"Brown"
	"Polar"
	"Polar"
]
```
如果有编码的字符串类别，当不在提前获取的`Enum`中时，则会报错：`OutOfBounds`
```python
dtype = pl.Enum(["Polar", "Panda", "Brown"])
try:
    cat_series = pl.Series(["Polar", "Panda", "Brown", "Black"], dtype=dtype)
except Exception as e:
    print(e)
#conversion from `str` to `enum` failed 
#in column '' for 1 out of 4 values: ["Black"]
#Ensure that all values in the input column are present 
#in the categories of the enum datatype.
```
# 比较
- Categorical vs Categorical
- Categorical vs String
- Enum vs Enum
- Enum vs String(该字符串必须要在提前获取的Enum中)

## Categorical vs Categorical
```python
with pl.StringCache():
    cat_series = pl.Series(["Brown", "Panda", "Polar"], dtype=pl.Categorical)
    cat_series2 = pl.Series(["Polar", "Panda", "Black"], dtype=pl.Categorical)
    print(cat_series == cat_series2)
#shape: (3,)
#Series: '' [bool]
[
	false
	true
	false
]

```
## Categorical vs String
```python
cat_series = pl.Series(["Brown", "Panda", "Polar"], dtype=pl.Categorical)
print(cat_series <= "Cat")
#shape: (3,)
#Series: '' [bool]
[
	true
	false
	false
]

cat_series = pl.Series(["Brown", "Panda", "Polar"], dtype=pl.Categorical)
cat_series_utf = pl.Series(["Panda", "Panda", "A Polar"])
print(cat_series <= cat_series_utf)
#shape: (3,)
#Series: '' [bool]
[
	true
	true
	false
]
```
## Enum vs Enum
```python
dtype = pl.Enum(["Polar", "Panda", "Brown"])
cat_series = pl.Series(["Brown", "Panda", "Polar"], dtype=dtype)
cat_series2 = pl.Series(["Polar", "Panda", "Brown"], dtype=dtype)
print(cat_series == cat_series2)
#shape: (3,)
#Series: '' [bool]
[
	false
	true
	false
]
```
## Enum vs String(该字符串必须要在提前获取的Enum中)
```python
try:
    cat_series = pl.Series(
        ["Low", "Medium", "High"], dtype=pl.Enum(["Low", "Medium", "High"])
    )
    cat_series <= "Excellent"
except Exception as e:
    print(e)
#conversion from `str` to `enum` failed 
#in column '' for 1 out of 1 values: ["Excellent"]
#Ensure that all values in the input column are present 
#in the categories of the enum datatype.

dtype = pl.Enum(["Low", "Medium", "High"])
cat_series = pl.Series(["Low", "Medium", "High"], dtype=dtype)
print(cat_series <= "Medium")
#shape: (3,)
#Series: '' [bool]
[
	true
	true
	false
]

dtype = pl.Enum(["Low", "Medium", "High"])
cat_series = pl.Series(["Low", "Medium", "High"], dtype=dtype)
cat_series2 = pl.Series(["High", "High", "Low"])
print(cat_series <= cat_series2)
#shape: (3,)
#Series: '' [bool]
[
	true
	true
	false
]
```
# 历史相关文章
- [Python polars学习-01 读取与写入文件](./Python_polars学习-01_读取与写入文件.md)
- [Python polars学习-02 上下文与表达式](./Python_polars学习-02_上下文与表达式.md)
- [Python polars学习-03 数据类型转换](./Python_polars学习-03_数据类型转换.md)
- [Python polars学习-04 字符串数据处理](./Python_polars学习-04_字符串数据处理.md)
- [Python polars学习-05 包含的数据结构](./Python_polars学习-05_包含的数据结构.md)
- [Python polars学习-06 Lazy / Eager API](./Python_polars学习-06_Lazy-Eager-API.md)
- [Python polars学习-07 缺失值](./Python_polars学习-07_缺失值.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
