---
title: Python 标准库heapq，堆数据结构操作详解
slug: Python基础库/Python-标准库heapq，堆数据结构操作详解
published: 2023-03-17
description: Python heapq基础库
image: /python.jpg
showCoverInPost: false
tags: [python, 基础库]
category: Python/Python基础库
draft: false
---


*注：本文章由ChatGPT gpt-3.5-turbo 生成，小编进行略微调整*
*提出的问题：heapq详细讲解*
# 背景
最近小编在读《Python Cookbook》书籍时，遇到一个新的标准库 `heapq`，该库主要涉及堆数据结构，自己之前没有用过，所以就问了一下 ChatGPT，给出的内容非常详细且容易理解，分享出来供大家参考

# heapq介绍
heapq 是 Python 标准库中的一个基于堆的优先队列实现。它提供了一些函数来实现对列表中的元素进行加入、弹出、替换等操作，同时也支持对列表中的元素进行建堆、堆排序等高级功能。本文将详细介绍 heapq 的使用方法和内部实现原理。

# 基本用法

**1、heapq.heappush 和 heapq.heappop**

heapq.heappush(lst, item)：将元素 item 加入到列表 lst 中，并保持 lst 始终为一个堆。

heapq.heappop(lst)：从列表 lst 中弹出最小的元素，并保持 lst 始终为一个堆。

下面是一个示例：

```python
import heapq

lst = [10, 30, 2, 20, 50]  # 初始列表
heapq.heapify(lst)        # 建堆
print(lst)                # 输出 [2, 20, 10, 30, 50]

heapq.heappush(lst, 5)    # 将 5 加入到 lst 中
print(lst)                # 输出 [2, 5, 10, 30, 50, 20]

min_item = heapq.heappop(lst)  # 弹出最小元素
print(min_item, lst)           # 输出 2 [5, 20, 10, 30, 50]
```
<br/>

**2、heapq.heapreplace**

heapq.heapreplace(lst, item)：将最小元素替换为 item，并保持 lst 始终为一个堆。

这个函数相当于先执行 heapq.heappop(lst)，再执行 heapq.heappush(lst, item)。使用该函数可以避免在先弹出再加入元素时，列表中出现不合法的状态。例如：

```python
import heapq

lst = [10, 30, 2, 20, 50]   # 初始列表
heapq.heapify(lst)          # 建堆
print(lst)                  # 输出 [2, 20, 10, 30, 50]

heapq.heapreplace(lst, 5)   # 用 5 替换最小元素 2
print(lst)                  # 输出 [5, 20, 10, 30, 50]
```
<br/>

**3、heapq.nlargest 和 heapq.nsmallest**

heapq.nlargest(n, lst)：返回列表 lst 中前 n 个最大的元素，按照从大到小的顺序排序。

heapq.nsmallest(n, lst)：返回列表 lst 中前 n 个最小的元素，按照从小到大的顺序排序。

这两个函数的实现都是先使用 heapq.heappush 和 heapq.heappop 对列表进行处理，之后返回前 n 个元素。示例：

```python
import heapq

lst = [10, 30, 2, 20, 50]  # 初始列表
heapq.heapify(lst)        # 建堆
print(lst)                # 输出 [2, 20, 10, 30, 50]

print(heapq.nlargest(3, lst))  # 输出 [50, 30, 20]
print(heapq.nsmallest(3, lst)) # 输出 [2, 10, 20]
```

# 内部实现原理

Heap 是一种树形数据结构，通常用二叉树来实现。堆树的最上面是根节点，根节点下面的每个节点都比它自己所有的子节点都大（称为大根堆）或者都小（称为小根堆）。根据这个性质，堆树可以快速地找到最大或者最小元素。

Python 中的 heapq 模块实现是使用了一种叫做“二叉堆”的数据结构。二叉堆由固定数量的元素组成，堆的根节点包含所有能够在其中的元素中具有最小或者最大关键字的元素。我们称这个根节点为“最小堆”或者“最大堆”。堆中的每一个其他的节点都符合堆的性质：最小堆中的每一个节点都比它的子节点小；最大堆中的每一个节点都比它的子节点大。

这种数据结构可以直接用一个数组来实现，每个元素在数组中顺序存储，并按照堆的性质排列。数组的第一个元素是根节点，也就是堆的最小或最大元素。根据元素在数组中的位置，可以快速地用简单的数学运算找到它的子节点和父节点

二叉堆分为两种类型：最小堆和最大堆。在 Python 中的 heapq 模块中使用最小堆

Python 中，可以以列表的形式存储二叉堆，将列表作为二叉树，树的根节点即为第一个元素，树的子节点为列表中其左右孩子。具体来说，以第 k 个节点为例，其左孩子为第 2k+1 个节点，右孩子为第 2k+2 个节点，其父节点为第(k-1)//2 个节点

**通过使用 heapq 模块提供的高效的堆算法，可以快速地实现对列表中元素的排序、寻找最大/最小值等常见操作**

# 历史相关文章
- [Python math模块详解](../../Python基础库/Python-math模块详解/)
- [Python内置的 os 模块常用函数、方法](../../Python基础库/Python内置的-os-模块常用函数、方法/)
- [Python加载txt数据乱码问题升级版解决方法](../../Python数据处理/Python加载txt数据乱码问题升级版解决方法/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
