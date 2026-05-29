---
title: Python 内置的 os 模块常用函数、方法
slug: Python基础库/Python内置的-os-模块常用函数、方法
published: 2020-07-11
description: Python os基础库
image: /python.jpg
showCoverInPost: false
tags: [python, 基础库]
category: Python/Python基础库
draft: false
---

# 前言
无论是在自己Windows、MacOS电脑，还是在Linux服务器，在操作文件时，多多少少都会涉及到文件的管理。
Python里面有个自带的 **`os`** 模块，专门是用来对文件、路径等进行管理的工具，下面列出一些自己在工作中常用的函数、方法，供大家参考学习。

# 路径的正确表示，三种都可以
1. 由于`\`是转义的意思，所以路径都用`\\`表示，例如：
`'C:\\Users\\abc\\Desktop'`
2. 如果想用单个`\`，可以在前面加个`r`，例如：
`r'C:\Users\abc\Desktop'`
3. 也可以用`/`来表示，例如：
`'C:/Users/abc/Desktop'`

# 点点们的介绍

`./`   当前你所编辑的这个脚本所在目录
`../`  当前你所编辑的这个脚本所在目录的上一级目录

# os 模块常用函数、方法
- **无需pip安装，可以直接导入**
```python
import os
```
<br/>

- **获取当前工作路径**
也就是你编写的这个脚本所在的文件夹位置
```python
os.getcwd()    #C:\\Users\\abc\\Desktop\\Python\\python库
```
<br/>

- **获取绝对路径**
```python
path='./111.xlsx'
os.path.abspath(path)    #C:\\Users\\abc\\Desktop\\Python\\python库\\111.xlsx
```
<br/>

- **获取文件的完整路径里面的文件名字**
```python
a='C:\\Users\\abc\\Desktop\\Python\\python库\\111.xlsx'
os.path.basename(a)     #111.xlsx
```
<br/>

- **获取文件的完整路径里面的路径**
```python
a='C:\\Users\\abc\\Desktop\\Python\\python库\\111.xlsx'
os.path.dirname(a)     #C:\\Users\\abc\\Desktop\\Python\\python库
```
<br/>

- **判断是否存在相应的文件或文件夹**
```python
a='./111.xlsx'
b='C:\\Users\\abc\\Desktop\\Python\\python库\\111'
os.path.exists(a)    #True
os.path.exists(b)   #False
```
<br/>

- **分隔文件的完整路径为：路径、文件名字**
相对上面的方法，这样可以一次都获取到，但是也有缺点，os.path.split**只识别`/`，不识别`\\`**，因此在用该方法时，需要先进行替换
```python
a='C:\\Users\\abc\\Desktop\\Python\\python库\\111.xlsx'
b,c=os.path.split(a.replace('\\','/'))
#b  C:/Users/abc/Desktop/Python/python库
#c  111.xlsx
```
<br/>

- **删除存在的文件**
```python
a='./111.xlsx'
os.remove(a)    #无返回值，直接删除该文件
```
<br/>

- **创建文件夹**
建议用makedirs方法，这样即可以直接创建单级文件夹，有可以创建多层级文件夹
```python
os.makedirs('./a')
os.makedirs('./1/2')
```
以上这些方法是在工作中经常使用的，如有新的路径的需求可以在其他一些网站进行查找
# 历史相关文章
- [利用Python枚举所有的排列情况](../../数学知识/利用Python枚举所有的排列情况/)
- [Python jupyter 常用语句汇总](../../Python数据处理/Python-jupyter-常用语句汇总/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
