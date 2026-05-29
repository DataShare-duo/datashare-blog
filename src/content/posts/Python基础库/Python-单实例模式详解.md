---
title: Python 单实例模式详解
slug: Python基础库/Python-单实例模式详解
published: 2025-08-22
description: Python 单实例模式
image: /python.jpg
showCoverInPost: false
tags: [python, 类]
category: Python/Python基础库
draft: false
---


# 背景
你是否听说过 Python 中的 **单实例模式（Singleton Pattern）**？ ，小编之前在阅读别人代码的时候曾经遇到过，一直不知道那段代码什么含义，后来在搜索资料时，才知道那段代码的含义是创建单实例，也正是从那之后，才知道这个名词 **“单实例”**，是 Python 中的一种设计模式，用大白话说就是类的实例对象在内存中只有一个

# 单实例模式代码
```python
class Singleton:
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Singleton, cls).__new__(cls, *args, **kwargs)
        return cls._instance
```


# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.11
```

# 借助大模型进行详细解释

首次创建实例对象时，类的属性 `_instance = None`，然后程序会进入 if 条件进行执行，重点语句：
```python
cls._instance = super(Singleton, cls).__new__(cls, *args, **kwargs)
# cls._instance = super().__new__(cls, *args, **kwargs)
```
**1. `super(Singleton, cls)` 的作用**
- super函数：用于获取父类（基类）的方法，继承父类，进行父类初始化的用法
- 参数含义：
  - `Singleton`：当前类
  - `cls`：当前类的引用（在类方法中，cls代表类本身）

这种写法明确指定了从`Singleton`类开始，在MRO(Method Resolution Order)中查找父类。在Python 3中可以简化为`super()`，但这种写法更清晰地展示了继承关系

**2. `.__new__(cls, *args, **kwargs)`**
- 调用父类的`__new__`方法：这是实际创建对象实例的关键步骤
```text
super(Singleton, cls).__new__(cls) → 实际调用object.__new__(Singleton)
```
在 CPython（Python 的官方实现）中，`object.__new__` 是用 C 语言实现的底层函数。它的核心工作是：
1. 内存分配：为新对象分配适当的内存空间
2. 对象初始化：设置对象的基本结构
3. 返回原始对象：返回一个"空"的、未初始化的对象实例


**`object.__new__` 是底层实现，它不会触发 Python 层面的 `__new__` 方法调用**
当 `object.__new__` 执行时：
1. 它直接操作内存分配，不经过 Python 的方法查找机制
2. 它是解释器内置的 C 函数，不是 Python 函数
3. 它的工作就是创建原始对象，不会检查或调用任何 `__new__` 方法


**`object.__new__(Singleton) `的工作原理：**
1. 内存分配：为 Singleton 实例分配适当大小的内存
2. 对象初始化：设置基本对象头（类型指针、引用计数等）
3. 返回原始对象：返回一个"空"的、未初始化的对象实例


**3. 返回赋值 `cls._instance=`**
经过第2步之后，会将原始对象赋值给 `cls._instance`，其实是类在内存中的地址/指针，这样类的属性不再为`None`，后续如果再次创建实例时，直接返回第一次创建好的实例对象


# 单例模式的核心优点
1. 节省内存资源：在内存中只有一个对象，避免了重复创建实例带来的内存浪费
2. 减少系统开销：单例可长驻内存，避免频繁的创建和销毁对象，减少系统开销
3. 全局访问点：提供一个全局访问点，允许在应用程序中轻松访问该唯一实例
4. 数据同步控制：全局只有一个接入点，可以更好地进行数据同步控制，避免多重占用 


# 单例模式的实际应用场景
1. 日志记录器：应用程序通常只需要一个日志记录器实例，避免多个日志文件冲突
2. 数据库连接池：数据库连接是稀缺资源，使用单例模式可以统一管理连接，避免资源浪费
3. 配置管理：应用程序的全局配置通常只需要一个实例，保证配置的一致性，比如大模型在内存/GPU中只初始化一次，来处理所有的用户请求
4. 缓存系统：全局缓存需要统一管理，避免多个缓存实例导致数据不一致

# 历史相关文章
- [Python collections详解：解锁高效数据结构](../../Python基础库/Python-collections详解：解锁高效数据结构/)
- [Python 函数参数类型与使用规则详解](../../Python基础库/Python-函数参数类型与使用规则详解/)
- [Python 2个好用的装饰器函数](../../Python基础库/Python-2个好用的装饰器函数/)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
