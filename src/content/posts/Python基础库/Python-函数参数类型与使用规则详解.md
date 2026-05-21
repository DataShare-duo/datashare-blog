---
title: Python 函数参数类型与使用规则详解
slug: Python基础库/Python-函数参数类型与使用规则详解
published: 2025-12-03
description: Python 函数参数类型
image: ./python.jpg
showCoverInPost: false
tags: [python, 函数]
category: Python/Python基础库
draft: false
---


# 背景
Python以其灵活性著称，这种特性在函数参数设计中尤为明显。本文将依据语言规范，系统阐述Python函数所支持的全部参数类型及其应用

# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.11
```
# 完整函数参数示例1
```python
def func(pos_only=None, /, pos_kw=None, *, kw_only=None):
```
1.  **仅位置参数 (Positional-only)** ： `/` 前面的参数
**标识**：使用 `/` 符号分隔
**特点**：只能通过位置传递，不能使用参数名
```python
def func(a, b, /, c):
    # a, b 是仅位置参数
    pass

# 正确调用
func(1, 2, 3)      # a=1, b=2, c=3
func(1, 2, c=3)    # a=1, b=2, c=3

# 错误调用
func(a=1, b=2, c=3)  # TypeError: 不能使用关键字传递a, b
```

2. **位置或关键字参数 (Positional-or-keyword)**：` /` 和 `*` 之间的参数
**位置**：在 `/` 之后，`*` 之前（如果没有 `/` 或 `*`，则在所有参数中）
**特点**：既可以通过位置传递，也可以通过关键字传递
```python
def func(a, b, c):
    # 传统写法，所有参数都是位置或关键字参数
    pass

# 两种方式都可以
func(1, 2, 3)       # 位置传递
func(a=1, b=2, c=3) # 关键字传递
func(1, b=2, c=3)   # 混合传递
```

3. **仅关键字参数 (Keyword-only)**：`*` 后面的参数
**标识**：使用 `*` 符号分隔，或者单个 `*`
**特点**：必须使用关键字传递

```python
def func(*, a, b):
    # a, b 是仅关键字参数
    pass

# 正确调用
func(a=1, b=2)

# 错误调用
func(1, 2)  # TypeError: 必须使用关键字参数
```

# 完整函数参数示例2
```python
def comprehensive(
    pos_only_1,          # 仅位置参数
    pos_only_2=10,       # 带默认值的仅位置参数
    /,                   # 分隔符
    pos_kw_1,            # 位置或关键字参数
    pos_kw_2=20,         # 带默认值的位置或关键字参数
    *args,               # 可变位置参数
    kw_only_1,           # 仅关键字参数
    kw_only_2=30,        # 带默认值的仅关键字参数
    **kwargs             # 可变关键字参数
):
    pass

# 调用示例
comprehensive(
    1,              # pos_only_1
    2,              # pos_only_2
    3,              # pos_kw_1
    pos_kw_2=4,     # pos_kw_2
    5, 6,           # 进入args
    kw_only_1=7,    # kw_only_1
    kw_only_2=8,    # kw_only_2
    extra1=9,       # 进入kwargs
    extra2=10       # 进入kwargs
)
```
1. **可变位置参数**：**`*args`**
```python
def func(a, *args, b=10):
    # args收集所有额外的位置参数
    pass

func(1, 2, 3, 4)  # a=1, args=(2,3,4), b=10
```

2. **可变关键字参数**： **`**kwargs`**
```python
def func(a, **kwargs):
    # kwargs收集所有额外的关键字参数
    pass

func(1, x=2, y=3)  # a=1, kwargs={'x':2, 'y':3}
```

# 历史相关文章
- [Python函数参数：列表作为默认值，一个隐藏的陷阱！](/Python基础库/Python函数参数：列表作为默认值，一个隐藏的陷阱！.md)
- [Python-3-14-无GIL解释器性能测试：释放多核CPU的并行潜力](/Python基础库/Python-3-14-无GIL解释器性能测试：释放多核CPU的并行潜力.md)
- [Python-2个好用的装饰器函数](/Python基础库/Python-2个好用的装饰器函数.md)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
