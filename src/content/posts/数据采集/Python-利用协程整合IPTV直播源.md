---
title: Python 利用协程整合IPTV直播源
slug: 数据采集/Python-利用协程整合IPTV直播源
published: 2025-09-08
description: Python IPTV直播源
image: /python.jpg
showCoverInPost: false
tags: [python,协程]
category: Python/数据采集
draft: false
---


# 背景
家里的电视，你还打开过吗？
像小编这样长期在外打拼的“北漂族”，电视似乎早已慢慢淡出了日常生活。但每次过节回家，和家人围坐在一起，看看电视直播，却成了一种难得的仪式感。

说起电视直播，就不得不提到小编偶然发现的一款神器——**TVbox**
这款软件确实强大，装到电视上就能免费观看海量电影、电视剧和各地直播频道，**最关键的是：全程无广告、无广告、无广告！（重要的事情必须说三遍）**

不过有一点挺让人头疼：别人分享的直播源，常因为网络运营商不同，在自己家可能根本无法播放……
于是，就有了今天这篇文章的主题：
如何整合网络上分享的IPTV直播源，把它们变成适合自己家庭网络环境的稳定直播源


# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.11
```
# github仓库地址
https://github.com/DataShare-duo/MovieLiveUrl

# 仓库使用教程
仓库更新迭代时间有点长，里面有各种测试文件比较乱，真实用的文件如下：
- **直播.xlsx**
配置文件，收集的不同直播源，以及抽取需要的频道直播源
- **live_source.py**
主程序，解析不同的直播源，测试是否可用，直播源速度
- **parse_live_source.py**
解析直播的主要逻辑类
- **speed_test_async.py**
测试直播源速度的函数，运用异步的逻辑


**运行程序：**
```txt
python live_source.py
```

**生成直播源结果：**
- movie_live.m3u
- movie_live.txt

生成的文件直播源一模一样，只是2种不同的文件类型，供不同的app使用

**订阅地址：**
- https://raw.githubusercontent.com/DataShare-duo/MovieLiveUrl/refs/heads/main/movie_live.m3u

- https://raw.githubusercontent.com/DataShare-duo/MovieLiveUrl/refs/heads/main/movie_live.txt


# 历史相关文章
- [Python 利用aiohttp异步流式下载文件](../../Python数据处理/Python-利用aiohttp异步流式下载文件/)
- [Python 利用协程采集想看的《人世间》下载地址](../../数据采集/Python-利用协程采集想看的《人世间》下载地址/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
