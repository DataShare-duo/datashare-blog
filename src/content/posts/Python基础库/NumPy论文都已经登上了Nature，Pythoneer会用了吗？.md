---
title: NumPy论文都已经登上了Nature，Pythoneer会用了吗？
slug: Python基础库/NumPy论文都已经登上了Nature，Pythoneer会用了吗？
published: 2020-09-25
description: NumPy 基础知识
image: ./python.jpg
showCoverInPost: false
tags: [python,numpy]
category: Python/Python基础库
draft: false
---

# 背景
NumPy（Numerical Python）诞生已经过去了 15 年，前一段时间NumPy 核心开发团队的论文终于发表，详细介绍了使用 NumPy 的数组编程（Array programming），并且登上了Nature 。

>NumPy 是什么？它是大名鼎鼎的使用 Python 进行科学计算的基础软件包，是 Python 生态系统中数据分析、机器学习、科学计算的主力军，极大简化了向量与矩阵的操作处理。
>- 功能强大的 N 维数组对象
>- 精密广播功能函数
>- 集成 C/C++ 和 Fortran 代码的工具
>- 强大的线性代数、傅立叶变换和随机数功能

在平时数据处理中，大部分人用的都是Pandas，用Numpy的场景可能比较少，但是Pandas是基于Numpy实现的更高级的库，使大家用起来更方便。但在做深度学习时用Numpy比较多，比如：图像处理，图片里面其实都是Numpy数组；音频处理；文本处理等等。

下面为大家介绍一些Numpy的常用基础
# Numpy基础
- **安装** <br/>
由于Numpy是第三方库，默认是不集成在Python里面，所以就需要手动安装一下：
如果你安装的是Anaconda，那么就不用再安装了，请忽略
如果你是从官方网站下载的Python，那么你就需要手动安装一下这个库
```python
#指定阿里云镜像，安装更快
pip install numpy -i https://mirrors.aliyun.com/pypi/simple/   
```

- **导入** <br/>
默认成规，`numpy`导入后命名为 `np`，所以在python脚本（程序）里面看见`np`一般都是代表`numpy`
```python
import numpy as np   
```
- **认识Ndarray** <br/>
计算机里面能计算的就是数字，也就是数学里面的各种数字，我们都知道数学里面的数组可以有多层，也就是多维，1维就是向量，2维就是矩阵，3维就是$x y z$坐标轴构成的空间（形象理解），但体现在`numpy`中就是N 维数组对象 `ndarray`，它是一系列同类型数据的集合。

*1维：*
```python
>>> import numpy as np
>>> a=np.array([1,2,3,4])
>>> print(a)
[1 2 3 4]
>>> type(a)
<class 'numpy.ndarray'>
>>> a.ndim
1
```
*2维：*
```python
>>> import numpy as np
>>> b=np.array([[1,2,3],[4,5,6]])
>>> print(b)
[[1 2 3]
 [4 5 6]]
>>> type(b)
<class 'numpy.ndarray'>
>>> b.ndim
2
```
- **切片和索引** <br/>
切片、索引与python内置的列表、字符串的切片和索引基本一样，如果理解了列表的切片和索引，那么`ndarray`对象就不在话下
```python
>>> import numpy as np
>>> a=np.arange(10)
>>> print(a)
[0 1 2 3 4 5 6 7 8 9]
>>> type(a)
<class 'numpy.ndarray'>
>>> a.ndim
1
>>> a[:5]
array([0, 1, 2, 3, 4])
>>> a[7:]
array([7, 8, 9])
>>> a[3:6]
array([3, 4, 5])
>>> a[::2]
array([0, 2, 4, 6, 8])
>>> a[::-1]
array([9, 8, 7, 6, 5, 4, 3, 2, 1, 0])

>>> a[0]
0
>>> a[5]
5
```
- **数组操作**

***修改数组形状***
```python
>>> import numpy as np
>>> a=np.arange(10)
>>> print(a)
[0 1 2 3 4 5 6 7 8 9]
>>> type(a)
<class 'numpy.ndarray'>
>>> a.ndim
1
>>> b=a.reshape(5,2)
>>> print(b)
[[0 1]
 [2 3]
 [4 5]
 [6 7]
 [8 9]]
>>> b.ndim
2
>>> c=a.reshape(2,5)
>>> print(c)
[[0 1 2 3 4]
 [5 6 7 8 9]]
>>> c.ndim
2
```
***数组转置***
```python
>>> import numpy as np
>>> a=np.arange(12).reshape(3,4)
>>> print(a)
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]]
>>> np.transpose(a)
array([[ 0,  4,  8],
       [ 1,  5,  9],
       [ 2,  6, 10],
       [ 3,  7, 11]])
>>> a.T
array([[ 0,  4,  8],
       [ 1,  5,  9],
       [ 2,  6, 10],
       [ 3,  7, 11]])
```
***数组连接*** <br/>
`concatenate`、`stack`、`hstack`、`vstack`这个几个函数均是数组连接，原理基本都一样，只要理解了其中一个，其他的都很好理解，这里只介绍`concatenate`
```python
>>> import numpy as np
>>> a=np.array([[1,2],[3,4]]
... )
>>> b=np.array([[5,6],[7,8]])
>>> np.con
np.concatenate( np.conj(        np.conjugate(   np.convolve(
>>> np.concatenate([a,b],axis=0)   #沿着0轴拼接
array([[1, 2],
       [3, 4],
       [5, 6],
       [7, 8]])
>>> np.concatenate([a,b],axis=1)   #沿着1轴拼接
array([[1, 2, 5, 6],
       [3, 4, 7, 8]])
```
***修改数组维度***
```python
>>> import numpy as np
>>> x=np.array([1,2])
>>> np.expand_dims(x,axis=0)
array([[1, 2]])
>>> np.expand_dims(x,axis=1)
array([[1],
       [2]])
>>> y=np.array([[1,2]])
>>> np.squeeze(y)    #从给定数组的形状中删除一维，当前维必须等于1
array([1, 2])
```
- **数组计算**
```python
>>> import numpy as np
>>> a1=np.array([1,2,3,4])
>>> a2=np.array([5,5,5,5])
>>> a1+a2
array([6, 7, 8, 9])
>>> np.add(a1,a2)
array([6, 7, 8, 9])
>>> a1-a2
array([-4, -3, -2, -1])
>>> np.subtract(a1,a2)
array([-4, -3, -2, -1])
>>> a1*a2
array([ 5, 10, 15, 20])
>>> np.multiply(a1,a2)
array([ 5, 10, 15, 20])
>>> a1/a2
array([0.2, 0.4, 0.6, 0.8])
>>> np.divide(a1,a2)
array([0.2, 0.4, 0.6, 0.8])
```
# 历史相关文章
- [Python Numpy中的范数](../Python数据处理/Python--Numpy中的范数.md)
- [Pythonner还在为了练习Numpy而没有真实数据而烦恼吗？](../Python数据处理/Pythonner还在为了练习Numpy而没有真实数据而烦恼吗？.md)
**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号DataShare，不定期分享干货**


