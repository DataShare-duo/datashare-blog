---
title: Python 基于pyecharts自定义经纬度热力图可视化
slug: 数据可视化/Python-基于pyecharts自定义经纬度热力图可视化
published: 2021-12-29
description: Python pyecharts热力图
image: /python.jpg
showCoverInPost: false
tags: [python, 工具, pyecharts]
category: Python/数据可视化
draft: false
---


# 背景
在业务数据统计分析中基本都会涉及到各省区的分析，数据可视化是数据分析的一把利器，这些省区的数据一般会用地图可视化出来，这样一些规律可以被一面了然发现

地图有很多可视化类型，比如：基本地理图、热力图、路径图、涟漪图 等，本篇文章主要介绍 **热力图**，使用的工具百度开源 **pyecharts**

模拟数据以十一期间全国旅游景点热度为例（虚构数据）
![模拟数据](./images/6641583-152f074b35653611.webp)
# 基于pyecharts内置经纬度的热力图
pyecharts 中自带了一些城市的经纬度，在画图时只要列出城市 or 省份的名字，即可在地图中自动展示，pyecharts会根据城市 or 省份的名字自动提取到经纬度

安装完pyecharts包之后，可以在pyecharts包文件夹里面找到相应的文件 **`city_coordinates.json`** ，里面保存了大量的地理名与经纬度的信息
一般路径如下：

xxxxxx\Lib\site-packages\pyecharts\datasets\city_coordinates.json

下面用模拟数据中 `城市`、`热度` 列来进行热力图可视化

*左右滑动查看完整代码*
```python
import pandas as pd
from pyecharts import options as opts
from pyecharts.charts import BMap
from pyecharts.globals import BMapType
import json

data=pd.read_excel('热力图模拟数据.xlsx')

hotmap = (
    BMap(is_ignore_nonexistent_coord=True,    #忽略不存在的坐标
         init_opts=opts.InitOpts(width="1300px", height="600px"))
    .add_schema(baidu_ak="自己申请的key", center=[120.13066322374, 30.240018034923],
                zoom=5,   # 当前视角的缩放比例
                is_roam=True   # 是否开启鼠标缩放和平移漫游
               )  
    .add(
        "热度",  #图例
        data_pair=[list(z) for z in zip(data['城市'].to_list(), data['热度'].to_list())],
        type_="heatmap",
        label_opts=opts.LabelOpts(formatter="{b}"),
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(title="十一期间全国旅游景点热度",
                                  pos_left='center',
                                  title_textstyle_opts=opts.TextStyleOpts(font_size=32)
                                 ), 
        legend_opts=opts.LegendOpts(pos_right='20%'),
        visualmap_opts=opts.VisualMapOpts()
    )
    .add_control_panel(
        copyright_control_opts=opts.BMapCopyrightTypeOpts(position=3),
        maptype_control_opts=opts.BMapTypeControlOpts(
            type_=BMapType.MAPTYPE_CONTROL_DROPDOWN
        ),
        scale_control_opts=opts.BMapScaleControlOpts(),
        overview_map_opts=opts.BMapOverviewMapControlOpts(is_open=True),
        navigation_control_opts=opts.BMapNavigationControlOpts(),
        geo_location_control_opts=opts.BMapGeoLocationControlOpts(),
    )
    .render("基于pyecharts内置经纬度的热力图.html")
)

#hotmap.render_notebook()
```
![内置经纬度](./images/6641583-81220b3fedf34074.webp)
# 基于自定义经纬度的热力图
因pyecharts中的 **`city_coordinates.json`** 里面存放的均是一些常用的地理经纬度，如果想使用自定义的经纬度，pyecharts也是支持的

