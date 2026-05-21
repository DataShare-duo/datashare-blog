---
title: Python 内建模块-bisect，数组二分查找算法
slug: Python基础库/Python-内建模块-bisect，数组二分查找算法
published: 2023-05-10
description: Python bisect基础库
image: ./python.jpg
showCoverInPost: false
tags: [python, 基础库]
category: Python/Python基础库
draft: false
---

# 介绍
bisect模块提供了一种只针对 **已排序的序列** 的方法，快速找到插入元素的位置，这个模块使用二分查找算法，算法的时间复杂度相对更低一些，可以用于程序优化提升性能

官方文档：https://docs.python.org/3/library/bisect.html#module-bisect

函数分为 `bisect`、`insort` 两大块

# 各函数详解
- **bisect、bisect_right**
这两个函数功能一模一样，`bisect` 是对 `bisect_right` 的引用，用于查找元素在已经排序的序列中应该插入的位置，返回值为最靠右 or 最大的索引位置
```python
l = [1, 23, 45, 12, 23, 42, 54, 123, 14, 52, 3]
l.sort()

print(l)  #[1, 3, 12, 14, 23, 23, 42, 45, 52, 54, 123]
print(bisect.bisect(l, 3))  #2
```

- **bisect_left**
返回值为最靠左 or 最小的索引
```python
l = [1, 23, 45, 12, 23, 42, 54, 123, 14, 52, 3]
l.sort()

print(l)  #[1, 3, 12, 14, 23, 23, 42, 45, 52, 54, 123]
print(bisect.bisect_left(l, 3))  #1
```

- **insort、insort_right**
这两个函数功能一模一样，`insort` 是对 `insort_right` 的引用，用于将一个元素插入到已经排序的序列中，并且保持序列的排序状态，插入位置为最靠右 or 最大的索引位置
```python
l = [1, 23, 45, 12, 23, 42, 54, 123, 14, 52, 3]
l.sort()

print(l)  #[1, 3, 12, 14, 23, 23, 42, 45, 52, 54, 123]

bisect.insort(l, 3.0)
print(l)  #[1, 3, 3.0, 12, 14, 23, 23, 42, 45, 52, 54, 123]
```

- **insort_left**
插入位置为最靠左 or 最小的索引位置
```python
li = [1, 23, 45, 12, 23, 42, 54, 123, 14, 52, 3]
li.sort()

print(li)  #[1, 3, 12, 14, 23, 23, 42, 45, 52, 54, 123]

bisect.insort_left(li, 3.0)
print(li)  #[1, 3.0, 3, 12, 14, 23, 23, 42, 45, 52, 54, 123]
```

# 官方文档案例
```python
def grade(score, breakpoints=[60, 70, 80, 90], grades='FDCBA'):
    i = bisect.bisect(breakpoints, score)
    return grades[i]

[grade(score) for score in [33, 99, 77, 70, 89, 90, 100]]
#['F', 'A', 'C', 'C', 'B', 'A', 'A']
```

# 历史相关文章
- [Python 标准库heapq，堆数据结构操作详解](./Python-标准库heapq，堆数据结构操作详解.md)
- [Python math模块详解](./Python-math模块详解.md)
- [Python内置的 os 模块常用函数、方法](./Python内置的-os-模块常用函数、方法.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
