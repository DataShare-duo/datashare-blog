---
title: Python 如何确定K-Means聚类的簇数
slug: 数据分析与挖掘/Python-如何确定K-Means聚类的簇数
published: 2020-08-03
description: Python 确定聚类簇数
image: /python.jpg
showCoverInPost: false
tags: [python, sklearn, 聚类]
category: Python/数据分析与挖掘
draft: false
---


# 背景
“人以类聚，物以群分”，在大千世界中总有那么一些人，性格爱好、行为习惯比较相近，我们就会把他们归为一类人，这就是我们人脑自动进行的一个聚类（归类）。
在数据分析中，我们也经常拿数据来进行K-Means聚类，用来进行一些分析，K-Means聚类可能大家都会，但是如何科学的决策聚类簇数，这一直是聚类的一大难题。今天就来分享一下，自己工作中在确定聚类簇数时要到的方法。
# 方法
##### 可以确定聚类簇数的方法
- Adjusted Rand index 调整兰德系数
- Mutual Information based scores 互信息
- Homogeneity, completeness and V-measure 同质性、完整性、两者的调和平均
- Silhouette Coefficient 轮廓系数
- Calinski-Harabaz Index
- SSE 簇里误差平方和
##### 自己使用的方法，手肘法则SSE 和 轮廓系数 相结合
- **SSE 簇里误差平方和**

SSE利用计算误方差和，来实现对不同K值的选取后，每个K值对应簇内的点到中心点的距离误差平方和，理论上SSE的值越小，代表聚类效果越好，通过数据测试，SSE的值会逐渐趋向一个最小值。
- **Silhouette Coefficient 轮廓系数**

好的聚类：内密外疏，同一个聚类内部的样本要足够密集，不同聚类之间样本要足够疏远。

轮廓系数计算规则：
针对样本空间中的一个特定样本，计算它与所在簇中其它样本的平均距离a，以及该样本与距离最近的另一个聚类中所有样本的平均距离b，该样本的轮廓系数为
![单个样本点的轮廓系数](./images/6641583-a537527f5761238b.webp)

**详细分解**

对于其中的一个点 i 来说：
计算 a(i) = average(i向量到所有它属于的簇中其它点的距离)
计算 b(i) = min (i向量到各个非本身所在簇的所有点的平均距离)
![分解步骤](./images/6641583-e62b2bc1db0000b4.webp)

然后将整个样本空间中所有样本的轮廓系数取算数平均值，作为聚类划分的性能指标**轮廓系数**

轮廓系数的区间为：[-1, 1]。 -1代表分类效果差，1代表分类效果好。0代表聚类重叠，没有很好的划分聚类
# 应用、代码
以鸢尾花数据集为案例
```python
from sklearn import datasets
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import sklearn.metrics as sm
import pandas as pd

%matplotlib inline
import matplotlib.pyplot as plt

#中文乱码的处理  显示负号
plt.rcParams['font.sans-serif']=['Microsoft YaHei']
plt.rcParams['axes.unicode_minus']=False

# 载入鸢尾花数据集
iris = datasets.load_iris()

data=pd.DataFrame(iris['data'],columns=iris['feature_names'])

std = StandardScaler()
data_std=std.fit_transform(data)

SSE = []
k_SSE = []
#簇的数量
for n_clusters in range(1,11):
    cls = KMeans(n_clusters).fit(data_std)
    score = cls.inertia_
    SSE.append(score)
    k_SSE.append(n_clusters)

silhouette_score = []
k_sil = []
#簇的数量
for n_clusters in range(2,11):
    cls = KMeans(n_clusters).fit(data_std)
    pred_y=cls.labels_
    
    #轮廓系数
    score =sm.silhouette_score(data_std, pred_y)
     
    silhouette_score.append(score)
    k_sil.append(n_clusters)

fig, ax1 = plt.subplots(figsize=(10, 6))

ax1.scatter(k_SSE, SSE)
ax1.plot(k_SSE, SSE)
ax1.set_xlabel("k",fontdict={'fontsize':15})
ax1.set_ylabel("SSE",fontdict={'fontsize':15})
ax1.set_xticks(range(11))
for x,y in zip(k_SSE,SSE):
    plt.text(x, y,x)

ax2 = ax1.twinx()
ax2.scatter(k, silhouette_score,marker='^',c='red')
ax2.plot(k, silhouette_score,c='red')
ax2.set_ylabel("silhouette_score",fontdict={'fontsize':15},)
for x,y in zip(k_sil,silhouette_score):
    plt.text(x, y,x)

plt.show()
```
![iris 聚类](./images/6641583-00c05a8fc9c2ab7e.webp)
结合SSE与轮廓系数，当k=3时比较适合，可以确定聚类的簇数为3

而鸢尾花数据集里面真实的分类就是3类
```python
iris['target_names']
#array(['setosa', 'versicolor', 'virginica'], dtype='<U10')
```
# 历史相关文章
- [利用熵值法确定指标权重   原理及Python实现](../../数据分析与挖掘/利用熵值法确定指标权重---原理及Python实现/)
- [罗兰贝格图  Python等高线图（平滑处理）](../../数据可视化/罗兰贝格图--Python等高线图（平滑处理）/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号，不定期分享干货**

