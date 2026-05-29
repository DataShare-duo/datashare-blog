---
title: Python math模块详解
slug: Python基础库/Python-math模块详解
published: 2020-08-30
description: Python math基础库
image: /python.jpg
showCoverInPost: false
tags: [python, 基础库]
category: Python/Python基础库
draft: false
---


# 概述

math模块是内置模块，提供了许多对浮点数的数学运算函数，提供类似C语言标准定义的数学函数（This module provides access to the mathematical functions defined by the C standard）

包含以下 **`七部分`** 函数：

- **算术函数**（Number-theoretic and representation functions）
- **幂函数与对数函数**（Power and logarithmic functions）
- **三角函数**（Trigonometric functions）
- **角度转换函数**（Angular conversion）
- **双曲函数**（Hyperbolic functions）
- **特殊函数**（Special functions）
- **常量**（Constants）

# math模块常用函数

虽然math模块提供的函数很多，但是现阶段工作中使用的很少，下面就列出一些实际工作中常用的函数：

注意：虽然math是内置模块，但使用前需要先import导入该库

```python
import math
```
<br/> 

- **math.ceil(x)----------向上取整**

```python
>>> math.ceil(2.1)
3
>>> math.ceil(3.7)
4
>>> math.ceil(-1.5)
-1
>>> math.ceil(-3.1)
-3
```
<br/> 

- **math.floor(x)----------向下取整**

```python
>>> math.floor(1.2)
1
>>> math.floor(4.8)
4
>>> math.floor(-0.1)
-1
>>> math.floor(-2.8)
-3
```
<br/> 

- **math.exp(x)----------e的x次方，其中 e = 2.718281… 是自然对数的基数**

```python
>>> math.exp(1)
2.718281828459045
>>> math.exp(2)
7.38905609893065
>>> math.exp(0)
1.0
```
<br/> 

- **math.log(x,base=e)---------- 默认返回x 的自然对数,默认底为 e，如果指定底，返回指定底的对数**

```python
>>> math.log(math.exp(1))
1.0
>>> math.log(math.exp(0))
0.0
>>> math.log(math.exp(2))
2.0
>>> math.log(4,base=2)
2.0
>>> math.log(9,base=3)
2.0
>>> math.log(100,base=10)
2.0
```
<br/> 

- **math.pow(x, y)---------- x 的 y 次幂**

```python
>>> math.pow(2,3)
8.0
>>> math.pow(4,2)
16.0
>>> math.pow(-5,2)
25.0
```
<br/> 

- **math.sqrt(x)---------- x 的算术平方根，也就是正数的平方根**

```python
>>> math.sqrt(25)
5.0
>>> math.sqrt(4)
2.0
>>> math.sqrt(10)
3.1622776601683795
```
<br/> 

- **math.pi---------- 常量π，15位小数**

```python
>>> math.pi
3.141592653589793
```
<br/> 

- **math.e---------- 常量e，15位小数**

```python
>>> math.e
2.718281828459045
```
<br/> 

- **math.sin(x)---------- x弧度的正弦值**

```python
>>> math.sin(math.pi/2)
1.0
>>> math.sin(math.pi/3)
0.8660254037844386
>>> math.sin(math.pi/6)    #近似0.5
0.49999999999999994
>>> math.sin(math.pi/4)
0.7071067811865476
```
<br/> 

- **math.cos(x)---------- x弧度的余弦值**

```python
>>> math.cos(0)
1.0
>>> math.cos(math.pi/3)    #近似0.5
0.5000000000000001
>>> math.cos(math.pi/4)  
0.7071067811865476
```
<br/> 

- **math.degrees(x)----------将角度 x 从弧度转换为度数**

```python
>>> math.degrees(math.pi)
180.0
>>> math.degrees(math.pi/2)
90.0
>>> math.degrees(math.pi/6)    #近似30
29.999999999999996
```
<br/> 

- **math.radians(x)----------将角度 x 从度数转换为弧度**

```python
>>> math.radians(90)
1.5707963267948966
>>> math.radians(180)
3.141592653589793
>>> math.radians(360)
6.283185307179586
```

*度数、弧度概念可参考历史相关文章，有详细说明*

# 历史相关文章
- [利用Python计算两个地理位置之间的中点](../../Python数据处理/利用Python计算两个地理位置之间的中点/)
- [Python Numpy中的范数](../../Python数据处理/Python--Numpy中的范数/)

------

**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号，不定期分享干货**
