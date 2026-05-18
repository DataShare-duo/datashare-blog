---
title: Hive HQL支持的2种查询语句风格，你喜欢哪一种？
slug: Hive/Hive---HQL支持的2种查询语句风格，你喜欢哪一种？
published: 2021-08-27
description: Hive 2种查询语句风格
tags: [Hive]
category: Hive
draft: false
---

# 背景
在平时业务运营分析中经常会提取数据，也就是大家俗称的Sql Boy，表哥表姐，各大公司数据中台现在大部分用的都是基于Hadoop的分布式系统基础架构，用的比较多的有Hive数据仓库工具，数据分析师在数据查询时用的就是HQL，语法与Mysql有所不同，基本每天都会写大量的HQL语句，但你有试过哪些风格的写法呢？哪种风格的查询语句更容易理解呢？可能不同的人有不同的看法，下面展示具体的风格代码样式，看看你喜欢哪种
>Hadoop是一个由Apache基金会所开发的分布式系统基础架构。用户可以在不了解分布式底层细节的情况下，开发分布式程序。充分利用集群的威力进行高速运算和存储。Hadoop实现了一个分布式文件系统（ Distributed File System），其中一个组件是HDFS（Hadoop Distributed File System）

>hive是基于Hadoop的一个数据仓库工具，用来进行数据提取、转化、加载，这是一种可以存储、查询和分析存储在Hadoop中的大规模数据的机制。hive数据仓库工具能将结构化的数据文件映射为一张数据库表，并提供SQL查询功能，能将SQL语句转变成MapReduce任务来执行。



# 风格一
这种风格大家都比较常用，**从结果向源头倒着推**，直接多层嵌套，一层一层往里面写，业务逻辑复杂的话有可能写很多层，达到几百行之多，目前很多公司在有数仓的支持下，基本嵌套的层数会比较少
```sql
select *
from
(
	(select *
	from a_temp
	where xxxx
    group by xxxx) as a
	left join 
	(select *
	from b_temp
	where xxxx) as b 
	on a.id=b.id
) temp
where xxxx
group by xxxx
order by xxxx
```
# 风格二
这种风格是利用 `with` 语句，**从源头向结果正向推**，可以把 `with` 语句理解为建立了一个临时视图/表一样，后面的表引用前面的表，逻辑是正向推进
```sql
with a as(select *
		from a_temp
		where xxxx 
		group by xxxx),
	 b as(select *
		from b_temp
		where xxxx)
select *
from a left join b on a.id=b.id
where xxxx 
group by xxxx
order by xxxx
```
# 两种风格的区别
- 风格一：用的最多，从结果向源头倒着推
- 风格二：容易理解，从源头向结果正向推

# 历史相关文章
- [Python 利用Pandas把数据直接导入Mysql](../Python数据处理/Python-利用Pandas把数据直接导入Mysql.md)
- [Python 基于ssh连接远程Mysql数据库](../Python基础库/Python-基于ssh连接远程Mysql数据库.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
