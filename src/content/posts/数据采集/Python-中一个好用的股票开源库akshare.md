---
title: Python 中一个好用的股票开源库akshare
slug: 数据采集/Python-中一个好用的股票开源库akshare
published: 2023-07-27
description: Python 开源库akshare
image: /python.jpg
showCoverInPost: false
tags: [python, 工具]
category: Python/数据采集
draft: false
---


# 背景
从小编真实接触股票已经有10年之久了，因为大学的专业就是数据与应用数据（金融学方向），大三、大四学期时学习了很多涉及金融相关的课程，特别是在大四时，老师还专门给每位同学开通了模拟炒股的账户，让全班同学一起模拟炒股，但小编用真金白银炒股的时间大概是2018年，居现在也有5年时间，一直是韭菜中

最近大家也看到了曾任《环球时报》总编辑的胡锡进，也开始入市炒股，并且每天都会发博文，分享当天的炒股感受

于是小编就试着获取股票的数据来研究一下，经过查找与对比，小编决定用akshare这个库，因为该库一直有更新，并且文档是中文，而且比较详细，
![各种数据](./images/6641583-5103c17b8883b40c.png)


akshare文档地址：https://www.akshare.xyz/
![akshare](./images/6641583-0d92b578a148d298.png)


# 股票各种数据获取方法
**导入akshare库**
```python
import akshare as ak
import pandas as pd
```
**1、股票的基本信息数据**
```python
ak.stock_individual_info_em(symbol="000651")
```
![基本信息](./images/6641583-a6c61892d8aabeeb.png)

**2、实时数据，当日的成交数据**

单次返回所有沪深京 A 股上市公司的实时行情数据
```python
ak.stock_zh_a_spot_em()   
```
![实时数据](./images/6641583-09c00f61ab79e4c1.png)

**3、历史数据，历史的成交数据**
```python
ak.stock_zh_a_hist(symbol="000651", 
                   period="daily", 
                   start_date="20230701", 
                   end_date='20230725', 
                   adjust=""   #不复权
                  )  
```
![历史数据](./images/6641583-181c138eba4dd376.png)

**4、资金流向数据**
限量: 单次获取指定市场和股票的近 100 个交易日的资金流数据
```python
ak.stock_individual_fund_flow(stock="000651", market="sz")
```
![资金流向数据](./images/6641583-e529dee4a2af3e57.png)

**5、行情报价，买卖各5档**
```python
ak.stock_bid_ask_em(symbol="000651")
```
![行情报价](./images/6641583-ed81a523264f870b.png)

# 每日特定股票数据汇总案例
*下面展示每日获取特定股票数据，可以做成定时任务，在15:00闭市后获取*
```python
"""
===========================
@Time : 2023/7/26 20:13
@File : stock_day
@Software: PyCharm
@Platform: Win10
@Author : DataShare
===========================
"""
import akshare as ak
import pandas as pd
import datetime
import sys

def stock_to_excel(stock_code, stock_name):
    if stock_code[0] == '6':
        market = 'sh'
    elif stock_code[0] == '0':
        market = 'sz'

    df1 = ak.stock_zh_a_spot_em()
    df2 = df1[df1['代码'] == stock_code]

    dt = str(datetime.date.today())   #当日
    df3 = ak.stock_individual_fund_flow(stock=stock_code, market=market) #在15:00之后获取
    df4 = df3[df3['日期'] == dt]

    result = {
        "日期": dt,
        "股票代码": stock_code,
        "股票名称": stock_name,
        "前一日收盘价": df2['昨收'].to_list()[0],
        "开盘": df2['今开'].to_list()[0],
        "收盘": df2['最新价'].to_list()[0],
        "最高": df2['最高'].to_list()[0],
        "最低": df2['最低'].to_list()[0],
        "成交量": df2['成交量'].to_list()[0],
        "成交额": df2['成交额'].to_list()[0],
        "振幅": df2['振幅'].to_list()[0],
        "涨跌幅": df2['涨跌幅'].to_list()[0],
        "涨跌额": df2['涨跌额'].to_list()[0],
        "换手率": df2['换手率'].to_list()[0],
        "量比": df2['量比'].to_list()[0],
        "市盈率-动态": df2['市盈率-动态'].to_list()[0],
        "市净率": df2['市净率'].to_list()[0],
        "60日涨跌幅": df2['60日涨跌幅'].to_list()[0],
        "主力净流入-净额": df4['主力净流入-净额'].to_list()[0],
        "主力净流入-净占比": df4['主力净流入-净占比'].to_list()[0],
        "超大单净流入-净额": df4['超大单净流入-净额'].to_list()[0],
        "超大单净流入-净占比": df4['超大单净流入-净占比'].to_list()[0],
        "大单净流入-净额": df4['大单净流入-净额'].to_list()[0],
        "大单净流入-净占比": df4['大单净流入-净占比'].to_list()[0],
        "中单净流入-净额": df4['中单净流入-净额'].to_list()[0],
        "中单净流入-净占比": df4['中单净流入-净占比'].to_list()[0],
        "小单净流入-净额": df4['小单净流入-净额'].to_list()[0],
        "小单净流入-净占比": df4['小单净流入-净占比'].to_list()[0]
    }

    return result


if __name__ == '__main__':
    stocks_code = {'000651': '格力电器',
                   '002241': '歌尔股份',
                   '002739': '万达电影',
                   '600956': '新天绿能',
                   '600031': '三一重工',
                   '600703': '三安光电',
                   '002027': '分众传媒',
                   '600030': '中信证券',
                   '002939': '长城证券',
                   }   #小编买过的股票
    
    dt = str(datetime.date.today())
    results=[]
    for stock_code, stock_name in stocks_code.items():
        print(f'{stock_name}:{stock_code}')
        try:
            results.append(stock_to_excel(stock_code, stock_name))
        except Exception as e:
            print("运行中出错",e)
            sys.exit(-1)
    
    pd.DataFrame.from_dict(results).to_excel(f'./data/{dt}.xlsx', index=False)

```
# 历史相关文章
- [Python 中一个好用的地址解析工具cpca](../Python基础库/Python-中一个好用的地址解析工具cpca（chinese_province_city_area_mapper）.md)
- [Python 除了结巴分词，还有什么好用的中文分词工具？](../NLP/Python-除了结巴分词，还有什么好用的中文分词工具？.md)
- [Python 基于datetime库的日期时间数据处理](../Python数据处理/Python-基于datetime库的日期时间数据处理.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
