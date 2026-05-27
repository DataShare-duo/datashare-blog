---
title: Python 常用的加解密算法实例应用
slug: Python数据处理/Python-常用的加解密算法实例应用
published: 2024-02-04
description: Python 加解密算法
tags: [python, 算法]
category: Python/Python数据处理
draft: false
---


# 背景
经过移动互联网的蓬勃发展后，促使数字化也进入大众视野，现阶段各个行业能数字化的基本都数字化，至于数字化后好用不好用是另一回事了

数字化就会涉及到数据处理、数据存放等，紧接着引出了数据安全，数据存放时是否需要加密的问题，大型公司数据存放在服务器时，敏感数据基本都是加密后存放

小编这里大概梳理了几个常用的加密算法，本篇文章重点是实际使用，不介绍算法原理，算法原理相对比较深奥，涉及到密码学，小编也研究不懂

# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])   
#python 版本： 3.11.5
```
<br/>

DES、AES加密算法需要利用三方包 `pycryptodome`

```python
#需要先安装三方包
#pip install pycryptodome

import Crypto

print(Crypto.__version__)   #3.20.0
```
# 不同的加解密算法
## MD5
MD5是单向加密算法，加密后无法解密，MD5重复（碰撞）概率：三百万亿亿亿亿 分之一
$$(\frac{1}{16})^{32}=(\frac{1}{2})^{128}$$
$$2^{128}=340 2823 66920938 46346337 46074317 68211456$$

```python
import hashlib

data='DataShare 中国'
print(hashlib.md5(data.encode(encoding='UTF-8')).hexdigest())
#6c066bb026f2529e9694420b70b78df2
```
<br/>

## MD5，加盐
加盐可能初听起来比较奇怪，小编个人感觉应该是翻译不够直白，应该是对数据先进行一些加工，再进行MD5加密
```python
import hashlib

data='DataShare 中国'
salt='12345'

data_salt=data+salt
print(hashlib.md5(data_salt.encode(encoding='UTF-8')).hexdigest())
#2a0e91ca52ec8da75171e9165fc26e28
```
<br/>

## DES
DES是一种**对称加密**，所谓对称加密就是加密与解密使用的秘钥是一个，数据加密完成后能解密还原

英语：Data Encryption Standard，即数据加密标准，是一种使用密钥加密的块算法

**ECB模式**
- 加密
```python
from Crypto.Cipher import DES
import binascii

secret='DataShar'  #秘钥必须为8字节
data='DataShare 中国'

#创建一个des对象 ,DES.MODE_ECB 表示模式是ECB模式
des = DES.new(bytes(secret, encoding="utf-8"),AES.MODE_ECB)  
data_encrypt_bin=des.encrypt(bytes(data, encoding="utf-8"))
print(binascii.b2a_hex(data_encrypt_bin).decode())
#0ef72f2ea2eeaff395f2f75fbb76e124
```
- 解密
```python
from Crypto.Cipher import DES
import binascii

secret='DataShar'  #秘钥必须为8字节

data_encrypt='0ef72f2ea2eeaff395f2f75fbb76e124'
data_encrypt_bin=binascii.unhexlify(bytes(data_encrypt, encoding="utf-8"))

#创建一个des对象 ,DES.MODE_ECB 表示模式是ECB模式
des = DES.new(bytes(secret, encoding="utf-8"),AES.MODE_ECB) 
print(des.decrypt(data_encrypt_bin).decode())
#DataShare 中国
```
<br/>

**CBC模式**
该模式需要一个偏移量，也就是初始化的值，对数据进行初始化处理，类似MD5加盐
- 加密
```python
from Crypto.Cipher import DES
import binascii

secret='DataShar'  #秘钥必须为8字节
data='DataShare 中国'
iv = b'12345678'  #偏移量，bytes类型，必须为8字节

des = DES.new(bytes(secret, encoding="utf-8"),DES.MODE_CBC,iv) #创建一个des对象
data_encrypt_bin=des.encrypt(bytes(data, encoding="utf-8"))
print(binascii.b2a_hex(data_encrypt_bin).decode())
#8d5e64e6a20638158d6a2fe43f0cc23d
```

- 解密
```python
from Crypto.Cipher import DES
import binascii

