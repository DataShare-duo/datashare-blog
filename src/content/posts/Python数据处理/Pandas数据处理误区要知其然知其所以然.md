---
title: Pandas数据处理误区要知其然知其所以然
slug: Python数据处理/Pandas数据处理误区要知其然知其所以然
published: 2020-01-21
description: Python Pandas
image: /python.jpg
showCoverInPost: false
tags: [python, pandas]
category: Python/Python数据处理
draft: false
---


# 背景
在Python里面处理数据，必然离不开Pandas，但目前网上的文章大部分都是介绍函数怎么使用，至于为什么有时数据处理结果是错误的，并没有深入研究，也可能是由于Pandas的一些BUG，没有人提出，下面介绍几个误区，看与你一直以为的一样吗
# 数据准备
平时大家都是从其他一些文件或数据库导入，在这里直接手动模拟一些数据，大家可以仔细看看这些数据有什么区别

```python
>>> import pandas as pd
>>> df=pd.DataFrame({'x':[1,1,2,3,4,5,5,6],
                     'y':['A','B','C','D','E','F','E','A'],
                     'z':[11,21,32,34,'65',56,31,45]})
>>> df
   x  y   z
0  1  A  11
1  1  B  21
2  2  C  32
3  3  D  34
4  4  E  65
5  5  F  56
6  5  E  31
7  6  A  45
```
# df[x] 与 df[[x]] 区别
乍一看上去，这两个可能并没有什么区别，都是对x列的引用，其实是有区别的，并且区别还是比较大，不信就看看
```
>>> df['x']
0    1
1    1
2    2
3    3
4    4
5    5
6    5
7    6
Name: x, dtype: int64
>>> df[['x']]
   x
0  1
1  1
2  2
3  3
4  4
5  5
6  5
7  6
>>> 
```
![df['x'] 与 df[['x']]区别](./images/6641583-bca8cc08c734418f.webp)
上面程序打印结果一下看不出什么区别，下面的图片是不是一下就有区别了，为什么一个没有显示格式，一个是有格式；一个显示变量名称、数据类型，一个什么都没有，那就接着往下看，打印一下他们是Pandas里面的什么类型

```python
>>> type(df['x'])
<class 'pandas.core.series.Series'>
>>> type(df[['x']])
<class 'pandas.core.frame.DataFrame'>
```
是不是恍然大悟，**虽然都是对`x`列变量的引用，但是返回的结果是不一样的，一个是Series，一个是DataFrame，那么后续在这个结果上的操作肯定也是有很大区别，Series与DataFrame的方法、属性 各有千秋，区别很大**
# 数据类型'object'
在创建数据时，一共创建了3列，其中`x`列与`z`列看出有什么区别了吗？没有仔细看的认为两列不都是数值吗？？？，**其实并不然**

```python
>>> df.dtypes
x     int64
y    object
z    object
dtype: object
```
怎么z列是`object`类型，那就再看一下创建数据时的z到底是什么：
`'z':[11,21,32,34,'65',56,31,45]`，中间的`'65'`是字符型，所以导致`z`是`object`类型，也就说明：
**pandas在检查数据类型时，当遇到数值型与字符型时，用字符型类型来代表这一列的类型，但里面每个值具体的类型还是原来的真实类型；都是数值型的则会转变，具体测试如下所示**

```python
>>> df1=pd.DataFrame({'x':[1,1,2,3.0,4,5,5,6],'y':['A','B','C','D','E','F','E','A']})
>>> df1
     x  y
0  1.0  A
1  1.0  B
2  2.0  C
3  3.0  D
4  4.0  E
5  5.0  F
6  5.0  E
7  6.0  A
>>> df1.dtypes
x    float64
y     object
dtype: object
>>> df
   x  y   z
0  1  A  11
1  1  B  21
2  2  C  32
3  3  D  34
4  4  E  65
5  5  F  56
6  5  E  31
7  6  A  45
>>> for i in df['z']:
	  print(type(i))
<class 'int'>
<class 'int'>
<class 'int'>
<class 'int'>
<class 'str'>
<class 'int'>
<class 'int'>
<class 'int'>
>>> for i in df1['x']:
	  print(type(i))
<class 'float'>
<class 'float'>
<class 'float'>
<class 'float'>
<class 'float'>
<class 'float'>
<class 'float'>
<class 'float'>
```
**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**

