---
title: Python 记录re正则模块，方便后期查找使用
slug: Python基础库/Python-记录re正则模块，方便后期查找使用
published: 2023-09-12
description: Python re正则模块
image: /python.jpg
showCoverInPost: false
tags: [python, 正则, 基础库]
category: Python/Python基础库
draft: false
---


# 前言
小编第一次了解正则，是在VBA编程时用到，当时看了很多的学习资料，来了解和学习正则。因为现在数据录入、数据存放相对都比较规范，使用正则的场景越来越少，但运用正则在杂乱的数据中提取一些有用数据还是很方便，最近阅读书籍时又看到了正则相关的内容，于是总结了一下，分享出来，供大家参考学习

**官方文档**：https://docs.python.org/zh-cn/3/library/re.html

>**Excelhome精选正则文章** <br/>
正则文章：[正则表达式入门与提高---VBA平台的正则学习参考资料](https://club.excelhome.net/thread-1128647-1-3.html) <br/>
地址：https://club.excelhome.net/thread-1128647-1-3.html

# 环境与正则库版本
```python
import sys
import re 

print('python 版本：',sys.version.split('|')[0])   #python 版本： 3.11.4
print('re 正则库版本：',re.__version__)  #re 正则库版本： 2.2.1
```
# 正则模块中的函数/方法
- **re.compile**
将正则表达式模式编译为一个正则表达式对象，方便多次使用
```python
import re

text='Does this text match the pattern?'
regexes=re.compile('this')
print(regexes)   #re.compile('this')
print(regexes.search(text))  #<re.Match object; span=(5, 9), match='this'>
```
- **re.search**
在给定的字符串中 查找/匹配 正则表达式模式，**首次**出现的位置，如果能匹配到，则返回相应的正则表达式对象；如果匹配不到，则返回 `None`
```python
import re

pattern='this'
text='Does this text match the text pattern?'

match=re.search(pattern,text)

print(match)  #<re.Match object; span=(5, 9), match='this'>
print(match.re)  #re.compile('this')
print(match.re.pattern)  #this
print(match.string)  #Does this text match the text pattern?
print(match.start())  #5
print(match.end())  #9
```
- **re.match**
在给定的字符串**开头**进行匹配，如果在开头能与给定的正则表达式模式匹配，则返回相应的正则表达式对象；如果匹配不到，则返回 `None`
```python
import re

text='Does this text match the text pattern?'

match1=re.match('Does',text)
print(match1)   #<re.Match object; span=(0, 4), match='Does'>
print(match1.span())  #(0, 4)

match2=re.match('this',text)
print(match2)  #None
```
- **re.fullmatch**
如果整个字符串需要与给定的正则表达式模式匹配，则返回相应的相应的正则表达式对象；如果匹配不到，则返回 `None`
```python
import re

text='Does this text match the text pattern?'

match1=re.fullmatch('Does this text match the text pattern\?',text)
print(match1)   #<re.Match object; span=(0, 38), match='Does this text match the text pattern?'>

match2=re.fullmatch('Does this text',text)
print(match2)  #None


match3=re.fullmatch('Does .* pattern\?',text)
print(match3)  #<re.Match object; span=(0, 38), match='Does this text match the text pattern?'>
```

- **re.findall**
对字符串与给定的正则表达式模式，从左至右进行查找，匹配结果按照找到的顺序进行返回，返回结果是以字符串列表或字符串元组列表的形式，如果匹配不到，返回空列表的形式
```python
import re

text='Does this text match the text pattern?'

matches1=re.findall('text',text)
print(matches1)   #['text', 'text']

matches2=re.findall('regexes',text)
print(matches2)   #[]
```
- **re.finditer**
与 `findall` 方法类似，结果返回的是一个迭代器，并且每个元素是匹配到的正则表达式对象
```python
import re

text='Does this text match the text pattern?'

matches1=re.finditer('text',text)
print(matches1)  #<callable_iterator object at 0x0000024D0E9018D0>
for match in matches1:
    print(match) 
    #<re.Match object; span=(10, 14), match='text'>   
    #<re.Match object; span=(25, 29), match='text'>

matches2=re.findall('regexes',text)
print(matches2)  #[]
```
***本篇文章只介绍了几个常用的方法，重点是方法的含义，而没有介绍元字符相关的内容，如果对正则表达式感兴趣，可以深入学习拓展知识范围***

# 历史相关文章
- [Python 内建模块 bisect，数组二分查找算法](../../Python基础库/Python-内建模块-bisect，数组二分查找算法/)
- [Python 标准库heapq，堆数据结构操作详解](../../Python基础库/Python-标准库heapq，堆数据结构操作详解/)
- [Python math模块详解](../../Python基础库/Python-math模块详解/)
- [Python内置的 os 模块常用函数、方法](../../Python基础库/Python内置的-os-模块常用函数、方法/)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
