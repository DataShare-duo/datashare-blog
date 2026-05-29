---
title: Python-字典已经是有序的，你知道吗？
slug: Python基础库/Python-字典已经是有序的，你知道吗？
published: 2023-11-21
description: Python 字典
image: /python.jpg
showCoverInPost: false
tags: [python, 基础库]
category: Python/Python基础库
draft: false
---


# 背景
随着Python版本的更新，背后的一些数据结构会进行不断优化迭代，重新进行架构设计，以实现内存减少、性能提升。其中字典的底层数据结构在Python3.6版本时，重新进行了设计，从而优化了字典的内存占用 

具体的底层细节这里不做过多介绍，感兴趣的同学可以看一下这篇文章：
**《为什么Python 3.6以后字典有序并且效率更高？》**
地址：[https://zhuanlan.zhihu.com/p/73426505](https://zhuanlan.zhihu.com/p/73426505)

>*该文章的评论精彩评论：*
一句话解释：从Python3.6开始，dict的实现由 **哈希表** 改成 **链式哈希表**

# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])   
#python 版本： 3.11.4
```
# 测试代码
```python
#创建测试数据
keys=[chr(i) for i in range(97,123)]
values=range(1,27)

#生成字典
dic={}
for key,value in zip(keys,values):
    dic[key]=value

#打印字典
print(dic)
#{'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 
#'g': 7, 'h': 8, 'i': 9, 'j': 10, 'k': 11, 'l': 12,
# 'm': 13, 'n': 14, 'o': 15, 'p': 16, 'q': 17, 
#'r': 18,'s': 19, 't': 20, 'u': 21, 'v': 22,
# 'w': 23, 'x': 24, 'y': 25, 'z': 26}


#遍历字典
for key,value in dic.items():
    print(key,':',value,end=',')
#a : 1,b : 2,d : 4,e : 5,f : 6,g : 7,h : 8,j : 10,
#k : 11,l : 12,n : 14,o : 15,p : 16,q : 17,r : 18,
#s : 19,t : 20,u : 21,v : 22,w : 23,x : 24,z : 26,

#删除测试
del dic['c']
del dic['y']
del dic['i']
del dic['m']

print(dic)
#{'a': 1, 'b': 2, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 
#'h': 8, 'j': 10, 'k': 11, 'l': 12, 'n': 14, 'o': 15,
#'p': 16, 'q': 17, 'r': 18, 's': 19, 't': 20,
#'u': 21, 'v': 22, 'w': 23, 'x': 24, 'z': 26}

```
# 结论
**经过添加、删除操作可以看出，字典是按添加键值对时的先后顺序保存数据，是有序的**

# 历史相关文章
- [Python 标准库之pathlib，路径操作](../../Python基础库/Python-标准库之pathlib，路径操作/)
- [Python 记录re正则模块，方便后期查找使用](../../Python基础库/Python-记录re正则模块，方便后期查找使用/)
- [Python 内建模块 bisect，数组二分查找算法](../../Python基础库/Python-内建模块-bisect，数组二分查找算法/)
- [Python 标准库heapq，堆数据结构操作详解](../../Python基础库/Python-标准库heapq，堆数据结构操作详解/)
- [Python math模块详解](../../Python基础库/Python-math模块详解/)




**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
