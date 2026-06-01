---
title: Python pandas在读取csv文件时（linux与windows之间传输），数据行数不一致的问题
slug: Python数据处理/Python-pandas在读取csv文件时（linux与windows之间传输），数据行数不一致的问题
published: 2021-05-20
description: Python Pandas
image: /pandas.svg
tags: [python, pandas]
category: Python/Python数据处理
draft: false
---


# 背景
最近在处理用户评论数据时，从Linux服务器上面用pandas导出的csv文件，下载到自己的Windows电脑，再用本地pandas读取时发现数据行数不一致的情况，比如在Linux服务器上面数据一共有10行，但是用自己本地电脑pandas读取时确大于10行。

**问题出现的具体场景**：

公司Linux服务器上面安装的有Jupyter notebook，在自己本地电脑输入网址是可以直接访问并使用，而且很方便上传、下载文件，对于Linux服务器小白来说很方便，省去了ssh连接Linux服务器的过程。
遇到的这个问题是通过本地电脑连接到Linux服务器Jupyter notebook处理了一些数据（用户评论文本数据），然后导出到csv文件，下载到自己的Windows电脑，然后使用本地的python环境读取数据，发现数据行数不一致的问题。
# 问题查找
首先找出了从哪一行开始出现串行，查看具体的文本数据，发现在文本数据里面出现特殊转义字符`\r`，于是豁然开朗，Linux的换行符为`\n`，而Windows的换行符为`\r\n`，所以在文本里面出现`\r`字符时，与Windows换行符有冲突，pandas读取数据时出现数据行数不一致问题。

# 解决方法
在pandas读取csv数据时，可利用参数`lineterminator`，明确指定该参数后，可以解决该问题
```python
pd.read_csv('test.csv',lineterminator='\n')
```
具体可以看看`pandas.to_csv`这个参数的解释
![pandas.to_csv](./images/6641583-10300dab0e71ed7e.webp)
# 案例复现
**Linux服务器上面的数据**
![linux服务器上面的数据](./images/6641583-02d3656b4868293d.webp)

**下载后用Windows来读取该数据**
![windows读取数据](./images/6641583-a70e016857d5f7fe.webp)

***可以看出，如果不加 `lineterminator` 参数的话，数据行数会不一致，加了参数后，数据行数保持一致。由于Linux与Windows两个系统的换行符不一样，因此大家在处理数据时可以利用 `lineterminator` 参数来避免这样的问题，分享出来供大家参考***
# 历史相关文章
- [Python pandas数据计数函数value_counts](../../Python数据处理/Python-pandas数据计数函数value_counts/)
- [Python pandas 数据无法正常分列](../../Python数据处理/Python-pandas-数据无法正常分列/)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
