---
title: Hive 中各种日期格式转换方法总结
slug: Hive/Hive中各种日期格式转换方法总结
published: 2021-10-22
description: Hive 日期格式转换
tags: [Hive, 数据处理]
category: Hive
draft: false
---

# 背景
日期计算平时在业务取数时经常涉及到，但是数据库中经常存放着不同的日期格式，有的存放是时间戳、有的是字符串等，这时需要对其进行转换才能提取到准确的数据，这里介绍的均是hive里面的函数功能，以下内容均是业务的数据需求经常使用的部分

**时间戳**
>unix时间戳是从1970年1月1日（UTC/GMT的午夜）开始所经过的秒数，不考虑闰秒，一般为10位的整数

*一个在线工具：https://tool.lu/timestamp/*

![时间戳](./images/6641583-296fcd7bf38de1de.webp)



**字符串日期**

如：'2021-10-21 19:25:50'，'2021-10-21 20:25:50.0'，'2021-10-21 20:25'

# 日期格式转换
**时间戳--->正常的日期格式**

- 获取当前时间戳
```sql
select unix_timestamp()
```
- 把时间戳转为正常的日期
```sql
select from_unixtime(unix_timestamp(),'yyyy-MM-dd hh:mm:ss') as dt
```

- 业务中有时存放的是包含毫秒的整数，需要先转换为秒
```sql
select from_unixtime(cast(create_time/1000 as bigint),'yyyyMMdd') as dt
```

**字符串日期**

假如数据库存放的是格式为："yyyy-MM-dd hh:mm:ss"

- 截取日期部分
```sql
select substr('2021-10-22 17:34:56',1,10)
2021-10-22
```
- 字符串强制转换，获取日期
```sql
select to_date('2021-10-22 17:34:56')
2021-10-22
```
- 也可以通过date_format实现
```sql
select date_format('2021-10-22 17:34:56','yyyy-MM-dd')
2021-10-22
```

**系统当前日期**
- 当前日期
```sql
select current_date();
2021-10-22
```

- 字符串日期与系统当前日期比较，这个在业务中经常有用到
```sql
select substr('2021-10-22 17:34:56',1,10)>current_date()
false
```
**前一日/昨日**
```sql
select date_sub(current_date(),1);
2021-10-21
```
**前一日12点/昨日12点**

在业务中与截取的字符串日期进行比较时用
```sql
select concat(date_format(date_sub(current_date(),1),'yyyy-MM-dd'),' ','12');
2021-10-21 12
```
**最近一个月/30天**
```sql
select date_sub(current_date(),30);
2021-09-22
```
**当月第一天**

业务中经常用在滚动计算当月每日的业绩数据
```sql
select date_format(to_date(trunc(current_date(),'MM')),"yyyy-MM-dd");
2021-10-01
```
**日期格式转换 yyyyMMdd--->yyyy-MM-dd**
```sql
select from_unixtime(unix_timestamp('20211022','yyyyMMdd'),"yyyy-MM-dd");
2021-10-22
```
**两个日期相隔天数**
```sql
select datediff('2021-10-22', '2021-10-01');
21
```

# 历史相关文章
- [Hive HQL支持的2种查询语句风格，你喜欢哪一种？](./Hive---HQL支持的2种查询语句风格，你喜欢哪一种？.md)
- [Python 基于datetime库的日期时间数据处理](../Python数据处理/Python-基于datetime库的日期时间数据处理.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
