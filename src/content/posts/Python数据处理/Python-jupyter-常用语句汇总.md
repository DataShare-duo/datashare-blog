---
title: Python jupyter 常用语句汇总
slug: Python数据处理/Python-jupyter-常用语句汇总
published: 2019-12-17
description: Python jupyter
image: /python.jpg
showCoverInPost: false
tags: [python, jupyter-notebook]
category: Python/Python数据处理
draft: false
---

# 1.全局设置
```
#显示所有列
pd.set_option('display.max_columns', None)

#显示所有行
pd.set_option('display.max_rows', None)

#设置value的显示长度为100，默认为50
pd.set_option('max_colwidth',100)

#禁止自动换行(设置为Flase不自动换行，True反之)
pd.set_option('expand_frame_repr', False)

#打开修改时复制机制
pd.set_option("mode.copy_on_write", True)

#打印时显示全部数组信息
np.set_printoptions(threshold=np.inf)
```
# 2.画图
```
#内嵌画图
%matplotlib inline

#单独画图
%matplotlib qt
```
# 3.显示
```
#让一个cell同时有多个输出print
from IPython.core.interactiveshell import InteractiveShell
InteractiveShell.ast_node_interactivity = "all" 
```
**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**

