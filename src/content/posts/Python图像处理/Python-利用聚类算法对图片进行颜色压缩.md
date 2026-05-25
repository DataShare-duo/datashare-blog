---
title: Python 利用聚类算法对图片进行颜色压缩
slug: Python图像处理/Python-利用聚类算法对图片进行颜色压缩
published: 2022-07-12
description: Python 图片压缩
image: /python.jpg
showCoverInPost: false
tags: [python]
category: Python/Python图像处理
draft: false
---

# 背景
最近看到其他公众号发的一篇文章《三个印度人改变压缩算法，一意孤行整个暑假，却因“太简单”申不到经费》，DCT是最原始的图像压缩算法

全称为Discrete Cosine Transform，即离散余弦变换

刚好小编之前做过图像、视频处理相关的研发工作，对图像处理比较感兴趣，之前也看过利用聚类进行图片颜色压缩的内容，索性就再回顾一下，分享出来供大家参考学习

聚类算法本文不再赘述，不会的同学记住核心思想即可：人以类聚，物以群分

>《三个印度人改变压缩算法，一意孤行整个暑假，却因“太简单”申不到经费》https://mp.weixin.qq.com/s/l3EPCNlE0Ne3wU5YFQ65dg


*题外话，三角函数中余弦函数运用的比较多，在计算向量（文本、语音向量化）的相似度，这里的离散余弦变换*
# 原始图片，4.47MB
本文演示的图片数据，均基于该张图片，故宫.jpg
![故宫](./images/6641583-b4987dcbb5200571.webp)

# 颜色压缩效果
4032*3024 行=12192768 行，也就是1219万个像素点、1219万个颜色点
压缩为10个颜色点、128个颜色点

![压缩效果](./images/6641583-ee5e7b89b2ff2a09.webp)


# 图片数据介绍
大家都知道一个像素可以表示为R（红色 Red）、G（绿色 Green）、B（蓝色 Blue）三个数值组成，照片是一个颜色矩阵，可以理解为每行由指定的像素点排成一行组成，这样由很多行就组合成了一个图片，千万别被高级名词：三维矩阵吓到
![图片颜色矩阵](./images/6641583-ea425a72a9d12211.webp)


我们可以对该图片颜色矩阵进行变换，转换为我们熟悉的二维矩阵，RGB每个颜色是一个特征列，这个矩阵一共有4032*3024 行=12192768 行，也就是1219万个像素点、1219万个颜色点

先放第一行的点，再放第二行的点，以此类推，然后每个点展开为3列，这个就是numpy里面矩阵变换时数据的变化规则

变换后结果如下图所示：

![颜色矩阵转换](./images/6641583-1171e24efd1d7327.webp)

转换为二维矩阵后，是不是和平时分析的数据样式就一样了，这样就可以用来进行聚类，特征列只有3个，分别为R、G、B

# 确定运用的颜色个数（聚类中簇的个数）
一共有 4032*3024 行=12192768 行 数据，我们要聚为几类呢？我们可以先大概取一些值，比如聚为2类、3类、5类 等等，然后使用肘部法则，来大概确定一个合适的分类数（簇数）

利用SSE指标，结合肘部法则，可以确定聚为10类时，比较合适

![确定类数](./images/6641583-2882a9f480e98ccd.webp)

然后用这10类的中心点坐标颜色来还原图片，相当于用10种颜色来对图片进行上色，可以看到图片基本与原图一直，除了天空有锯齿外，图片其他的地方完美显示，这时图片大小为 997KB

![10类](./images/6641583-fec4b0e80a752675.webp)

# 极端情况，聚类为2种颜色
由于原图里面蓝色较多，聚为2类时，除了有蓝色，还有暗棕色
![2类](./images/6641583-d1d178ac82eb3434.webp)

# 脑洞大开，用黑白色表示
由于上面可以用2种颜色来表示，于是脑洞大开，可以用黑色与白色来试试，效果如下图所示，有点类似手绘风格的图片

![黑白色](./images/6641583-ac6493c10b778a95.webp)

# 完整代码
```python
from skimage import io
# from sklearn.cluster import KMeans
from sklearn.cluster import MiniBatchKMeans  #提升聚类速度
import numpy as np
import sklearn.metrics as sm
import matplotlib.pyplot as plt

np.set_printoptions(threshold=np.inf)

image = io.imread('故宫.jpg')
io.imshow(image)

data=image/255.0
data=data.reshape(-1,3)

SSE = []
silhouette_score = []
k = []
#簇的数量
colors=[2,3,5,10,16,32,64,128]
for n_clusters in colors:
    cls = MiniBatchKMeans(n_clusters,batch_size=2048).fit(data)
    score1 = cls.inertia_
    SSE.append(score1)

#肘部法则，确定聚类个数
fig, ax1 = plt.subplots(figsize=(10, 6))
 
ax1.scatter(range(1,9), SSE)
ax1.plot(range(1,9), SSE)
ax1.set_xlabel("colors",fontdict={'fontsize':15})
ax1.set_ylabel("SSE",fontdict={'fontsize':15})
ax1.set_xticks(range(1,9))
for i in range(8):
    plt.text(i+1, SSE[i],colors[i])

plt.show()

#运用10个聚类色表示图片
colors_use=10
km = MiniBatchKMeans(colors_use,batch_size=2048) 
km.fit(data)
new_data = km.cluster_centers_[km.predict(data)]   #利用np.array 的整数索引(高级索引知识)，用聚类中心点值 代替原来点的值

image_new = new_data.reshape(image.shape)
image_new_convert = np.array(np.round(image_new * 255),dtype='uint8')
io.imsave('colors_use_10.jpg',image_new_convert)

#黑白色表示
kmeans = MiniBatchKMeans(2) 
kmeans.fit(data)
new_data =np.array([[255,255,255],[0,0,0]])[kmeans.predict(data)]
image_new = new_data.reshape(image.shape)
image_new_convert = np.array(np.round(image_new * 255),dtype='uint8')
io.imsave('黑白色.jpg',image_new_convert)
```

# 历史相关文章
- [利用Python 自己动手制作动漫效果图片](./利用Python-自己动手制作动漫效果图片.md)
- [利用Python对图片进行马赛克处理](./利用Python对图片进行马赛克处理.md)
- [利用Python生成手绘效果的图片](./利用Python生成手绘效果的图片.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
