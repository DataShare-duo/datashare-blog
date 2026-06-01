---
title: Python Numpy中的范数
slug: Python数据处理/Python--Numpy中的范数
published: 2020-08-17
description: Python Numpy范数
image: /python.jpg
showCoverInPost: false
tags: [python, numpy, 数学]
category: Python/Python数据处理
draft: false
---

# 数学概念
范数，是具有 “长度” 概念的**函数**。在线性代数、泛函分析及相关的数学领域，范数是一个函数，是矢量空间内的所有矢量赋予非零的正长度或大小。

在数学上，范数包括`向量范数`和`矩阵范数`

L1 范数和 L2 范数，用于机器学习的 L1 正则化、L2 正则化。对于线性回归模型，使用 L1 正则化的模型建叫做 Lasso 回归，使用 L2 正则化的模型叫做 Ridge 回归（岭回归）。

其作用是：
L1 正则化是指权值向量 w 中各个元素的绝对值之和，可以产生稀疏权值矩阵（稀疏矩阵指的是很多元素为 0，只有少数元素是非零值的矩阵，即得到的线性回归模型的大部分系数都是 0. ），即产生一个稀疏模型，可以用于特征选择；

L2 正则化是指权值向量 w 中各个元素的平方和然后再求平方根，可以防止模型过拟合（overfitting）；一定程度上，L1 也可以防止过拟合。
# Numpy函数介绍
```python
np.linalg.norm(x, ord=None, axis=None, keepdims=False)
```
np.linalg.norm：linalg=linear（线性）+algebra（代数），norm则表示范数

- `x`：表示矩阵（也可以是一维）
- `ord`：范数类型
- `axis`：轴向
axis=1表示按行向量处理，求多个行向量的范数
axis=0表示按列向量处理，求多个列向量的范数
axis=None表示矩阵范数。
- `keepdims`：是否保持矩阵的二维特性
True表示保持矩阵的二维特性，False相反

![范数](./images/6641583-695708a23e80c229.webp)

# 例子
- **向量**
```python
>>> import numpy as np
>>> x=np.array([1,2,3,4])
>>> np.linalg.norm(x)      #默认是二范数，所有向量元素绝对值的平方和再开方
5.477225575051661
>>> np.sqrt(1**2+2**2+3**2+4**2)
5.477225575051661
>>> np.linalg.norm(x,ord=1)    #所有向量元素绝对值之和
10.0
>>> 1+2+3+4
10
>>> np.linalg.norm(x,ord=np.inf)     #max(abs(x_i))，所有向量元素绝对值中的最大值
4.0
>>> np.linalg.norm(x,ord=-np.inf)   #min(abs(x_i))，所有向量元素绝对值中的最小值
1.0
```
- **矩阵**
```python
>>> import numpy as np
>>> x=np.arange(12).reshape(3,4)
>>> x
array([[ 0,  1,  2,  3],
       [ 4,  5,  6,  7],
       [ 8,  9, 10, 11]])
>>> np.linalg.norm(x)  #默认是二范数，最大特征值的算术平方根
22.494443758403985
>>> np.linalg.norm(x,ord=1)   #所有矩阵列向量绝对值之和的最大值
21.0
>>> x
array([[ 0,  1,  2,  3],
       [ 4,  5,  6,  7],
       [ 8,  9, 10, 11]])
>>> np.linalg.norm(x,ord=1,axis=1)   #行向量的一范数
array([ 6., 22., 38.])
>>> np.linalg.norm(x,ord=2,axis=1)     #行向量的二范数
array([ 3.74165739, 11.22497216, 19.13112647])
>>> np.linalg.norm(x,ord=1,axis=1,keepdims=True)   #结果仍然是个矩阵
array([[ 6.],
       [22.],
       [38.]])
```
# 历史相关文章
- [Pythonner还在为了练习Numpy而没有真实数据而烦恼吗？](../../Python数据处理/Pythonner还在为了练习Numpy而没有真实数据而烦恼吗？/)
- [Numpy中的shuffle和permutation区别](../../Python数据处理/Numpy中的shuffle和permutation区别/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号，不定期分享干货**
