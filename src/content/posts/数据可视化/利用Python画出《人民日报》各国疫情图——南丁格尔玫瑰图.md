---
title: 利用Python画出《人民日报》各国疫情图——南丁格尔玫瑰图
slug: 数据可视化/利用Python画出《人民日报》各国疫情图——南丁格尔玫瑰图
published: 2020-03-14
description: Python Matplotlib南丁格尔玫瑰图
image: /python.jpg
showCoverInPost: false
tags: [python, 工具, matplotlib]
category: Python/数据可视化
draft: false
---


# 背景
中国在经历了非典后（2002年在中国广东发生），今年有经历了新冠肺炎，2020年注定是不平凡的一年。前一段时间人民日报的新冠肺炎全球疫情形势可视化图片在朋友圈疯狂传播，相信大部分人都不陌生，如下所示，自己闲暇之余就想用Python来实现一下，如下所示。
>**SARS事件**是指[严重急性呼吸综合征](https://baike.baidu.com/item/%E4%B8%A5%E9%87%8D%E6%80%A5%E6%80%A7%E5%91%BC%E5%90%B8%E7%BB%BC%E5%90%88%E5%BE%81)（英语：**SARS**）于2002年在中国广东发生，并扩散至东南亚乃至全球，直至2003年中期疫情才被逐渐消灭的一次全球性传染病疫潮。

![人民日报](./images/6641583-d1ce132be550058f.webp)
![pyhton制作](./images/6641583-5be856a7ca5b1977.webp)

# 实现过程
- **数据源**

各国的数据在网上都能查到，所以数据来源可以有很多方法。

由于自己主要是想画图，所以就直接手动创建了Excel，手动输入数据。
![数据](./images/6641583-33b798f8b90ca103.webp)

- **用到的Python库（轮子 or 模块）**

Python在可视化方面有很多的库，比如：Matplotlib、Seaborn、ggplot、Pyecharts等，在这里使用的是最基础的Matplotlib库，数据读取用到的Pandas库，计算时用到Numpy库

- **具体代码如下所示**

```python
#导入相应的库
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

#设置字体，可以在图上显示中文
plt.rcParams['font.sans-serif']=['Microsoft YaHei']   

#读取数据
data=pd.read_excel('海外疫情.xlsx',index_col=0)

#数据计算，这里只取前20个国家
radius = data['累计'][:20]
n=radius.count()
theta = np.arange(0, 2*np.pi, 2*np.pi/n)+2*np.pi/(2*n)    #360度分成20分，外加偏移

#在画图时用到的 plt.cm.spring_r(r)   r的范围要求时[0,1]
radius_maxmin=(radius-radius.min())/(radius.max()-radius.min())  #x-min/max-min   归一化  

#画图
fig = plt.figure(figsize=(20,5),dpi=256)
ax = fig.add_subplot(projection='polar')    #启用极坐标
bar = ax.bar(theta, radius,width=2*np.pi/n)


ax.set_theta_zero_location('N')  #分别为N, NW, W, SW, S, SE, E, NE
ax.set_rgrids([])    #用于设置极径网格线显示
# ax.set_rticks()    #用于设置极径网格线的显示范围
# ax.set_theta_direction(-1)    #设置极坐标的正方向
ax.set_thetagrids([])  #用于设置极坐标角度网格线显示
# ax.set_theta_offset(np.pi/2)       #用于设置角度偏离
ax.set_title('新冠肺炎全球疫情形势',fontdict={'fontsize':8})   #设置标题

#设置扇形各片的颜色
for r, bar in zip(radius_maxmin, bar):
    bar.set_facecolor(plt.cm.spring_r(r))  
    bar.set_alpha(0.8)

#设置边框显示    
for key, spine in ax.spines.items():  
    if key=='polar':
        spine.set_visible(False)

plt.show()

#保存图片
fig.savefig('COVID.png')
```

# 总结
目前自己所实现的比较复杂的图形，有罗兰贝格图、本文的南丁格尔玫瑰图，用到的数据知识相对来说比较多，可见数学基础知识是多么重要，华为任正非的做法非常对，必须得注重基础数学的研发，不能总是在别人的基础之上搞应用，华为才有了今天的成绩


# 相关文章
- [罗兰贝格图--Python等高线图（平滑处理）](./罗兰贝格图--Python等高线图（平滑处理）.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**



