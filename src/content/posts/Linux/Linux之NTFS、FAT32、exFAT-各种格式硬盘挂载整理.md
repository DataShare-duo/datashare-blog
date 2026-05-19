---
title: Linux之NTFS、FAT32、exFAT-各种格式硬盘挂载整理
slug: Linux/Linux之NTFS、FAT32、exFAT-各种格式硬盘挂载整理
published: 2020-11-11
description: Linux 各种格式硬盘挂载
tags: [Linux]
category: Linux
draft: false
---

# 背景
由于业务需要频繁处理大量视频（几十GB），通过公司内网传输太慢，于是就每次处理视频时需要在服务器挂载硬盘或U盘。业务人员给的硬盘或U盘格式有时不一样，目前遇到的格式：NTFS、FAT32、exFAT，这几种格式大家在Windows上基本很常见，于是总结了这些格式的硬盘如何有效挂载到Linux服务器，分享出来供大家参考
- NTFS挂载
- FAT32挂载
- exFAT挂载

# NTFS挂载
第一步：安装驱动`ntfs-3g`
```shell
yum install ntfs-3g
```
第二步：查看硬盘信息（硬盘已通过USB插入服务器）
```shell
fdisk -l 
```
会在最后列出该硬盘的信息，一般是sdb，默认只有1个分区，下面挂载时用的是**sdb1**

但有的硬盘里面也有2个分区的，如下所示：
```shell
Disk identifier: 9B602E4F-E563-4A27-9510-46DEBC0BAA20
#         Start          End    Size  Type            Name
 1           40       409639    200M  EFI System      EFI System Partition
 2       409640   3906961407    1.8T  Microsoft basic My Passport
```
如果是这种情况，下面挂载时就需要用到**sdb2**

第三步：挂载硬盘
```shell
cd /mnt
mkdir Windows   #挂载时一定要提前创建好该文件夹
mount -t ntfs-3g /dev/sdb1  /mnt/Windows
```
第四步：解除挂载
```shell
umount /dev/sdb1
```

***硬盘挂载基本就以上这四步，下面主要列出其他格式硬盘挂载的重点步骤***

# FAT32挂载
不需要驱动，可以直接挂载

下面的挂载命令 支持 **中文、挂载后不同用户可读写权限**，具体参数含义可自行百度查询

第三步：挂载硬盘
```shell
mount -t vfat -o iocharset=utf8,umask=000,rw,exec /dev/sdb1 /mnt/Windows
```
# exFAT挂载
第一步：安装驱动`fuse-exfat`、`exfat-utils`
```shell
yum install fuse-exfat
yum install exfat-utils
```
第三步：挂载硬盘
```shell
mount /dev/sdb2  /mnt/Windows
```
# 总结
- 有的格式需要安装驱动，有的不需要
- 硬盘里面具体要看有几个分区，挂载时指定分区号 `sdb1` or `sdb2`

# 历史相关文章
- [Linux （Centos 7）中 Anaconda环境管理，安装不同的版本Python包](./Linux-（Centos-7）中-Anaconda环境管理，安装不同的版本Python包.md)
- [Python文件打包成exe可执行程序](../Python基础库/Python文件打包成exe可执行程序.md)
**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注DataShare，不定期分享干货**
