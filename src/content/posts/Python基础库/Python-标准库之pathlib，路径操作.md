---
title: Python 标准库之pathlib，路径操作
slug: Python基础库/Python-标准库之pathlib，路径操作
published: 2023-09-27
description: Python pathlib基础库
image: ./python.jpg
showCoverInPost: false
tags: [python, 基础库]
category: Python/Python基础库
draft: false
---

# 背景
`pathlib` 标准库是在 Python3.4 引入，到现在最近版 3.11 已更新了好几个版本，主要是用于路径操作，相比之前的路径操作方法 `os.path` 有一些优势，有兴趣的同学可以学习下

>**官方文档：** [https://docs.python.org/zh-cn/3/library/pathlib.html](https://docs.python.org/zh-cn/3/library/pathlib.html)
![官方pathlib图片](./images/6641583-9e5a96f92df24f82.png)

# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])   #python 版本： 3.11.4
```

# 主要方法、函数
该模块中主要使用的是 `Path` 类
- ## 导入模块
```python
from pathlib import Path
```
- ## 获取当前工作目录
```python
Path.cwd()   #WindowsPath('D:/桌面/Python/标准库')
```
- ## 获取用户 home 目录
```python
Path.home()   #WindowsPath('C:/Users/admin')
```
- ## 获取绝对路径
```python
file = Path('pathlib_demo1.py')
print(file)   #WindowsPath('pathlib_demo1.py')
file.resolve()  #WindowsPath('D:/桌面/Python/标准库/pathlib_demo1.py')
```
- ## 获取文件属性
```python
file = Path('pathlib_demo1.py')
print(file)   #WindowsPath('pathlib_demo1.py')

file.stat()  
'''
os.stat_result(st_mode=33206, st_ino=1970324837176895, st_dev=2522074357, 
st_nlink=1, st_uid=0, st_gid=0, st_size=273, 
st_atime=1695642854, st_mtime=1695611301, st_ctime=1695611241)
'''

#文件大小
file.stat().st_size   #273B

#最近访问时间 access ，It represents the time of most recent access 
file.stat().st_atime  #1695625134.9083948

#创建时间 create，It represents the time of most recent metadata change on Unix and creation time on Windows.
file.stat().st_ctime  #1695611241.5981772

#修改时间  modify，It represents the time of most recent content modification
file.stat().st_mtime  #1695611301.1193473
```
- ## 查看当前工作目录文件及文件夹
```python
for f in path.iterdir():
    print(f)
    print('is_file:',f.is_file())  #判断是否为文件
    print('is_dir:',f.is_dir())   #判断是否为文件夹
    print('='*30)

'''
D:\桌面\Python\标准库\.ipynb_checkpoints
is_file: False
is_dir: True
==============================
D:\桌面\Python\标准库\pathlib.ipynb
is_file: True
is_dir: False
==============================
D:\桌面\Python\标准库\pathlib_demo1.py
is_file: True
is_dir: False
==============================
'''
```
- ## 路径的各个组成部分
```python
file=Path('D:\桌面\Python\标准库\pathlib_demo1.py')

file.name  #'pathlib_demo1.py'
file.stem  #'pathlib_demo1'
file.suffix   #'.py'
file.parent   #WindowsPath('D:/桌面/Python/标准库')
file.anchor  #'D:\\'
file.parent.parent  #WindowsPath('D:/桌面/Python')

#获取所有的父级路径，层层递进
list(file.parents)
'''
[WindowsPath('D:/桌面/Python/标准库'),
 WindowsPath('D:/桌面/Python'),
 WindowsPath('D:/桌面'),
 WindowsPath('D:/')]
'''
```
- ## 路径拼接
支持2种方式
```python
#第1种方式：使用 /
Path.home() / 'dir' / 'file.txt'  #WindowsPath('C:/Users/admin/dir/file.txt')

#第2种方式：使用方法
Path.home().joinpath('dir', 'file.txt')  #WindowsPath('C:/Users/admin/dir/file.txt')
```

- ## 判断路径、文件是否存在
```python
#当前文件件里面是否存在 子目录 archive/demo.txt 文件
Path("archive/demo.txt").exists()  #False

#当前文件件里面是否存在 二级子目录 dir/subdir  
Path('dir/subdir').exists()   #True

#当前文件件里面是否存在 pathlib_demo1.py 文件
Path("pathlib_demo1.py").exists()  #True
```

# 历史相关文章
- [Python 记录re正则模块，方便后期查找使用](./Python-记录re正则模块，方便后期查找使用.md)
- [Python 内建模块 bisect，数组二分查找算法](./Python-内建模块-bisect，数组二分查找算法.md)
- [Python 标准库heapq，堆数据结构操作详解](./Python-标准库heapq，堆数据结构操作详解.md)
- [Python math模块详解](./Python-math模块详解.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
