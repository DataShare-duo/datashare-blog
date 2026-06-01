---
title: Python 基于pyhive库操作hive
slug: Python数据处理/Python-基于pyhive库操作hive
published: 2024-11-14
description: Python pyhive库
image: /python.jpg
showCoverInPost: false
tags: [python, hive]
category: Python/Python数据处理
draft: false
---


# 背景
在大数据处理时，基本都是基于Hadoop集群进行操作，数据相关人员在开发数仓或做临时业务需求时，基本都是利用 hive，写 sql 进行数据处理与统计分析，但是 sql 在处理一些复杂业务逻辑时会比较复杂，本文通过基于 pyhive 操作 hive，把 sql 的查询结果转为 pandas 中的 DataFrame 数据框，用于后续数据分析

`pyhive` 库类似于`pymysql`库，都是 Python 中与不同数据库系统进行交互的库。它们都提供了简洁的接口来执行 SQL 查询，处理结果集，以及管理连接
# 小编环境
```python
import sys

print('python 版本：',sys.version)
#python 版本： 3.6.8 (default, Aug  7 2019, 17:28:10) 
#[GCC 4.8.5 20150623 (Red Hat 4.8.5-39)]

import pyhive

print('pyhive 版本：',pyhive.__version__)
#pyhive 版本： 0.6.3
```
*因是在服务器集群操作，python版本较低*

# 示例
```python
#导入库
from pyhive import hive
import pandas as pd


def generate_sql(table,dt):
    sql = f"""
    select id,split(location,',')[1] as longitude,split(location,',')[0] as latitude
    from {table}
    where dt='{dt}'
    """
    return sql 

# 建立连接
conn=hive.connect(
    host = '10.20.1.1',
    port = 10000,
    auth="CUSTOM",
    database = 'bigdata',
    username='datashare',
    password = 'datashare'
)

# 创建游标
cur =conn.cursor()

# 执行查询
sql=generate_sql('tb_test','20241114')
cur.execute(sql)

#获取列名
cols=[]
for col in cur.description:
    cols.append(col[0])

#把sql结果转换为DataFrame
data = pd.DataFrame(cur.fetchall(),columns=cols)
print(data.head())

#借助pandas对数据进行一些处理
#。。。。。。


#数据保存为Excel
data.to_excel('data.xlsx')

# 关闭连接
cursor.close()
connection.close()
```
这样通过python一站式对数据进行操作，可以很大程度提升工作效率，后续还可以结合sklearn、pytorch等，对数据进行机器学习等相关操作

# 历史相关文章
- [对比Excel，利用pandas进行数据分析各种用法](../../Python数据处理/对比Excel，利用pandas进行数据分析各种用法/)
- [Python 利用Pandas把数据直接导入Mysql](../../Python数据处理/Python-利用Pandas把数据直接导入Mysql/)
- [Python 基于ssh连接远程Mysql数据库](../../Python基础库/Python-基于ssh连接远程Mysql数据库/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
