---
title: Python 在指定文件夹安装三方库，并进行加载使用
slug: Python基础库/Python-在指定文件夹安装三方库，并进行加载使用
published: 2025-04-17
description: Python 指定文件夹安装三方库
image: /python.jpg
showCoverInPost: false
tags: [python, pip]
category: Python/Python基础库
draft: false
---


# 背景
在公司内部的服务器中，安装三方库是需要经过层层审批，最后由运维人员进行安装，员工一般是没有权限去随意安装三方库，在审批之前需要进行测试验证可行性，那么这时就需要把三方库安装到自己有权限的目录中，然后再进行使用。小编这里经过亲身测试验证，分享出来供大家参考学习

# 指定文件夹下安装三方库
在python中安装三方库，默认使用 `pip` 命令进行安装，在该命令中可以通过 `target` 指定安装到的文件夹位置
```bash
pip3 install pyspark==2.4.3 \
    --target=/mnt/disk1/datashare/python \ 
    -i https://mirrors.aliyun.com/pypi/simple/   #指定阿里源
```

# 加载指定文件夹下安装的三方库
在安装三方库时是安装在指定文件夹下，所以需要把指定文件夹插入到 `sys.path` 的第1个位置，否则会加载系统自带的版本
```python
import sys

lib_path = "/mnt/disk1/datashare/python"
sys.path.insert(0,lib_path)   #插入安装三方库的文件夹

import pyspark

print(pyspark.__version__)
#2.4.3
```

# 历史相关文章
- [Python中的Lambda匿名函数](../../Python数据处理/Python中的Lambda匿名函数/)
- [Python 常用的加解密算法实例应用](../../Python数据处理/Python-常用的加解密算法实例应用/)
- [Python 字符串格式化方法总结](../../Python数据处理/Python-字符串格式化方法总结/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
