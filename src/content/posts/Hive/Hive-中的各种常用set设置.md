---
title: Hive 中的各种常用set设置
slug: Hive/Hive-中的各种常用set设置
published: 2022-11-23
description: Hive 常用set设置
tags: [Hive]
category: Hive
draft: false
---

# 背景
平时在跑数据时，需要在查询语句前设置一些set语句，这些set语句中其中有一些是配置hive的各功能，另一些是可以达到优化的目的，本篇文章对一些常用的set语句进行总结

# 常用set设置
- **查询结果显示表头**

执行完查询语句，输出结果时，会一起把字段的名字也打印出来
```sql
set hive.cli.print.header=true;  --默认为false，不打印表头
```

- **展示当前使用的数据库**

主要是在命令行模式中使用，方便核查是否切换到相应的数据库下
```sql
set hive.cli.print.current.db=true;  --默认为false，不显示当前数据库名字
```

- **设置是否使用元数据中的统计信息**

比如想要看数据一共有多少行的话，一般是从元数据中的统计信息直接获取，但有时这个统计信息没有更新，得到的是历史的统计信息，则需要修改为 `false`，然后再进行查询，才能统计出准确的数据
```sql
set hive.compute.query.using.stats=false;   --默认为true，使用元数据中的统计信息，提升查询效率
```

- **设置Fetch抓取，不走job，不用执行MapReduce**

一般用于快速获取样例数据，`select * from talbe_xxx limit 100`
```sql
set hive.fetch.task.conversion=more;  
```

- **设置查询任取走哪个队列**

一般公司的服务器集群中会配置好几个队列，不同的队列优先级不一样，并且资源配置有可能不一样，生产环境的任务肯定优先级高、计算资源多，数据分析的任务一般是单独的队列，计算资源少
```sql
set mapreduce.job.queuename=root.db;   --运维人员设置的队列名字
```
- **是否开启严格模式**

一般运维人员会设置为严格模式 `strict`，防止大量数据计算占用资源，多出现在笛卡尔积join时；或者查询的是分区表，但没有指定分区，明明sql语句没有逻辑错误，但是一直报错无法运行，可以尝试修改为非严格模式，看是否能运行
```sql
set hive.mapred.mode=nonstrict;    --nonstrict，strict   
```

- **with as 语句存储在本地，从而做到with…as语句只执行一次，来提高效率**

对应喜欢用 `with as` 形式查询的话，可以设置一下这个，来提升效率
```sql
set hive.optimize.cte.materialize.threshold=1;
```

- **配置计算引擎**

Hive底层的计算由分布式计算框架实现,目前支持三种计算引擎，分别是MapReduce、Tez、 Spark，默认为MapReduce
>**MapReduce引擎**：多job串联，基于磁盘，落盘的地方比较多。虽然慢，但一定能跑出结果。一般处理，周、月、年指标。
>
>**Spark引擎**：虽然在Shuffle过程中也落盘，但是并不是所有算子都需要Shuffle，尤其是多算子过程，中间过程不落盘 DAG有向无环图。 兼顾了可靠性和效率。一般处理天指标。
>
>**Tez引擎**：完全基于内存。 注意：如果数据量特别大，慎重使用。容易OOM。一般用于快速出结果，数据量比较小的场景。
```sql
set hive.execution.engine=mr;    --mr、tez、spark
```
# 其他set设置
```sql
set hive.exec.parallel=true;    --开启任务并行执行 
set hive.exec.parallel.thread.number=8;   -- 同一个sql允许并行任务的最大线程数
set hive.exec.max.dynamic.partitions=1000           -- 在所有执行MR的节点上，最大一共可以创建多少个动态分区。
set hive.exec.max.dynamic.partitions.pernode=100   -- 在每个执行MR的节点上，最大可以创建多少个动态分区
set hive.auto.convert.join = false;    --取消小表加载至内存中
set hive.mapjoin.smalltable.filesize=25000000;   --设置小表大小
```

# 历史相关文章
- [Hive 数据聚合成键值对时，根据值大小进行排序](./Hive-数据聚合成键值对时，根据值大小进行排序.md)
- [Hive中的常用函数](./Hive中的常用函数.md)
- [Hive中各种日期格式转换方法总结](./Hive中各种日期格式转换方法总结.md)
- [Hive HQL支持的2种查询语句风格，你喜欢哪一种？](./Hive---HQL支持的2种查询语句风格，你喜欢哪一种？.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
