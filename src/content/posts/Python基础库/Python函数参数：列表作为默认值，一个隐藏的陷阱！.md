---
title: Python 函数参数：列表作为默认值，一个隐藏的陷阱！
slug: Python基础库/Python函数参数：列表作为默认值，一个隐藏的陷阱！
published: 2025-08-05
description: Python 函数参数
image: /python.jpg
showCoverInPost: false
tags: [python, 函数]
category: Python/Python基础库
draft: false
---


# 背景
在Python编程中，函数参数的设计直接影响代码的健壮性和可预测性。**一个需要警惕的实践是：避免将可变对象（尤其是列表）作为函数参数的默认值。**这样做可能导致极其隐蔽且令人困惑的bug

# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.11
```
# 现象：一个诡异的“记忆”功能
想象你设计了一个函数，用来记录新添加的学生姓名到某个班级列表。如果列表为空，则创建一个新列表：
```python
def add_student(name, student_list=[]):
    student_list.append(name)
    return student_list

# 第一次调用：添加Alice
class1 = add_student("Alice")
print(class1)  # 输出: ['Alice'] 

# 第二次调用：添加Bob
class2 = add_student("Bob")
print(class2)  # 输出: ['Alice', 'Bob'] 
```
**问题来了：** 第二次调用**add_student("Bob")**时，并没有传递**student_list**参数，期望的是生成一个只包含**"Bob"**的新列表。但结果却包含了第一次添加的**"Alice"**！这个函数似乎“记住了”之前的调用

# 原因揭秘：列表是引用类型
要理解这个问题的本质，必须明白Python中变量的工作方式：
1. **列表是引用类型**
在Python中，变量存储的是对象的引用（内存地址），而不是对象本身。当你将一个列表赋值给变量时，实际上是在创建一个指向列表对象的引用。

2. **默认参数的创建时机**
当Python解释器遇到函数定义时，它会立即创建默认参数对象。对于列表这样的可变对象，这意味着只有一个列表对象被创建，并且这个对象会持续存在于整个程序的生命周期中。

3. **函数调用时的陷阱**
当你多次调用函数而不提供参数时，Python不会创建新的列表，而是重复使用同一个默认列表对象。因为列表是可变的，每次对它的修改都会永久改变这个共享对象。

4. **引用传递的后果**
由于函数操作的是指向同一个列表对象的引用，所有使用默认参数的调用实际上都在操作同一个物理列表。这就是为什么数据会"神奇地"在函数调用之间保留下来

# 解决方案：使用不可变默认参数
正确的做法是使用 **None** 作为哨兵值
```python
def add_item(item, items=None):
    if items is None:
        items = []  # 每次调用都创建新列表
    items.append(item)
    return items
```
# 历史相关文章
- [Python 2个好用的装饰器函数](../../Python基础库/Python-2个好用的装饰器函数/)
- [Python 迈向强类型化的优雅转变](../../Python基础库/Python-迈向强类型化的优雅转变/)
- [Python 字典已经是有序的，你知道吗？](../../Python基础库/Python-字典已经是有序的，你知道吗？/)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
