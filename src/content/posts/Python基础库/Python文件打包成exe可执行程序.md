---
title: Python文件打包成exe可执行程序
slug: Python基础库/Python文件打包成exe可执行程序
published: 2020-10-19
description: Python 打包程序
image: /python.jpg
showCoverInPost: false
tags: [python, 打包]
category: Python/Python基础库
draft: false
---


# 背景
有时写的Python程序需要交给业务人员使用，但业务人员电脑上基本都没有安装Python，并且业务人员也不会使用命令行，所以就需要把Python程序打包成exe可执行程序，让业务人员无需安装Python，可以直接使用。

这里只针对Windows操作系统的打包，以及只针对业务人员使用场景。（Linux系统基本都是技术开发人员在使用，基本都用的是命令行；而Mac系统不知是否有相关的打包库，可以打包为dmg）
# 打包过程（以下均为在cmd命令行执行）
- **首先安装第三方库：`pyinstaller`**
```python
pip install pyinstaller
```
- **打包** <br/>
需要先切换到打包程序目录，
`cd c:\xxx\xxx`
然后对Python程序进行打包
```python
pyinstaller -F xxx.py
```
- **结果** <br/>
如果打包成功，当前目录下会增加一个新的`dist`文件夹，打开该文件夹，会发现打包好的exe文件：xxx.exe，文件名与Python程序文件相同
- **其他** <br/>
打包大概流程如上所示，除此之外`pyinstaller`支持其他一些功能，比如打包时指定自定义图标，首先需要下载一张正常的ico，不能用直接修改后缀的，然后进行打包，一定是先图标文件路径，再是程序路径，如下所示：
```python
pyinstaller -F  -i xxx.ico xxx.py
```
# 注意事项！！！
- **运行报错** <br/>
虽然经过一番折腾，终于打包好exe可执行程序，但是双击运行时总是报错，无法成功运行，这种情况大多数是因为缺少第三方库造成的。<br/>

**解决方法：** <br/>
在打包之前先在`cmd`运行一次Python程序看是否成功运行
```python
python xxx.py
```
1. 如果能成功运行，那么打包后基本没什么问题
2. 如果运行失败，那么查看报错信息，是否缺少第三方库，然后进行`pip`安装，确保能成功运行

- **文件太大** <br/>
以上打包过程是不是很简单，但是有没有注意打包的exe文件有时会很大，有时几百兆大小，但是自己的Python程序也就几KB，这个问题也是自己之前遇到的难题（使用的是Anaconda），即使另外建立了新的环境也不行（`conda create -n 环境名`）

**解决方法：** <br/> 
一定要使用Python官网下载的原生Python程序，并且确保系统环境变量里面只有这一个Python路径，只有这一个Python路径，只有这一个Python路径！！！

***亲测自己的打包程序从200M降到50M大小***

# 历史相关文章
- [Python 常用语句汇总](../../Python数据处理/Python常用语句汇总/)
- [Linux-（Centos-7）中 Anaconda环境管理，安装不同的版本Python包](../../Linux/Linux-（Centos-7）中-Anaconda环境管理，安装不同的版本Python包/)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号DataShare，不定期分享干货**
