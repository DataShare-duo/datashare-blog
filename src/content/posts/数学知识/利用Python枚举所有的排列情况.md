---
title: 利用Python枚举所有的排列情况
slug: 数据知识/利用Python枚举所有的排列情况
published: 2020-06-08
description: Python 枚举排列
image: /python.jpg
showCoverInPost: false
tags: [python, 基础库]
category: Python/数据知识
draft: false
---


# 概念
>排列组合是组合学最基本的概念。
排列（Permutation），就是指从给定个数的元素中取出指定个数的元素**进行排序**。
组合（Combination）则是指从给定个数的元素中仅仅取出指定个数的元素，**不考虑排序**。

比如有1、2、3这三个数字，要进行排列，则一共有以下6种情况：
- 1，2，3
- 1，3，2
- 2，1，3
- 2，3，1
- 3，1，2
- 3，2，1

数字比较少的时候，咱们可以直接手动一一列举出来，如果有n个数字，怎么快速计算排列数呢？咱们可以靠已有的认知，自己写出公式。
- 第1个数字有多少种情况
从n个数字里面，随机选一个数字，那么肯定有n种情况，比如：箱子里面有n个球，然后随机从箱子里面抓一个球，那么有n种情况

- 第2个数字有多少种情况
前面已经取出一个数字，现在剩下n-1个数字，那么就有n-1种情况

- 第3个数字有多少种情况
同理，前面已经取出二个数字，剩下n-2个数字，那么就有n-2种情况

- …………………………


- 第n个数字有多少种情况
前面已经取出n-1个数字，剩下1个数字，就只能取剩下的1个数字，别无选择，那么就只能有这1种情况

**综合以上情况，那就是**
$$n \times (n-1) \times (n-2) \times \cdots \times 1$$
（数学其实就是这样，并没有什么高深的公式，就是靠一点一点简单的公式累积起来，只要逻辑严谨，推导过程详细，小白也能看得懂）

以上是对给的所有数字进行排列的情况，而更一般的情况是，给n个球，从中选择m个，计算有多少种排列情况，道理和上面一样，下面直接给出计算公式，不再赘述。

**通用公式如下所示：**

![排列计算公式](./images/6641583-27ee1220dbd0efb8.webp)

# Python实现
![排列](./images/6641583-4d6a3f8e43b877b4.webp)

```python
from itertools import permutations

a=list(range(3))

list(permutations(a))

list(permutations(a,2))

list(permutations(range(3)))

list(permutations(range(3),2))
```
