---
title: Clickhouse 基础使用教程
slug: Clickhouse/Clickhouse-基础使用教程
published: 2024-12-19
description: Clickhouse 基础使用教程
tags: [Clickhouse, ]
category: Clickhouse
draft: false
---


# 背景
小编最近在做一个数据类产品项目，每天涉及到几十亿数据的汇总计算，从不同维度、不同的关联关系进行汇总统计，刚开始时项目组使用的是hive，写好大量的业务SQL计算逻辑后（中间有一些其他程序处理脚本），每天通过定时任务来生成数据，然后把生成的数据推送到研发端的ES（Elasticsearch），研发端基于ES查询数据，给到前端来展示

但是，随着项目的不断深入，产品需求的快速迭代，之前的各种统计指标更新迭代，基于hive数据库的计算方式不能再满足当前快速迭代的场景。项目组经过调研，最终选择Clickhouse数据库，让研发来每天通过查询Clickhouse数据库，来统计生成各种统计指标，并把结果缓存至ES

项目数据架构的大概思路：
- hive每日生成明细数据，把这些明细数据导入Clickhouse
- 在Clickhouse中生成一些中间表，供研发人员查询数据使用，方便进行各种拼接组合
- 研发人员每日基于明细表、中间表，计算统计指标，把结果缓存至ES

# 小编环境
操作系统版本 与 Clickhouse 版本
```bash
cat /etc/redhat-release
# CentOS Linux release 7.2.1511 (Core)

clickhouse -V
#ClickHouse local version 24.7.2.13 (official build)
```
# 登录客户端
```bash
clickhouse-client -u xxxx --password xxxxxx -m 
```
>-u 或者 --user ：指定用户名
--password ：密码
-m 或者 --multiline ：进入客户端后，运行输入多行sql语句

# 建表
在Clickhouse中，数据既可以存放到单个服务器节点，也可以把数据分散存放到集群中各个节点服务器中，这个需要看数据量大小，来选择合适的表类型

1. **创建本地表**
如果数据量比较小的话，建议选择本地表，在数据查询时以提高性能，可以节省节点之间数据传输的时间，比如有几千万行数据的表，完全可以选择本地表，但是查询数据时，只能在当前服务器节点查询，其他服务器节点没有该表

下面以用户表为列，进行建表操作：
```sql
create table test.user_table (
uid String comment '用户id',
sex String comment '性别',
age UInt16 comment '年龄',
phone String comment '联系电话'
)
engine = MergeTree()
order by uid;
```
- 数据类型需要注意是大写开头 ，`String`、`UInt16`，表引擎类型也必须大写 `MergeTree`
- 如果没有指定主键的话，默认用 order by 指定的字段



2. **创建分布式表**
分布式表在Clickhouse中，只是一个视图，不实际存放数据，指向实际存放数据的本地表，所以在创建分布式表时，需要在各个服务器节点创建名字一模一样的本地表
```sql
--在集群中创建实际存放数据的本地表
create table test.user_event on cluster data_cluster(
uid String comment '用户id',
event String comment '事件名称',
c_time DateTime comment '点击时间',
dt Date comment '日期'
)
engine = MergeTree()
partition by dt 
order by uid;

--创建分布式表
create table test.user_event_distributed (
uid String comment '用户id',
event String comment '事件名称',
c_time DateTime comment '点击时间',
dt Date comment '日期'
)
engine = Distributed('data_cluster', 'test', 'user_event', rand())
;
```
分布式表需要选择 `Distributed` 表引擎，其中
第1个参数：集群名称
第2个参数：数据库名
第3个参数：数据表名
第3个参数：分片key，数据被到不同服务器依据的字段，相同的值会被分配到同一台服务器

如果在创建分布式表 `test.user_event_distributed` 时没有指定 `on cluster data_cluster`，那么创建是本地表，后续的查询只能在建表的那个节点服务器查询数据，这里小编就创建的是一个本地表

# 查询
Clickhouse 的sql 查询语句和hive的比较类似，使用起来基本没啥差距，只有极个别的函数不支持，下面小编列举一下自己在使用时，遇到的个别函数：
- 没有 `nvl` 函数，需要用 `coalesce` 代替
- 支持窗口函数，`row_number` 等
- 没有 `concat_ws`，需要用 `arrayStringConcat` 代替
- 没有 `collect_list`，需要用 `groupArray` 代替
- 一个好用的函数，`arrayZip`，类似python中的zip
- 没有 `split` 函数，需要用 `splitByString` 代替
- `arrayMap`、`arraySum`、`arraySlice` 等函数很好用，性能高

# 表变更
- **删除特定分区**
```sql
alter table test.user_event on cluster data_cluster drop partition '2024-11-30';
alter table test.user_event on cluster data_cluster delete where dt > '2024-11-15';
alter table test.user_event on cluster data_cluster delete where dt='2024-11-30';
```
- **删除满足特定条件数据**
```sql
alter table test.user_event on cluster data_cluster delete where user_id='u00001';
```

# 自定义函数
不推荐使用外部语言编写自定义函数，例如：java、python 等，推荐使用自有的函数，逐步组合实现自定义函数，性能高

一个样例：
```sql
--分割字符串并把类型转换为整数
create function x_split as (x) ->
(
    arrayMap(
            y -> toUInt32(y), 
            splitByString(',', x)
        )
);
```


# 历史相关文章
- [Clickhouse中创建生成日期序列自定义函数](../../Clickhouse/Clickhouse中创建生成日期序列自定义函数/)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
