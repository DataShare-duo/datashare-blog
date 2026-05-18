---
title: hadoop 常用命令总结
slug: Hive/hadoop-常用命令总结
published: 2024-09-27
description: hadoop 常用命令总结
tags: [hadoop]
category: Hive
draft: false
---


# 背景
在本地记事本记得太多了，有的命令使用频次很低，时间长了容易忘记，分享出来后续使用时查找

# 常用命令
- 列出数据库下的所有表
```bash
hadoop fs -ls /user/hive/warehouse/test.db
```
<br/>

- 统计数据库占用磁盘的总大小
```bash
hadoop fs -du -s -h /user/hive/warehouse/test.db
```
<br/>

- 查看数据表中的数据
```bash
hadoop fs -cat /user/hive/warehouse/test.db/test/00000_0 | head 
```
<br/>

- 设置副本数
Hadoop默认是3个副本，replication factor  副本因子
```bash 
hadoop fs -setrep -R 1 /user/hive/warehouse/test.db/test
```
<br/>

- 创建文件夹
```bash
hadoop fs -mkdir /user/datashare
```
<br/>

- 修改文件权限
```bash
hadoop fs -chmod 700 /user/datashare
hadoop fs -chmod -R 700 /user/datashare   #递归进行，针对子文件夹
```
<br/>

- 检查HDFS中的文件是否存在
```bash
hadoop fs -test -e /user/hive/warehouse/test.db/test/0*
```
<br/>

- 统计文件个数
```bash
hadoop fs -ls -h /user/hive/warehouse/test.db/test/dt=202310 | wc -l
hadoop fs -count /user/hive/warehouse/test.db/test/dt=202310
```
<br/>

- 统计多个文件夹的总占用大小
```bash
hadoop fs -du -s  /user/hive/warehouse/test.db/test/dt=202310*  |   awk '{print $1}' | awk '{sum+=$1}END{print sum/1024**3 " G"}'
```
<br/>

- 统计每个文件夹的单独大小
```bash
hadoop fs -du -s  /user/hive/warehouse/test.db/test/dt=202310*  |   awk '{print $1/1024**3 " G"}'
```
<br/>

- 跨集群访问
```bash
hadoop fs -ls hdfs://10.20.1.100:8100/
```
<br/>

- 查看hadoop 版本
```bash
hadoop version
```
<br/>

- 查看数据缺失的块
```bash
hadoop fsck /user/hive/warehouse/test.db/test
```
<br/>

- 复制分区至新表
```bash
1. CREATE TABLE new_table LIKE old_table;
2. 使用hadoop fs -cp 命令，把old_table对应的HDFS目录的文件夹全部拷贝到new_table对应的HDFS目录下；
3. 使用MSCK REPAIR TABLE new_table;修复新表的分区元数据；
```
<br/>

- 查看数据库里面各数据表的大小，并进行排序
```bash
hadoop fs -du -s /user/hive/warehouse/test.db/* | sort -n | numfmt --to=iec --field=1
```
`numfmt --to=iec --field=1` 的作用是仅将第一列（大小）转换为人类可读的格式，而不改变第二列（路径）的内容。
`--field=1` 让 numfmt 只处理第一列，从而避免误修改文件路径

- 删除文件、空目录
```bash
hadoop fs -rm /user/hive/warehouse/emptydir
```
<br/>

- 删除文件夹
```bash
hadoop fs -rmr /user/hadoop/dir
```


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
