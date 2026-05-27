---
title: pandas-错误提醒：FutureWarning--elementwise-comparison-failed;
slug: Python数据处理/pandas-错误提醒：FutureWarning--elementwise-comparison-failed;
published: 2020-04-29
description: Python Pandas
image: /python.jpg
showCoverInPost: false
tags: [python, pandas]
category: Python/Python数据处理
draft: false
---


# 背景
在数据处理时，对原始数据进行筛选操作，在不注意情况下，会引发`FutureWarning: elementwise comparison failed; returning scalar instead, but in the future will perform elementwise comparison` 警告，究其根本原因就是在进行筛选时，对不同类型进行了比较，导致返回错误的结果

# 复现
- ##### 创建小量模拟数据
可以看出，`字段5`是有2个`7`，现在想筛选出包含`7`的行
![模拟数据](./images/6641583-324009a0166376fa.webp)

- ##### 出现错误提醒
在进行筛选时，对列进行比较，引发错误提醒，`FutureWarning: elementwise comparison failed; returning scalar instead, but in the future will perform elementwise comparison`，导致没有筛选出结果
![错误提醒](./images/6641583-c98c3cc44e15dd1e.webp)

# 解决方法
- ##### 引发问题的根本原因
由于在筛选时用的是逻辑索引，可以先看看逻辑索引结果
![逻辑索引结果](./images/6641583-9723abf3ab839859.webp)

可以看出，逻辑索引结果均为`False`，所以没有成功筛选出数据，由于模拟的数据量比较小，咱们基本一眼就能看出问题所在，那就是在进行比较时，`字段5`的类型明显为`数值型`，而在进行比较时用的是`字符型  ‘7’`，所以导致引发错误提醒，当在进行大量数据操作时，这种错误可能会很难发现

- ##### 解决方法
先进行类型转换，然后再进行比较，即可得出正确的结果

![解决方法](./images/6641583-5ffe0d98523e68e8.webp)

# 总结
我们在进行大数据操作时，一定要对数据类型进行确认，并且是**真实的数据类型**，至于为什么是真实的数据类型，详情可参考历史文章
- [Pandas数据处理误区要知其然知其所以然](./Pandas数据处理误区要知其然知其所以然.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**

