---
title: Python 基于datetime库的日期时间数据处理
slug: Python数据处理/Python-基于datetime库的日期时间数据处理
published: 2021-01-26
description: Python datetime库
image: /python.jpg
showCoverInPost: false
tags: [python, datetime]
category: Python/Python数据处理
draft: false
---

# 背景
在数据处理过程中，多多少少都会和**日期时间**打交道，比如在分析数据时，一般需要求各年、各季度、各月、各周的销量等，这些基本都会涉及到**日期时间**，处理日期时间变量是躲不过的

在这里用的名词术语：**日期时间**，是一个整体

# datetime库介绍
官方文档：[https://docs.python.org/zh-cn/3/library/datetime.html](https://docs.python.org/zh-cn/3/library/datetime.html)

datetime包含的类：
- **class datetime.date**
日期
- **class datetime.time**
时间
- **class datetime.datetime**
日期和时间的结合
- **class datetime.timedelta**
两个时间之间的间隔
- **class datetime.tzinfo**
时区
- **class datetime.timezone**
tzinfo 的子类

<br/>

这里主要介绍在工作中经常使用的：
- **class datetime.datetime**--------日期时间
- **class datetime.timedelta**--------时间间隔
# 常用函数、方法、属性
- **class datetime.datetime**
1. **获取当前时间**，结果为：年、月、日、时、分、秒、微秒
1 秒 = 1000毫秒（millisecond）
1毫秒 = 1000微秒（microsecond）

```python
In [1]: import datetime

In [2]: datetime.datetime.now()
Out[2]: datetime.datetime(2021, 1, 25, 16, 56, 56, 992611)

In [3]: type(datetime.datetime.now())
Out[3]: datetime.datetime
```
2. **用指定日期时间创建datetime**
```python
In [4]: datetime.datetime(2021,1,1,12,30,00)
Out[4]: datetime.datetime(2021, 1, 1, 12, 30)

In [5]: print(datetime.datetime(2021,1,1,12,30,00))
2021-01-01 12:30:00
```
3. **一般日志文件使用的格式**
```python
In [6]: dt=datetime.datetime.now().strftime('%Y%m%d%H%M%S')

In [7]: dt
Out[7]: '20210125171518'
```
一般创建日志文件代码：
```python
import logging
import datetime

#日志记录
def get_logger():
    dt=datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    logger = logging.getLogger('model_main.py')
    logger.setLevel(level = logging.INFO)
    if not os.path.exists('./logs'):
        os.mkdir('./logs')
    handler = logging.FileHandler(f'./logs/{dt}_model_main.txt',encoding='utf-8')
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    
    return logger, handler
```
4. **获取年、月、日等**
```python
In [8]: dt = datetime.datetime.now()

In [9]: dt.year
Out[9]: 2021

In [11]: dt.month
Out[11]: 1

In [12]: dt.day
Out[12]: 25

In [13]: dt.hour
Out[13]: 17

In [14]: dt.minute
Out[14]: 20

In [15]: dt.microsecond
Out[15]: 728805
```

5.  **解析字符串为日期** <br/>
strptime：string parse time，官方的符号代表意义：<br/>
[https://docs.python.org/zh-cn/3/library/datetime.html#strftime-strptime-behavior](https://docs.python.org/zh-cn/3/library/datetime.html#strftime-strptime-behavior)

```python
In [16]: datetime.datetime.strptime("1/25/2021 17:27:30","%m/%d/%Y %H:%M:%S")
Out[16]: datetime.datetime(2021, 1, 25, 17, 27, 30)
```

6.  **把日期格式化为字符串** <br/>
strftime：string format time
官方的符号代表意义（同上）
```python
In [17]: dt = datetime.datetime.now()

In [18]: dt
Out[18]: datetime.datetime(2021, 1, 25, 17, 33, 25, 952250)

In [19]: datetime.datetime.strftime(dt,"%Y-%m-%d %H:%M:%S")
Out[19]: '2021-01-25 17:33:25'
```

- **class datetime.timedelta**  <br/>
timedelta：time  delta
如果学过高等数学的话，那么对delta应该比较熟悉，代表间隔、增量
>Delta是第四个希腊字母的读音，其大写为 Δ，小写为 δ。在数学或者物理学中大写的 Δ 用来表示增量符号。 而小写 *δ* 通常在高等数学中用于表示变量或者符号。
$$Δx = x1 - x2$$

datetime.timedelta 只有 days, seconds 和 microseconds 会保留，其他的单位全部相应会转换为这三个，并且 days, seconds, microseconds 会经标准化处理以保证表达方式的唯一性：<br/>
*0 <= microseconds < 1000000*  <br/>
*0 <= seconds < 3600*24 (一天的秒数)*  <br/>
*-999999999 <= days <= 999999999*  <br/>

1. **两个时间相减生成timedelta**
```python
In [20]: dt1 = datetime.datetime(2020,12,5,11,12,13)

In [21]: dt2 = datetime.datetime(2021,1,15,12,30,31)

In [22]: dt2 - dt1
Out[22]: datetime.timedelta(days=41, seconds=4698)
```
2. **两个时间相隔的天数**  <br/>
在数据分析中，有时业务要求前后半年时间内都算正常这样的需求，那么就可以用这种方式来解决
```python
In [20]: dt1 = datetime.datetime(2020,12,5,11,12,13)

In [21]: dt2 = datetime.datetime(2021,1,15,12,30,31)

In [23]: dt_delta = dt1 - dt2

In [24]: dt_delta
Out[24]: datetime.timedelta(days=-42, seconds=81702)

In [25]: dt_delta.days
Out[25]: -42

In [26]: abs(dt_delta.days)
Out[26]: 42
```
3. **用timedelta类来创建**
```python
In [27]: datetime.timedelta(days=50,seconds=27,microseconds=10,milliseconds=29000,minutes=5,hours=8,weeks=2)
Out[27]: datetime.timedelta(days=64, seconds=29156, microseconds=10)

In [28]: datetime.timedelta(10,10,10)
Out[28]: datetime.timedelta(days=10, seconds=10, microseconds=10)
```
4. **一个日期加上或减去timedelta增量**  <br/>
一个时间点加上或减去一个timedelta增量结果还是一个时间点
```python
In [29]: dt = datetime.datetime.now()

In [30]: dt_delta = datetime.timedelta(days = 1)

In [31]: dt + dt_delta
Out[31]: datetime.datetime(2021, 1, 26, 18, 21, 30, 27141)

In [32]: dt - dt_delta
Out[32]: datetime.datetime(2021, 1, 24, 18, 21, 30, 27141)
```


# 历史相关文章
- [Python 字符串格式化方法总结](./Python-字符串格式化方法总结.md)
- [Python pandas 数据无法正常分列](./Python-pandas-数据无法正常分列.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
