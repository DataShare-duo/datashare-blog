---
title: Python 基于plotly库快速画旭日图
slug: 数据可视化/Python-基于plotly库快速画旭日图
published: 2024-11-04
description: Python plotly旭日图
image: /python.jpg
showCoverInPost: false
tags: [python, 工具, plotly]
category: Python/数据可视化
draft: false
---


# 背景
本文借助 **plotly** 库来画旭日图，该库是一个高级可视化库，相对 Matplotlib 更高级一些，上手起来相对比较容易

- 低阶API：Plotly Graph Objects(go)
- 高阶API：Plotly Express(px)

# 效果展示
![旭日图](./images/6641583-c56b42a9e7a4b44a.png)

# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.9

import plotly

print("plotly 版本：",plotly.__version__)
#plotly 版本： 5.23.0
```
# 方法1
```python
import plotly.express as px

#数据
data ={
    'id':['A','B','C','D','E','F','G'],
    'parent':['','A','A','B','B','C','D'],
    'value':[10,15,7,8,12,6,5]
}

#创建旭日图
fig = px.sunburst(data, names='id', parents='parent', values='value')

#设置标题
fig.update_layout(title_text="旭日图",title_x=0.5)

#展示图片
fig.show()
```

# 方法2
```python
import plotly.graph_objects as go

data ={
    'id':['A','B','C','D','E','F','G'],
    'parent':['','A','A','B','B','C','D'],
    'value':[10,15,7,8,12,6,5]
}

fig = go.Figure(go.Sunburst(
    labels=data['id'],
    parents=data['parent'],
    values=data['value'],
))

fig.update_layout(
    {'title':{
        'text':'<b>旭日图</b>',
        'x':0.5, #居中对齐
        'xanchor': 'center',
        'yanchor': 'top',
        'font': {'size': 32, 'color':'black', 'family':'微软雅黑'},
    }}
)

fig.show()
```

# 历史相关文章
- [Python 利用Matplotlib制作初中时圆规画的图](../../数据可视化/Python-利用Matplotlib制作初中时圆规画的图/)
- [利用Python画出《人民日报》各国疫情图——南丁格尔玫瑰图](../../数据可视化/利用Python画出《人民日报》各国疫情图——南丁格尔玫瑰图/)
- [Matplotlib 自定义函数实现左边柱形图，右边饼图](../../数据可视化/Matplotlib-自定义函数实现左边柱形图，右边饼图/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
