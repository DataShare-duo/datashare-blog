---
title: Python通过修改系统注册表，强制设置Excel宏信任级别
slug: Python数据处理/Python通过修改系统注册表，强制设置Excel宏信任级别
published: 2020-03-10
description: Python 设置Excel宏信任级别
image: /python.jpg
showCoverInPost: false
tags: [python, Excel]
category: Python/Python数据处理
draft: false
---


# 背景
最近在进行财务平台报告自动化建设，由于涉及的都是Excel文件，并且文件里面有很多合并单元格情况，所以在处理数据时用pandas不是很方便，综合考虑后利用VBA来处理。

自己也是先学的VBA，后学的Python，所以平台上的一些功能很快开发完，接下来问题就出现了，在Python调用VBA时，出现程序不能运行的情况，经过反复排查发现是宏信任级别的问题。

![宏已被禁用.png](./images/6641583-0066f804b71fe9ac.webp)

出现这种情况，可以通过手动修改宏的信任级别，在文件---选项----信任中心----宏设置，把宏设置为“启用所有宏”，如下所示：

![信任中心.png](./images/6641583-1e4c3d3090b0df67.webp)
![信任级别.png](./images/6641583-989350f43de5055e.webp)

但是作为自动化平台，需要考虑到程序健壮性，不能总是手动来修改，于是在网上查找了相关资料，发现可以通过修改**系统注册表**的方法，来规避这个问题
![注册表.png](./images/6641583-7bb74d074a7d0fe3.webp)

# 注册表是什么？

>注册表（Registry，繁体中文版Windows操作系统称之为登录档）是Microsoft Windows中的一个重要的数据库，用于存储系统和应用程序的设置信息。早在Windows 3.0推出OLE技术的时候，注册表就已经出现。随后推出的Windows NT是第一个从系统级别广泛使用注册表的操作系统。但是，从Microsoft Windows 95操作系统开始，注册表才真正成为Windows用户经常接触的内容，并在其后的操作系统中继续沿用至今。

从定义来看，**注册表是用于存储系统和应用程序的设置信息**

# 通过Python修改注册表
```python
#导入相关库
import winreg
import win32com.client

#定义Excel程序
xl=win32com.client.Dispatch("Excel.Application")

#指定注册表文件夹位置并获取
subkey='Software\\Microsoft\\Office\\' + xl.Version+'\\Excel\\Security'
key=winreg.OpenKey(winreg.HKEY_CURRENT_USER,subkey,0, winreg.KEY_SET_VALUE)

#修改宏信任级别为1
winreg.SetValueEx(key, 'VBAWarnings', 0, winreg.REG_DWORD, 1)
```
通过以上程序，及可以成功把Excel宏的信任级别修改为“启用所有宏”，这样就全部实现了自动化

**************************************************************************
**以上是自己实践中遇到的一些点，分享出来供大家参考学习，欢迎关注微信公众号DataShare，不定期分享干货**


