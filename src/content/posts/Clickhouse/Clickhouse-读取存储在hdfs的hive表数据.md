---
title: Clickhouse 读取存储在hdfs的hive表数据
slug: Clickhouse/Clickhouse-读取存储在hdfs的hive表数据
published: 2025-03-17
description: hive数据同步至clikehouse
tags: [Clickhouse, Hive]
category: Clickhouse
draft: false
---

# 背景
离线数据经过 hive 处理后，生成的新数据，有时需要对接至研发侧 clikehouse，供前端用户查询使用，所以会涉及到hive数据同步至clikehouse，因为hive数据底层是存储在 hdfs ，因此只要知道hive的建表语句（元数据），再结合 clikehouse 中的特定表引擎（本质是表映射），即可实现 clikehouse 直接读取hdfs数据

# 小编环境
操作系统版本 与 Clickhouse 版本
```bash
cat /etc/redhat-release
# CentOS Linux release 7.2.1511 (Core)

clickhouse -V
#ClickHouse local version 24.7.2.13 (official build)
```
# hive中建表并插入测试数据
设置字段分割符为 `\t` 
```sql
--建表语句
create table  test_bigdata.test_hdfs_ck (
uid string comment '用户id',
name string comment '姓名',
age bigint comment '年龄',
dt string comment '注册日期'
)  
row format delimited fields terminated by '\t'
stored as textfile
;

--插入数据
insert into table test_bigdata.test_hdfs_ck
values 
('uid1','张三','18','20250101'),
('uid2','john','28','20250317'),
('uid3','deepseek','10','20250315')
;
```

# 在clikehouse中创建HDFS映射表
***前提：需要打通不同服务器之间的网络策略***
利用 clikehouse 中的 HDFS 表引擎，指定 hdfs 的路径、hive中表的存储格式，即可创建映射表
```sql
--创建HDFS映射表
create table test.test_hdfs_ck (
uid String comment '用户id',
name String comment '姓名',
age UInt16 comment '年龄',
dt Date comment '注册日期'
)
ENGINE = HDFS('hdfs://10.20.1.1:8020/user/hive/warehouse/test_bigdata.db/test_hdfs_ck/*', 'TSV')
;
```
# 在clikehouse中创建本地表，并导入数据
用户在查询数据时，需要实时返回，有时效性要求，所以需要把hdfs的映射表数据导入本地表中
```sql
--创建本地表
create table test.test_ck (
uid String comment '用户id',
name String comment '姓名',
age UInt16 comment '年龄',
dt Date comment '注册日期'
)
ENGINE=MergeTree
PARTITION BY dt
ORDER BY uid
;

--把映射表数据导入本地表
insert into test.test_ck
select *
from test.test_hdfs_ck
;
```

# 注意事项
- 低版本 clickhouse 不支持创建该表类型引擎
- 需要有权限读取hdfs指定路径，默认是clikehouse用户
- 日期格式的解析，clickhouse 中默认可以直接解析 `yyyy-MM-dd`，但标准规范的8位数字 `yyyyMMdd` 在映射时，也可以自动解析


# 历史相关文章
- [Clickhouse 基础使用教程](../../Clickhouse/Clickhouse-基础使用教程/)
- [Clickhouse中创建生成日期序列自定义函数](../../Clickhouse/Clickhouse中创建生成日期序列自定义函数/)
**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