下面用模拟数据中 `经度`、`维度`、`热度` 列来进行热力图可视化
```python
import pandas as pd
from pyecharts import options as opts
from pyecharts.charts import BMap
from pyecharts.globals import BMapType
import json

data=pd.read_excel('热力图模拟数据.xlsx')

data_json={}
for index,row in data.iterrows():
    data_json[row['地名']]=[float(row['经度']),float(row['维度'])]

with open("BMAP.json","w") as f:
    json.dump(data_json,f)

hotmap = (
    BMap(is_ignore_nonexistent_coord=True,    #忽略不存在的坐标
         init_opts=opts.InitOpts(width="1300px", height="600px"))
    .add_schema(baidu_ak="自己申请的key", center=[120.13066322374, 30.240018034923],
                zoom=5,   # 当前视角的缩放比例
                is_roam=True   # 是否开启鼠标缩放和平移漫游
               )
    .add_coordinate_json("BMAP.json")  #加载自定义坐标
    .add(
        "热度",  #图例
        data_pair=[list(z) for z in zip(data['地名'].to_list(), data['热度'].to_list())],
        type_="heatmap",
        label_opts=opts.LabelOpts(formatter="{b}"),
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(title="十一期间全国旅游景点热度",
                                  pos_left='center',
                                  title_textstyle_opts=opts.TextStyleOpts(font_size=32)
                                 ), 
        legend_opts=opts.LegendOpts(pos_right='20%'),
        visualmap_opts=opts.VisualMapOpts(max_=20)  #设置最大值，目的是为了能够精确查看自定坐标位置
    )
    .add_control_panel(
        copyright_control_opts=opts.BMapCopyrightTypeOpts(position=3),
        maptype_control_opts=opts.BMapTypeControlOpts(
            type_=BMapType.MAPTYPE_CONTROL_DROPDOWN
        ),
        scale_control_opts=opts.BMapScaleControlOpts(),
        overview_map_opts=opts.BMapOverviewMapControlOpts(is_open=True),
        navigation_control_opts=opts.BMapNavigationControlOpts(),
        geo_location_control_opts=opts.BMapGeoLocationControlOpts(),
    )
    .render("基于自定义经纬度的热力图.html")
)

#hotmap.render_notebook()
```
![自定义经纬度](./images/6641583-67a3bfb2d3a8d059.webp)

# pyecharts库缺点
没有现成的方法用来直接导入自定义坐标，需要先把自定义坐标写在json文件中，然后再通过加载文件实现导入，而没有一个直接导入自定义坐标的方法，这个可以从源码中看出来，如果有一个 `add_coordinate_dict` 函数就完美了
![缺点](./images/6641583-24576df3ba8f888d.webp)

# 不同地图坐标系区别
我们通常用经纬度来表示一个地理位置，但是由于一些原因，我们从不同渠道得到的经纬度信息可能并不是在同一个坐标系下。

- 高德地图、腾讯地图以及谷歌中国区地图使用的是GCJ-02坐标系
- 百度地图使用的是BD-09坐标系
- 底层接口(HTML5 Geolocation或ios、安卓API)通过GPS设备获取的坐标使用的是WGS-84坐标系

不同的坐标系之间可能有几十到几百米的偏移，所以在开发基于地图的产品，或者做地理数据可视化时，我们需要修正不同坐标系之间的偏差。

#### WGS-84 - 世界大地测量系统
WGS-84（World Geodetic System, WGS）是使用最广泛的坐标系，也是世界通用的坐标系，GPS设备得到的经纬度就是在WGS84坐标系下的经纬度。通常通过底层接口得到的定位信息都是WGS84坐标系

#### GCJ-02 - 国测局坐标
GCJ-02（G-Guojia国家，C-Cehui测绘，J-Ju局），又被称为火星坐标系，是一种基于WGS-84制定的大地测量系统，由中国国测局制定。此坐标系所采用的混淆算法会在经纬度中加入随机的偏移。

国家规定，中国大陆所有公开地理数据都需要至少用GCJ-02进行加密，也就是说我们从国内公司的产品中得到的数据，一定是经过了加密的。绝大部分国内互联网地图提供商都是使用GCJ-02坐标系，包括高德地图，谷歌地图中国区等。

#### BD-09 - 百度坐标系
BD-09（Baidu, BD）是百度地图使用的地理坐标系，其在GCJ-02上多增加了一次变换，用来保护用户隐私。从百度产品中得到的坐标都是BD-09坐标系

# 历史相关文章
- [利用Python计算两个地理位置之间的中点](../../Python数据处理/利用Python计算两个地理位置之间的中点/)
- [利用Python+PyEcharts画出《人民日报》各国疫情图](../../数据可视化/利用Python+PyEcharts画出《人民日报》各国疫情图/)
- [罗兰贝格图  Python等高线图（平滑处理）](../../数据可视化/罗兰贝格图--Python等高线图（平滑处理）/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
