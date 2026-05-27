---
title: Numpy中的shuffle和permutation区别
slug: Python数据处理/Numpy中的shuffle和permutation区别
published: 2020-01-06
description: Python Numpy
image: /python.jpg
showCoverInPost: false
tags: [python, numpy]
category: Python/Python数据处理
draft: false
---

# 主要区别
- `shuffle`没有返回值，直接在原来的数据上进行打乱排序，没有返回；而`permutation`是在数据副本上面进行打乱，返回打乱之后的副本。
- 由于permutation会复制数据，所以当数据量特别大的时候，使用shuffle的效率更高。
- 无论是`shuffle`还是`permutation`对二维及以上数据，都是只对**第一维进行打乱顺序**，第二维中的顺序并不会打乱。
# 示例
![示例](./images/6641583-114773a39b850879.webp)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
