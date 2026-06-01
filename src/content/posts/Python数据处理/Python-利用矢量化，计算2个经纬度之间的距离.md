---
title: Python 利用矢量化，计算2个经纬度之间的距离
slug: Python数据处理/Python-利用矢量化，计算2个经纬度之间的距离
published: 2024-08-20
description: Python 矢量化计算距离
image: /python.jpg
showCoverInPost: false
tags: [python, numpy, polars]
category: Python/Python数据处理
draft: false
---

# 背景
假如全国所有的酒店/民宿经纬度信息已知的情况下，基于当前位置，怎么快速计算附近5KM内的酒店/民宿呢？现实中有大量的这种业务场景，需要快速计算2点间的地球距离

本篇文章 **不从地理的知识进行优化** ，比如当前的定位是在北京，那么没有必要去计算与上海的酒店/民宿距离；**只从数据计算角度** 来进行优化，看看性能大约能提升多少

# 小编运行环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.9

import pandas as pd

print("pandas 版本：",pd.__version__)
#pandas 版本： 2.2.2
```

# 模拟数据
本次小编用全国 10W个位置点来进行模拟
```python
data=pd.read_excel('data_test.xlsx',
                   sheet_name='data',
                   engine='calamine')

print(len(data)) #100000

print(data.head())
#id   longitude   latitude
0  id1  114.657838  30.077734
1  id2  105.150585  27.599929
2  id3   97.396759  22.805973
3  id4  124.282532  41.283089
4  id5  115.477867  23.781731
```

# 基于单点计算距离
计算当前点与每个点之间的距离
```python
from math import sin, asin, cos, radians, fabs, sqrt

EARTH_RADIUS = 6371      # 地球平均半径大约6371km


def hav(theta):
    s = sin(theta / 2)
    return s * s


def get_distance_hav(lat0, lng0, lat1, lng1):
    # 用haversine公式计算球面两点间的距离
    # 经纬度转换成弧度
    lat0 = radians(lat0)
    lat1 = radians(lat1)
    lng0 = radians(lng0)
    lng1 = radians(lng1)
    dlng = fabs(lng0 - lng1)
    dlat = fabs(lat0 - lat1)
    h = hav(dlat) + cos(lat0) * cos(lat1) * hav(dlng)
    distance = 2 * EARTH_RADIUS * asin(sqrt(h))      # km
    return distance
```

下面进行测速看看花费多长时间，在jupyter中测试的
```python
%%timeit -n10 -r10

# import timeit

result={}
for row1 in data.itertuples():
#     start=time.time()
    
    near_id=[]
    
    for row2 in data.itertuples():
        
        if row1.id != row2.id \
        and get_distance_hav(row1.latitude,
                             row1.longitude,
                             row2.latitude,
                             row2.longitude)<=10.0:
            
            near_id.append(row2.id)
            
    result[row1.id]=near_id
    
#     print(f"耗时：{time.time()-start}秒")
    break
```
**测速结果：**
运行一次大约需要 412ms
```shell
412 ms ± 5.41 ms per loop (mean ± std. dev. of 10 runs, 10 loops each)
```

# 基于 numpy 矢量化计算距离
利用 `numpy` 矢量化来计算，一次计算当前点与所有点的距离，`numpy` 底层基于 C语言开发，可以加速运算
```python
import numpy as np

EARTH_RADIUS = 6371  # 地球平均半径大约6371km

def hav(theta):
    s = np.sin(theta / 2)
    return s * s

def get_distance_hav_vectorized(lat0, lng0, lat1, lng1):
    # 用haversine公式计算球面两点间的距离
    # 经纬度转换成弧度
    lat0 = np.radians(lat0)
    lat1 = np.radians(lat1)
    lng0 = np.radians(lng0)
    lng1 = np.radians(lng1)
    
    dlng = np.abs(lng0 - lng1) 
    dlat = np.abs(lat0 - lat1)
    
    h = hav(dlat) + np.cos(lat0) * np.cos(lat1) * hav(dlng)
    distance = 2 * EARTH_RADIUS * np.arcsin(np.sqrt(h))  # km
    
    return distance
``` 
下面进行测速看看花费多长时间，在jupyter中测试的
```python
%%timeit -n10 -r100

result={}

# 对 data 逐行处理
for row in data.itertuples():
#     start = time.time()
    
    t = get_distance_hav_vectorized(row.latitude,
                                    row.longitude,
                                    data['latitude'],
                                    data['longitude'])
    
    result[row.id] = ','.join(data.loc[(0<t) & (t<=10.0),'id'].to_list())
    
    break
    
# print(f"耗时：{time.time() - start}秒")
```
**测速结果：**
运行一次大约需要 7ms，相比单点计算速度提升了大约 59倍
```shell
6.72 ms ± 417 µs per loop (mean ± std. dev. of 100 runs, 10 loops each)
```

# 基于 polars 矢量化计算距离
利用 `polars` 矢量化来计算，`polars` 底层基于 Rust 语言开发，也可以加速运算
```python
import polars as pl

print(pl.__version__) #1.2.1

data_pl = pl.read_excel('data_test.xlsx',sheet_name='data')

import math

EARTH_RADIUS = 6371  # 地球平均半径大约6371km

def hav_pl(theta):
    s = (theta / 2).sin()
    return s * s


def get_distance_hav_vectorized_pl(lat0, lng0, lat1, lng1):
    # 用haversine公式计算球面两点间的距离
    # 经纬度转换成弧度
    
    lat0 = math.radians(lat0)
    lng0 = math.radians(lng0)
    
    lat1=lat1.to_frame().select(pl.col("latitude").radians())
    lng1=lng1.to_frame().select(pl.col("longitude").radians())
    
    
    
    dlng = (lng0 - lng1.to_series()).abs()
    dlat = (lat0 - lat1.to_series()).abs()
    
    h = hav_pl(dlat) + math.cos(lat0) * lat1.to_series().cos() * hav_pl(dlng)
    distance = 2 * EARTH_RADIUS * h.sqrt().arcsin()  # km
    
    return distance
```
下面进行测速看看花费多长时间，在jupyter中测试的
```
%%timeit -n10 -r100

result={}

for row in data_pl.iter_rows(named=True):
    
    t = get_distance_hav_vectorized_pl(row['latitude'],
                                       row['longitude'],
                                       data_pl['latitude'],
                                       data_pl['longitude'])
    
    
    result[row['id']] = ','.join(data_pl.filter((t>0) & (t<=5))['id'].to_list())
    
    break
```
**测速结果：**
运行多次后，测速结果稳定在 4.1ms左右，相比 `numpy` 略好一些
```shell
4.07 ms ± 162 µs per loop (mean ± std. dev. of 100 runs, 10 loops each)
```

# 历史相关文章
- [利用Python计算两个地理位置之间的中点](../../Python数据处理/利用Python计算两个地理位置之间的中点/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**

