---
title: Clickhouse中创建生成日期序列自定义函数
slug: Clickhouse/Clickhouse中创建生成日期序列自定义函数
published: 2024-12-09
description: Clickhouse 自定义函数
tags: [Clickhouse, ]
category: Clickhouse
draft: false
---

# 背景
Clickhouse 数据库最近几年在大数据领域应用越来越广，因其卓越的性能，外加支持海量数据存储与处理，国内很多大厂都有在使用。其底层使用C++语言编写，小编在使用时，感觉可以极限压榨CPU性能，计算速度远超 Hive，应用在数据产品领域，基本没啥问题
- 存储的数据量，可以与Hadoop生态持平
- 计算性能，可以与Mysql持平

# 小编环境
操作系统版本与Clickhouse版本
```bash 
cat /etc/redhat-release
# CentOS Linux release 7.2.1511 (Core)

clickhouse -V
#ClickHouse local version 24.7.2.13 (official build)
```
# 效果展示
提供开始日期、结束日期，生成一个日期序列，返回的是一个数组
```sql
select generateSeries_dt('2024-12-01','2024-12-07') as dts;
--['2024-12-01','2024-12-02','2024-12-03','2024-12-04',
--'2024-12-05','2024-12-06','2024-12-07']
```
# 生成日期序列自定义函数
因Clickhouse 是用C++语言编写，如果想扩展自定义函数，需要用C++来实现或借助sql方式实现，如果想使用其他语言，则只能进行桥接（把数据输出至系统，在系统中调用其他语言处理数据，然后把系统中输出的结果，拿回到clickhouse）。这里小编借助sql 方式来实现，感觉实现起来和编写python很像

利用Chatgpt的帮助，可以一步一步完成所需要的函数功能
```sql
create function generateSeries_dt as (start_dt,end_dt) -> 
(
    arrayMap(
        x -> toDate(start_dt) + x, 
        range(toUInt32(toDate(end_dt) - toDate(start_dt)) + 1)
    )
);
```
1. 将字符串 start_dt 和 end_dt 转换为 Date 类型：`toDate(start_dt)` 和 `toDate(end_dt)`
2. 计算日期之间的差值：`toDate(end_dt) - toDate(start_dt)`，结果是天数
3. 使用 range 函数生成从 0 到差值的整数序列：`range(toUInt32(...) + 1)`
4. 使用 arrayMap 遍历序列，将每个整数加到起始日期上，生成完整的日期序列

通过上面的详细解释，感觉是不是和python很像，经过测试，其性能大概是java编写的自定义函数性能100倍

# 历史相关文章
- [Python-基于pyhive库操作hive](/Python数据处理/Python-基于pyhive库操作hive.md)
- [Rust-是否会重写-Python-解释器与有关的库，替代-C-语言地位？](/Python基础库/Rust-是否会重写-Python-解释器与有关的库，替代-C-语言地位？.md)
- [Python中的Lambda匿名函数](/Python数据处理/Python中的Lambda匿名函数.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