secret='DataShar'  #秘钥必须为8字节
iv = b'12345678'  #偏移量，bytes类型，必须为8字节

data_encrypt='8d5e64e6a20638158d6a2fe43f0cc23d'
data_encrypt_bin=binascii.unhexlify(bytes(data_encrypt, encoding="utf-8"))

des = DES.new(bytes(secret, encoding="utf-8"),DES.MODE_CBC,iv) #创建一个des对象
print(des.decrypt(data_encrypt_bin).decode())
#DataShare 中国
```
<br/>

## AES
高级加密标准（英语：Advanced Encryption Standard，缩写：AES），是美国联邦政府采用的一种区块加密标准，这个标准用来替代原先的DES，已经被多方分析且广为全世界所使用

AES是一种**对称加密**，所谓对称加密就是加密与解密使用的秘钥是一个，数据加密完成后能解密还原

**ECB模式**

- 加密
```python
from Crypto.Cipher import AES
import binascii

secret='DataShareDataSha'  #秘钥必须为16字节或者16字节倍数的字节型数据
data='DataShare 中国'

#创建一个aes对象 ,AES.MODE_ECB 表示模式是ECB模式
aes = AES.new(bytes(secret, encoding="utf-8"),AES.MODE_ECB)  

data_encrypt_bin=aes.encrypt(bytes(data, encoding="utf-8"))
print(binascii.b2a_hex(data_encrypt_bin).decode())
#bae24aeaa8f1258a97edd935ed4ca495
```
- 解密
```python
from Crypto.Cipher import AES
import binascii

secret='DataShareDataSha'  #秘钥必须为16字节或者16字节倍数的字节型数据

data_encrypt='bae24aeaa8f1258a97edd935ed4ca495'
data_encrypt_bin=binascii.unhexlify(bytes(data_encrypt, encoding="utf-8"))

#创建一个aes对象 ,AES.MODE_ECB 表示模式是ECB模式
aes = AES.new(bytes(secret, encoding="utf-8"),AES.MODE_ECB)
print(aes.decrypt(data_encrypt_bin).decode())
#DataShare 中国
```
<br/>

**CBC模式**
该模式需要一个偏移量，也就是初始化的值，对数据进行初始化处理，类似MD5加盐
- 加密
```python
from Crypto.Cipher import AES
import binascii

secret='DataShareDataSha'  #秘钥必须为16字节或者16字节倍数的字节型数据
data='DataShare 中国'
iv = b'0123456789abcdef'  #偏移量，bytes类型，必须为16字节

aes = AES.new(bytes(secret, encoding="utf-8"),AES.MODE_CBC,iv) #创建一个aes对象
data_encrypt_bin=aes.encrypt(bytes(data, encoding="utf-8"))
print(binascii.b2a_hex(data_encrypt_bin).decode())
#6866c9639f59d3485c50d30ec383b70b
```

- 解密
```python
from Crypto.Cipher import AES
import binascii

secret='DataShareDataSha'  #秘钥必须为16字节或者16字节倍数的字节型数据
iv = b'0123456789abcdef'  #偏移量，bytes类型，必须为16字节

data_encrypt='6866c9639f59d3485c50d30ec383b70b'
data_encrypt_bin=binascii.unhexlify(bytes(data_encrypt, encoding="utf-8"))

aes = AES.new(bytes(secret, encoding="utf-8"),AES.MODE_CBC,iv) #创建一个aes对象
print(aes.decrypt(data_encrypt_bin).decode())
#DataShare 中国
```

# 历史相关文章
- [Python 标准库之pathlib，路径操作](../Python基础库/Python-标准库之pathlib，路径操作.md)
- [Python 记录re正则模块，方便后期查找使用](../Python基础库/Python-记录re正则模块，方便后期查找使用.md)
- [Python 内建模块 bisect，数组二分查找算法](../Python基础库/Python-内建模块-bisect，数组二分查找算法.md)
- [Python 标准库heapq，堆数据结构操作详解](../Python基础库/Python-标准库heapq，堆数据结构操作详解.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
