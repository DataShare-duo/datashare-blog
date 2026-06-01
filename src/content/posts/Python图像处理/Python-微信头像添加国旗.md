---
title: Python 微信头像添加国旗
slug: Python图像处理/Python-微信头像添加国旗
published: 2022-09-30
description: Python 添加国旗
image: /python.jpg
showCoverInPost: false
tags: [python]
category: Python/Python图像处理
draft: false
---

# 背景
又到一年一度的国庆节了，把自己的微信头像更换为国庆的头像，喜庆过大节。

这个是去年做的，分享出来供大家参考，已上传github，仓库地址：https://github.com/DataShare-duo/WeChat_ProfilePhoto_GuoQing

# 代码
```
"""
===========================
@Time : 2022/9/30 13:24
@File : 国庆头像.py
@Software: PyCharm
@Platform: Win10
@Author : DataShare
===========================
"""
from PIL import Image

guoqi = Image.open('国旗.jpg')
touxiang = Image.open('自己头像.jpg')

# 获取国旗的尺寸
x,y = guoqi.size
# 根据需求，设置左上角坐标和右下角坐标（截取的是正方形）
quyu = guoqi.crop((60,20, x-40-280,y))


# 获取头像的尺寸
w,h = touxiang.size
# 将区域尺寸重置为头像的尺寸
quyu = quyu.resize((w,h))
# 透明渐变设置
for i in range(w):
    for j in range(h):
        color = quyu.getpixel((i, j))
        alpha = 255-i*2//5
        if alpha < 0:
            alpha=0
        color = color[:-1] + (alpha, )
        quyu.putpixel((i, j), color)


touxiang.paste(quyu,(0,0),quyu)

touxiang.save('自己头像-国庆.png')

```
# 历史相关文章
- [利用Python 自己动手制作动漫效果图片](../../Python图像处理/利用Python-自己动手制作动漫效果图片/)
- [利用Python对图片进行马赛克处理](../../Python图像处理/利用Python对图片进行马赛克处理/)
- [利用Python生成手绘效果的图片](../../Python图像处理/利用Python生成手绘效果的图片/)
- [Python 利用聚类算法对图片进行颜色压缩](../../Python图像处理/Python-利用聚类算法对图片进行颜色压缩/)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
