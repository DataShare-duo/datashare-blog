---
title: Python 利用Matplotlib制作初中时圆规画的图
slug: 数据可视化/Python-利用Matplotlib制作初中时圆规画的图
published: 2023-08-29
description: Python Matplotlib规画的图
image: /python.jpg
showCoverInPost: false
tags: [python, 工具, matplotlib]
category: Python/数据可视化
draft: false
---


# 背景
大家在初中时，开始学习圆相关的知识，涉及圆的半径、周长、面积 等等，那会每位同学基本都会买一套圆规、三角板，来辅助学习和做作业使用，这些学习工具在闲暇时光也被用来玩耍，偶然间就拿着圆规在纸上画了这么一个图形，所有的圆心在同一个圆上，该图形一直记忆很深刻。自从学了Python 后就一直有这么一个念头，用Python把它实现出来，最近利用业余时间就给画了出来，分享出来供大家参考学习，也是数据可视化的一部分

***效果图：***
![圆心在同一个圆上](./images/6641583-04de957fe33d9e96.png)

# 画圆的方法
画圆的方法，参考该篇文章：[如何在 Matplotlib 中绘制圆](https://www.delftstack.com/zh/howto/matplotlib/how-to-plot-a-circle-in-matplotlib/)，该文章一共介绍了3种方法，其中第2种方法：**在 Matplotlib 中用圆方程绘制圆**，可能有点不好理解，这里小编专门绘制了一个图来做解释，大家看了后应该可以理解

文章地址：https://www.delftstack.com/zh/howto/matplotlib/how-to-plot-a-circle-in-matplotlib/

![圆方程示例](./images/6641583-9ac0e53913e0fd87.png)

*圆方程示例代码：*
```python
import numpy as np
from matplotlib import pyplot as plt


figure, axes = plt.subplots()
draw_circle = plt.Circle((0, 0), 1,fill=False,linewidth=2)
axes.set_aspect(1)
axes.add_artist(draw_circle)

#设置上边和右边无边框
axes.spines['right'].set_color('none')
axes.spines['top'].set_color('none')

#设置坐标轴位置
axes.spines['bottom'].set_position(('data', 0))
axes.spines['left'].set_position(('data',0))

plt.plot([0, np.cos(1/6*np.pi)], [0, np.sin(1/6*np.pi)],'r')
plt.plot([np.cos(1/6*np.pi), np.cos(1/6*np.pi)], [0, np.sin(1/6*np.pi)],'b--')
plt.xticks([])
plt.yticks([])
plt.xlim(-1.5,1.5)
plt.ylim(-1.5,1.5)

plt.text(x=0.4,y=0.3,s='$r$')
plt.text(x=0.2,y=0.02,s='$\\theta$')
plt.text(x=0.1,y=-0.1,s='$x=r * cos(\\theta)$',fontsize='small')
plt.text(x=1.,y=0.15,s='$y=r * sin(\\theta)$',fontsize='small')

plt.show()
```


# 初中时圆规画的图

*圆心在同一个圆上代码：*
```python
import numpy as np
from matplotlib import pyplot as plt

theta = np.linspace(0, 2*np.pi, 25)  #生成一些数据，用来计算圆上的点
radius = 2  #半径

x = radius*np.cos(theta)  #圆心的横坐标 x
y = radius*np.sin(theta)  #圆心的横坐标 y

figure, axes = plt.subplots(1,1,figsize=(20,7),facecolor='white',dpi=500)
for circle_x,circle_y in zip(x,y):
    draw_circle = plt.Circle((circle_x, circle_y), radius,fill=False)  #画圆
    axes.add_artist(draw_circle)  
    
axes.set_aspect(1)
plt.xlim(-5,5)
plt.ylim(-5,5)
plt.axis('off')
plt.show()
```

# 历史相关文章
- [利用Python画出《人民日报》各国疫情图——南丁格尔玫瑰图](./利用Python画出《人民日报》各国疫情图——南丁格尔玫瑰图.md)
- [Matplotlib 自定义函数实现左边柱形图，右边饼图](./Matplotlib-自定义函数实现左边柱形图，右边饼图.md)
- [Python 利用4行代码实现图片灰度化](../Python图像处理/Python-利用4行代码实现图片灰度化.md)
**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**


