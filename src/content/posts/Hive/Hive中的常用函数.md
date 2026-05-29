---
title: Hive 中的常用函数
slug: Hive/Hive中的常用函数
published: 2022-08-11
description: Hive 常用函数
tags: [Hive]
category: Hive
draft: false
---


# 背景
现阶段各个公司的数据慢慢的增多，很多数据都是存放在基于Hadoop的集群上，数据的查询一般使用的是hive，很多公司的数据中台也是使用hive来进行数据处理，本篇文章就来分享下在hive中常用的函数

# 常用函数
**set类设置**
- 查询结果显示表头

set hive.cli.print.header=true;
- 设置Fetch抓取，不走job

set hive.fetch.task.conversion=more;
- 展示数据库

set hive.cli.print.current.db=true;

- 修改是否使用静默

set hive.compute.query.using.stats=false;

**日期类函数**
- 当天
```sql
select current_date()
运行结果：'2022-08-11'
```
- 当月第一天
```sql
select trunc(current_date(),'MM')      
运行结果：'2022-08-01'
select date_format(to_date(trunc(current_date(),'MM')),"yyyyMMdd") 
运行结果：'20220801'
```

- 当月最后一天
```sql
select last_day(current_date)  
运行结果：'2022-08-31'
```
- 上个月
```sql
select date_format(add_months(CURRENT_DATE,-1),'yyyyMM')
运行结果：'202207'
```
- 周几
```sql
select pmod(datediff(current_date(),'1900-01-08'),7)+1
运行结果：'4'
```
- 获取当前时间戳
```sql
select unix_timestamp()
运行结果：'1660212154'
```

**字符串类函数**
- 字符拼接
```sql
--concat（参数1,参数2,...参数n）
select concat('a','b','c')
运行结果：'abc'

select concat('a','b',null,'c')   --包含一个null的话，结果为null
运行结果：NULL
```
- 字符以分割符进行拼接
```sql
--concat_ws(分隔符,参数1,参数2,...参数n)
select concat_ws(',','a','b','c')
运行结果：'a,b,c'

select concat_ws(',','a',null,'c')   --会忽略null
运行结果：'a,c'

select concat_ws(',',null,null,null)  --返回空字符，而不是null
运行结果：''
```

**窗口类函数**
- ROW_NUMBER() –从1开始，按照顺序，生成分组内记录的序列

- RANK() 生成数据项在分组中的排名，排名相等会在名次中留下空位

- DENSE_RANK() 生成数据项在分组中的排名，排名相等会在名次中不会留下空位

- LAG(col,n,DEFAULT) 用于统计窗口内往上第n行值
第一个参数为列名，第二个参数为往上第n行（可选，默认为1），第三个参数为默认值（当往上第n行为NULL时候，取默认值，如不指定，则为NULL）

- LEAD(col,n,DEFAULT) 用于统计窗口内往下第n行值
第一个参数为列名，第二个参数为往下第n行（可选，默认为1），第三个参数为默认值（当往下第n行为NULL时候，取默认值，如不指定，则为NULL）

***更多窗口函数可参考***

《Hive分析函数系列文章》：<br/>
[http://lxw1234.com/archives/2015/07/367.htm](http://lxw1234.com/archives/2015/07/367.htm)


# 历史相关文章
- [Hive中各种日期格式转换方法总结](../../Hive/Hive中各种日期格式转换方法总结/)
- [Hive---HQL支持的2种查询语句风格，你喜欢哪一种？](../../Hive/Hive---HQL支持的2种查询语句风格，你喜欢哪一种？/)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
