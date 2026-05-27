---
title: Python pandas数据计数函数 value_counts
slug: Python数据处理/Python-pandas数据计数函数value_counts
published: 2020-01-09
description: Python Pandas
image: /pandas.svg
tags: [python, pandas]
category: Python/Python数据处理
draft: false
---


# value_counts介绍
value_counts是一种查看表格某列中有多少个不同值的快捷方法，并计算每个不同值有在该列中个数，类似Excel里面的count函数

**其是pandas下面的顶层函数，也可以作用在Series、DataFrame下**

```python
pd.value_counts(
    values,
    sort=True,        #是否排序，默认是要排序
    ascending=False,     #默认降序排列
    normalize=False,     #标准化、转化成百分比形式
    bins=None,    #可以自定义分组区间，默认是没有，但也可以自定义区间
    dropna=True,   #是否删除nan，默认删除
)
```
常规用法：
```python
import pandas as pd

pd.value_counts()
df.value_counts()
df['字段'].value_counts()
```
#创建模拟数据
```python
>>> import pandas as pd
>>> data=pd.DataFrame({'字段1':[1,2,3,4,5,6,5,3,2,4,5,4,4,4,6],
                   '字段2':['A','B','B','A','A','A','B','B','B','C','C','C','C','B','B']})
>>> data
    字段1 字段2
0     1   A
1     2   B
2     3   B
3     4   A
4     5   A
5     6   A
6     5   B
7     3   B
8     2   B
9     4   C
10    5   C
11    4   C
12    4   C
13    4   B
14    6   B

>>> data.dtypes
字段1     int64
字段2    object
dtype: object
```
# Series情况下:
pandas 的 value_counts() 函数可以对Series里面的每个值进行计数**并且**排序，默认是降序
```python
>>> data['字段2'].value_counts()
B    7
C    4
A    4
Name: 字段2, dtype: int64

>>> data['字段1'].value_counts()
4    5
5    3
6    2
3    2
2    2
1    1
Name: 字段1, dtype: int64
```

**可以看出，既可以对分类变量统计，也可以对连续数值变量统计**

如果是要对结果升序排列，可以添加`ascending=True`来改变
```python
>>> data['字段2'].value_counts(ascending=True)
A    4
C    4
B    7
Name: 字段2, dtype: int64
```
如果不想看统计的个数，而是想看占比，那么可以设置`normalize=True`即可，结果是小数形式
```python
>>> data['字段2'].value_counts(normalize=True)
B    0.466667
C    0.266667
A    0.266667
Name: 字段2, dtype: float64
```
# DataFrame情况下
可以通过apply，对每一列变量进行统计
```python
>>> data.apply(pd.value_counts)
   字段1  字段2
1  1.0  NaN
2  2.0  NaN
3  2.0  NaN
4  5.0  NaN
5  3.0  NaN
6  2.0  NaN
A  NaN  4.0
B  NaN  7.0
C  NaN  4.0
```
# 通过pandas进行调用
```python
>>> pd.value_counts(data['字段2'])
B    7
C    4
A    4
Name: 字段2, dtype: int64
```
**************************************************************************
**以上是自己实践中遇到的一些点，分享出来供大家参考学习，欢迎关注DataShare公众号**
