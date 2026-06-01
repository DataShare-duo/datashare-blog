---
title: Python 利用Pandas把数据直接导入Mysql
slug: Python数据处理/Python-利用Pandas把数据直接导入Mysql
published: 2020-12-25
description: Python Pandas
image: /pandas.svg
tags: [python, pandas, mysql]
category: Python/Python数据处理
draft: false
---

# 背景
需要把txt文件数据导入mysql数据库，中间需要经过一些数据处理，在经过相关查找后，pandas自带的`to_sql()`，可以实现把`DataFrame`直接导入数据库。

虽然mysql有其他的方式导入数据，但是在导入前需要对数据进行一些处理，这些任务无法完成，所以可以借助python来一步实现所有需求。

`pandas`在处理表格数据有很多优点：API多比较方便、速度快；可循环每行，对每个值进行处理；也可对整列进行处理等

在导入数据库时用的是如下API：
`Pandas.DataFrame.to_sql()`


# 参数介绍及注意事项 
**官方文档：** [https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_sql.html](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_sql.html)

`DataFrame.to_sql`(*name*, *con*, *schema=None*, *if_exists='fail'*, *index=True*, *index_label=None*, *chunksize=None*, *dtype=None*, *method=None*)

常用参数：
- *name*：<br/>
导入到mysql时表的名字  <br/>
如果mysql里面已经用`CREATE TABLE`创建好了表，那么就是该表名字  <br/>
如果mysql没有创建好表，那么可以自己起一个合适的表名

- *con*：<br/>
数据库连接，需要安装sqlalchemy库，目前仅支持sqlalchemy库创建的连接，pymysql库创建的连接不支持
```python
engine = create_engine("mysql+pymysql://root:z123456@127.0.0.1:3306/routeapp?charset=utf8")
#SQLALCHEMY_DATABASE_URI = '%s+%s://%s:%s@%s:%s/%s' % (DB_TYPE, DB_DRIVER, DB_USER,DB_PASS, DB_HOST, DB_PORT, DB_NAME)
```
- *if_exists*：以下三个选项，是如果数据库里面已经存在该表的意思 <br/>
"fail"：直接报错，不再操作，类似mysql创建表时的`IF NOT EXISTS`才创建表 <br/>
"replace"：先删除该表，然后再创建 <br/>
"append"：直接在表后面添加数据

- *index*：bool <br/>
是否把DataFrame的索引列写入表中
- *index_label*：<br/>
如果要把DataFrame的索引列写入表中，那么需要给出该索引列的名字，如果没给的话，那就会用DataFrame的列索引名

**注意事项：** <br/>
*con* 参数一定要仔细核对，否则数据库会连接失败，可参照上面给出的例子按自己的实际数据库位置进行更改


# 案例
首先电脑上已安装：mysql软件、sqlalchemy库、pandas库

现在有一些城市之间的火车车次信息，需要导入数据库
```python
import pandas as pd
data=pd.read_table('./data_pandas.txt')
data.head()
```
![城市之间火车信息](./images/6641583-799b9b1803441948.webp)

假如数据库里面已经创建好该表，并且已经指定好各列的数据类型，现在只需把数据导入到里面
```sql
CREATE TABLE IF NOT EXISTS train (
	start_city VARCHAR (100) NOT NULL COMMENT '始发城市',
	start_city_id int COMMENT '始发城市id',
	end_city VARCHAR (100) NOT NULL COMMENT '到达城市',
	end_city_id int COMMENT '到达城市id',
	train_code VARCHAR (20) NOT NULL COMMENT '车次',
	arrival_time VARCHAR (20) NOT NULL COMMENT '到达时间',
	departure_time VARCHAR (20) NOT NULL COMMENT '出发时间',
	run_time INT NOT NULL COMMENT '运行时间(分钟)',
	P1 FLOAT COMMENT '硬座票价',
	P2 FLOAT COMMENT '软座票价',
	P3 FLOAT COMMENT '硬卧票价',
	P4 FLOAT COMMENT '软卧票价',
	P5 FLOAT COMMENT '商务座票价',
	P6 FLOAT COMMENT '一等座',
	P7 FLOAT COMMENT '二等座'
) ENGINE = INNODB DEFAULT CHARSET = utf8 COMMENT = '城市之间火车信息';
```
借助`sqlalchemy`库来导入数据

```python
from sqlalchemy import create_engine

engine = create_engine("mysql+pymysql://root:z123456@127.0.0.1:3306/routeapp?charset=utf8")

#SQLALCHEMY_DATABASE_URI = '%s+%s://%s:%s@%s:%s/%s' % (DB_TYPE, DB_DRIVER, DB_USER,DB_PASS, DB_HOST, DB_PORT, DB_NAME)

with engine.begin() as conn:
    data.to_sql(name='routeapp_train_line_tb_new_2',con=conn,if_exists='append',index=False)
```
<br/>

这里用with语句可以实现mysql的roallback功能，建议最好用with来导入数据
![导入数据](./images/6641583-6f6c644ab2f324fb.webp)

# 参考文章
- [python3 pandas to_sql填坑](https://blog.csdn.net/qnloft/article/details/87979937)
- [Commit and rollback with pandas.DataFrame.to_sql()](https://capelastegui.wordpress.com/2018/05/21/commit-and-rollback-with-pandas-dataframe-to_sql/)

# 历史相关文章
- [Python 基于ssh连接远程Mysql数据库](../../Python基础库/Python-基于ssh连接远程Mysql数据库/)
- [Python pandas 里面的数据类型坑，astype要慎用](../../Python数据处理/Python-pandas-里面的数据类型坑，astype要慎用/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
