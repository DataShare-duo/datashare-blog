---
title: Python 一个在本地给图片添加水印的小工具
slug: Python图像处理/Python-一个在本地给图片添加水印的小工具
published: 2025-04-08
description: Python 水印小工具
image: /python.jpg
showCoverInPost: false
tags: [python, 工具]
category: Python/Python图像处理
draft: false
---


# 背景
在日常业务办理过程中，不知大家是否养成了为重要文件添加水印的习惯？特别是通过微信等社交平台传输的证件照片、合同扫描件等敏感资料，建议都应当添加包含个人/企业信息的水印，这样既能保护隐私又能防止资料被滥用

小编这里分享的小工具，是在本地进行操作，不用把照片上传到其他系统中，更好的保护了个人隐私


# 小编环境
```python
import sys
print('python 版本：',sys.version)
#python 版本： 3.11.11 | packaged by Anaconda, Inc. | 
#(main, Dec 11 2024, 16:34:19) [MSC v.1929 64 bit (AMD64)]

import PIL
print('PIL 版本：',PIL.__version__)
#PIL 版本： 10.0.1
```

# 效果预览
![打油诗](./images/6641583-14894e34d27288f9.png)

![花朵](./images/6641583-df8bb53ec42254d1.png)



# 拉取代码
```bash
git clone git@github.com:DataShare-duo/watermarker.git
```
# 安装需要的库
这个小工具需要使用第三方库 `Pillow`，需要进行安装
```bash 
pip install Pillow
```

# 使用方法
这个小工具既可以给单个图片加上水印，也可以给文件夹里面的所有图片加上水印
- 单个图片添加水印
```bash
python .\marker.py -f .\input\蓝天白云.jpg -m 天气晴朗，适合出游
```

- 文件夹批量添加水印
```bash
python .\marker.py -f .\input -m 天气晴朗，适合出游
```
# 历史相关文章
- [Python 利用4行代码实现图片灰度化](../../Python图像处理/Python-利用4行代码实现图片灰度化/)
- [Python 微信头像添加国旗](../../Python图像处理/Python-微信头像添加国旗/)
- [利用Python生成手绘效果的图片](../../Python图像处理/利用Python生成手绘效果的图片/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
