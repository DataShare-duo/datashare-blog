---
title: Python 字符串格式化方法总结
slug: Python数据处理/Python-字符串格式化方法总结
published: 2021-01-19
description: Python 字符串格式化
image: /python.jpg
showCoverInPost: false
tags: [python]
category: Python/Python数据处理
draft: false
---


# 背景
字符串格式化的主要使用场景是让变量打印出来，让人看着美观、易于查看。有时会直接print出来；有时会把这些内容写到文件里面，也就是进行日志记录。比如日志文件，设置好格式，后期在查询问题时，就可以快速定位。

字符串格式化就类似于手机APP界面一样，UI、排版设计都是为了使人机交互更加直观，内容让人看起来更美观、更舒服。

# 字符串格式化方法
- **方法 1** 

在 python 2.6 之前，利用 百分号% 占位符，进行格式化
```python
>>> name = '张三'
>>> print('哈喽，%s'%name)
哈喽，张三
```
- **方法 2** ---------- 现阶段使用最多的方法

Python2.6 引入，性能比 % 更强大，字符串的 format 方法 
```python
>>> name = '张三'
>>> '哈喽，{}'.format(name)
'哈喽，张三'
```
- **方法 3** ---------- 推荐使用的方法

为了进一步简化格式化方法，Eric Smith 在2015年提交了 PEP 498 -- Literal String Interpolation 提案。字符串开头加上一个字母 f ，是在 Python3.6 新加入的字符串格式化方法
```python
>>> name = '张三'
>>> f'哈喽，{name}'
'哈喽，张三'
```
<br/>

*推荐大家用最新的方法*
# 推荐方法常规用法
###### 设定浮点数精度
需要加一个 :（冒号）再加一个 .（英文句号）然后跟着小数点位数最后以f（float）结尾
```python
num = 3.1415926   #山巅一寺一壶酒
print(f'圆周率保留两位小数为：{num:.2f}')

#圆周率保留两位小数为：3.14
```
###### 数字格式化为百分数
方法与浮点数格式化类似，但是要用%代替结尾的f
```python
a = 1
b = 3

c = a / b

print(f'百分数为：{c:%}')
#百分数为：33.333333%

print(f'百分数保留两位小数为：{c:.2%}')
#百分数保留两位小数为：33.33%
```
###### 格式化 datetime 对象
支持的格式详见官方文档：
[https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes)
```python
import datetime

now = datetime.datetime.now()
print(f'{now:%Y-%m-%d %H:%M:%S}')
#2021-01-19 16:44:32
```
###### 字符串前补零
`{var:0len}` 方法来进行字符串补零，len是最终返回字符串的长度
```python
num = 123
print(f"{num:05}")
#00123
```
###### 字符串居中
想要实现字符串居中，可以通过 `var:^N` 的方式。其中var是你想要打印的变量，N是字符串长度。如果N小于var的长度，会打印全部字符串。
```python
test = 'hello world'

print(f'{test:^20}')
#    hello world     

print(f'{test:*^20}')
#****hello world*****

print(f'{test:^2}')
#hello world
```
###### 进制转换
```python
print(f'{7:b}')
#111

bases = {"b": "bin", 
         "o": "oct", 
         "x": "hex", 
         "X": "HEX", 
         "d": "decimal"}

for n in range(1,21):
    #print(n)
    for base,desc in bases.items():
        print(f'{desc}:{n:5{base}}',end=' '*5)
    print()
```
![进制转换](./images/6641583-10126f12dc2dfadb.webp)


# 参考文章
- https://miguendes.me/73-examples-to-help-you-master-pythons-f-strings
- https://mp.weixin.qq.com/s/0F06lMbJSqN2msX4bNl2Aw

# 历史相关文章
- [Python 两个字典如何实现相加？（相同的键，值相加）](./Python-两个字典如何实现相加？（相同的键，值相加）.md)
- [利用Python枚举所有的排列情况](../数学知识/利用Python枚举所有的排列情况.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
