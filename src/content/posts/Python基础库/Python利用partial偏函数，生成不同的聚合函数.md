---
title: Python 利用partial偏函数，生成不同的聚合函数
slug: Python基础库/Python利用partial偏函数，生成不同的聚合函数
published: 2023-12-26
description: Python partial偏函数
image: ./python.jpg
showCoverInPost: false
tags: [python, partial, 基础库]
category: Python/Python基础库
draft: false
---


# 介绍
偏函数(`functools.partial`)，主要用来解决函数中某些参数是已知的固定值。利用偏函数的概念，可以生成一些新的函数，在调用这些新函数时，不用再传递固定值的参数，这样可以使代码更简洁

下面列举一些偏函数的巧妙使用方法，在使用偏函数时，需要从标准库`functools`中导入
```python
from functools import partial
```

# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])   
#python 版本： 3.11.4
```
# 生成不同的聚合函数
**1. 创建底层的元函数、函数类**
```python
from functools import partial

def aggregation_fn_meta(aggregation_fn, values):
    return aggregation_fn(values)

def aggregation_fn_class(aggregation_fn):
    return partial(aggregation_fn_meta, aggregation_fn)
```
<br/> 

**2. 基于函数类，来生成不同的聚合函数**
- 基于内建函数创建（python中可以直接使用的函数）
```python
sum_fn=aggregation_fn_class(sum)
sum_fn([1,2,3,4,5,1,2,10])   #28

max_fn=aggregation_fn_class(max)
max_fn([1,2,3,4,5,1,2,10])   #10

min_fn=aggregation_fn_class(min)
min_fn([1,2,3,4,5,1,2,10])
```

- 基于自定义函数创建
```
def count(values):
    return len(values)

count_fn=aggregation_fn_class(count)
count_fn([1,2,3,4,5,1,2,10])    #8


def distinct_count(values):
    return len(set(values))

distinct_count_fn=aggregation_fn_class(distinct_count)
distinct_count_fn([1,2,3,4,5,1,2,10])   #6
```

# 历史相关文章
- [Python 标准库之pathlib，路径操作](./Python-标准库之pathlib，路径操作.md)
- [Python 记录re正则模块，方便后期查找使用](./Python-记录re正则模块，方便后期查找使用.md)
- [Python 内建模块 bisect，数组二分查找算法](./Python-内建模块-bisect，数组二分查找算法.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
