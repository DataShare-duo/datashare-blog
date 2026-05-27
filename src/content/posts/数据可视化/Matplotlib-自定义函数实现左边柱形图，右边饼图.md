---
title: Matplotlib 自定义函数实现左边柱形图，右边饼图
slug: 数据可视化/Matplotlib-自定义函数实现左边柱形图，右边饼图
published: 2022-04-24
description: Python Matplotlib可视化
image: /python.jpg
showCoverInPost: false
tags: [python, 工具, matplotlib]
category: Python/数据可视化
draft: false
---


# 背景
在复杂的数字中找规律，不如从一张图中看出规律，在平时的汇报时，PPT里面能展示的也就那么几种图表，但是合理的把数据展示出来，有时能让人眼前一亮，在数据分析中合理的运用可视化技术，有时可以起到事半功倍的效果

>数据可视化是一门艺术，有时清晰的图表胜过千言万语，数据可视化的成功，往往并不在于数据可视化本身。


# 效果

![效果](./images/6641583-093d60171af01d5e.webp)


# 利用自定义函数画图
```python
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
import matplotlib.ticker as mticker

#显示所有列
pd.set_option('display.max_columns', None)

#显示所有行
pd.set_option('display.max_rows', None)


#中文乱码的处理
plt.rcParams['font.sans-serif']=['Microsoft YaHei']
plt.rcParams['axes.unicode_minus']=False

data=pd.read_excel('模拟数据.xlsx')

def axes_plot(axs1,axs2,x,y,rotation=0,axs1_twinx=False):
    
    #柱形图个数
    axs1.bar(x,y,width=0.75,align='center')
    for a,b in zip(x,y):
        axs1.text(a,b,b,ha='center',va='bottom')
    axs1.tick_params(axis='x')
    
    #修改x坐标轴
    axs1.xaxis.set_major_locator(mticker.FixedLocator(range(len(x))))
    axs1.set_xticklabels(x,rotation=rotation,fontsize=12)
    
    #累计百分比
    if axs1_twinx:
        axs_twinx=axs1.twinx()
        y_twinx=np.array(y).cumsum()/np.array(y).sum()
        axs_twinx.plot(x,y_twinx,'r-o',linewidth=3)
        axs_twinx.set_ylim(0,1.1)
        
        for a,b in zip(x,y_twinx):
            axs_twinx.text(a,b,f'{b:.0%}',ha='center',va='bottom')
        
    
    #饼图
    axs2.pie(y,labels=x,autopct='%.0f%%',textprops={'fontsize':12,'color':'k'})
    axs2.axis('equal')


%matplotlib inline
fig,axes=plt.subplots(1,2,figsize=(20,7),facecolor='white')
fontsize=15

x=data['地区']
y=data['销量']
axes_plot(axes[0],axes[1],x,y,rotation=45,axs1_twinx=True)

fig.suptitle('各大区销量分布',fontsize=20,fontweight ="bold",y=0.98)
plt.subplots_adjust(hspace=0.35,wspace=0.3)
plt.show()
```

# 历史相关文章
- [利用Python画出《人民日报》各国疫情图——南丁格尔玫瑰图](./利用Python画出《人民日报》各国疫情图——南丁格尔玫瑰图.md)
- [历史双色球数据分析---python](../Python数据处理/历史双色球数据分析---python.md)
**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
