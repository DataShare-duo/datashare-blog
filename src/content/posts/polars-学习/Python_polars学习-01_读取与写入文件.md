---
title: polars学习-01 读取与写入文件
slug: polars-学习/Python_polars学习-01_读取与写入文件
published: 2024-04-24
description: Polars 数据读取与写入文件
image: /polars.svg
tags: [python, polars]
category: Python/Polars-学习
draft: false
---

# 背景
在Python数据处理与分析中，大家在处理数据时，使用的基本都是 `Pandas` ，该库非常好用。随着 Rust 的出圈，基于其开发的 `Polars` 库，逐渐赢得大家的喜爱，在某些功能上更优于 `Pandas`。于是小编在自学的过程中，逐步整理一些资料供大家参考学习，这些资料会分享到github

仓库地址：[https://github.com/DataShare-duo/polars_learn](https://github.com/DataShare-duo/polars_learn)

PS：为了学习 `Polars`，小编先了解一遍 Rust，《Rust权威指南》

# 小编环境
```python
import sys
print('python 版本：',sys.version.split('|')[0])
# python 版本：3.11.5 

import polars as pl
print("polars 版本：",pl.__version__)
# polars 版本： 0.20.22
```

# 读取文件
polars读取文件数据的方式基本与pands一致，所以上手起来很方便，以下演示是在jupyter notebook中执行
- **读取csv文件**
```python
data_csv=pl.read_csv('./data/iris.csv')

data_csv.shape
#(150, 6)
```

- **读取 excel 文件**
1. 默认解析引擎 `xlsx2csv`，需要额外安装 `pip install xlsx2csv`
2. 设置 `engine='calamine'` 时，需要额外安装 `pip install fastexcel`，建议用该解析引擎，速度更快
```python
data_excel=pl.read_excel('./data/iris.xlsx',sheet_name='iris',engine='calamine')

data_excel.shape
#(150, 6)

%timeit pl.read_excel('./data/iris.xlsx',sheet_name='iris')
#13.9 ms ± 69.6 µs per loop (mean ± std. dev. of 7 runs, 100 loops each)

%timeit pl.read_excel('./data/iris.xlsx',sheet_name='iris',engine='calamine')  
#2.9 ms ± 69.9 µs per loop (mean ± std. dev. of 7 runs, 100 loops each)
```

- **读取 txt 文件**
```python
data_txt=pl.read_csv('./data/iris.txt',separator='\t')

data_txt.shape
#(150, 6)
```

- **读取网络上的文件**
```python
url='https://raw.githubusercontent.com/DataShare-duo/Data_for_ML-Deeplearning/master/iris.csv'

data_url=pl.read_csv(url)

data_url.shape
#(150, 6)
```


# 写入文件
- **写入csv文件**
```python
data_csv.write_csv('./data/data_write.csv')
```
- **写入excel文件**
默认的浮点数为3位，可以通过 `float_precision` 参数进行设置
```python
data_csv.write_excel('./data/data_write.xlsx',float_precision=1)
```

# 历史相关文章
- [Python pandas遍历行数据的2种方法](../../Python数据处理/Python-pandas遍历行数据的2种方法/)
- [Python 利用pandas对数据进行特定排序](../../Python数据处理/Python-利用pandas对数据进行特定排序/)
- [Python pandas.str.replace 不起作用](../../Python数据处理/Python-pandas-str-replace-不起作用/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
