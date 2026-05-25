---
title: Python 利用4行代码实现图片灰度化
slug: Python图像处理/Python-利用4行代码实现图片灰度化
published: 2022-11-30
description: Python 图片灰度化
image: /python.jpg
showCoverInPost: false
tags: [python]
category: Python/Python图像处理
draft: false
---


# 背景

不论是在进行深度学习时的图片处理，还是在商业用途出版书刊，基本都会用到对图片进行灰度转换，也就是**灰度化**，本文章利用简单的4行代码来快速实现图片灰度化，仅供参考

# 效果

![效果](./images/6641583-eda1869e07d00414.webp)

# 实现代码

```python
from PIL import Image
wechat_image='./微信头像.jpg'
wechat_image_greyscale=Image.open(wechat_image).convert('L')   #对图片进行灰度化
wechat_image_greyscale.save('微信头像_灰度化.jpg')
```


![实现代码](./images/6641583-b01b29934b6d3ba0.webp)

# 图像灰度转化

图像是由红（Red）、绿（Green）、蓝（Blue）三原色来表示，R、G、B的取值范围均为0~255，正常读取的图片构成的三维矩阵就是图像各像素点的RGB值


图像的灰度化，就是让像素点矩阵中的每一个像素点都满足这样的关系：

R=G=B，此时的这个值叫做 **灰度值** ：

灰度化后的R =  处理前的R * 0.299+ 处理前的G * 0.587 +处理前的B * 0.114

灰度化后的G =  处理前的R * 0.299+ 处理前的G * 0.587 +处理前的B * 0.114

灰度化后的B =  处理前的R * 0.299+ 处理前的G * 0.587 +处理前的B * 0.114


> PIL库里面在灰度转化时，利用的公式 
>
> When translating a color image to greyscale (mode "L"), the library uses the ITU-R 601-2 luma transform:
>
> L = R * 299/1000 + G * 587/1000 + B * 114/1000


# 历史相关文章
- [利用Python生成手绘效果的图片](./利用Python生成手绘效果的图片.md)
- [利用Python 自己动手制作动漫效果图片](./利用Python-自己动手制作动漫效果图片.md)
- [Python 利用聚类算法对图片进行颜色压缩](./Python-利用聚类算法对图片进行颜色压缩.md)

---

**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
