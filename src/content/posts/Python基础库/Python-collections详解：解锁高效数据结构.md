---
title: Python collections详解：解锁高效数据结构
slug: Python基础库/Python-collections详解：解锁高效数据结构
published: 2025-08-12
description: Python collections基础库
image: ./python.jpg
showCoverInPost: false
tags: [python, 基础库]
category: Python/Python基础库
draft: false
---


# 背景
虽然  Python 中已提供了 **列表**、**字典** 等非常灵活的数据结构，但是 **`collections`** 模块提供了高性能的容器数据类型，能大幅优化代码效率和可读性，本文将深入解析该模块中的六大核心工具，助你写出更优雅的Python代码，避免你重复造轮子

# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.11
```
# namedtuple：命名元组
传统元组通过索引访问元素，代码可读性差：
```python
point = (2, 5)
print(f"X: {point[0]}, Y: {point[1]}")  # 可读性低
```
**namedtuple** 赋予元组字段名
```python
from collections import namedtuple

# 创建具名元组类型
Point = namedtuple('Point', ['x', 'y'])
p = Point(2, 5)

print(p.x, p.y)  # 直观访问
print(p._asdict()) # 转为字典：{'x': 2, 'y': 5}
```
>✅ 适用场景：数据库查询结果、坐标点等轻量级数据结构
# deque：高效双端队列
列表(list)在头部插入/删除效率为 `O(n)`，deque 在两端操作均为 `O(1)`
```python
from collections import deque

d = deque([1, 2, 3])
d.appendleft(0)  # 左侧添加 → deque([0, 1, 2, 3])
d.extend([4, 5]) # 右侧扩展 → [0,1,2,3,4,5]
d.rotate(2)      # 向右旋转 → [4,5,0,1,2,3]
```
>🔥 性能对比：千万元素头部插入
>- **list.insert(0, x)**：耗时2.1秒
>- **deque.appendleft(x)**：耗时0.02秒

# Counter：元素统计利器
快速统计可迭代对象中元素频率
```python
from collections import Counter

text = "python collections is powerful"
word_count = Counter(text.split())

print(word_count.most_common(2))
# 输出：[('python', 1), ('collections', 1)]

# 数学运算
c1 = Counter(a=3, b=1)
c2 = Counter(a=1, b=2)
print(c1 + c2)  # Counter({'a': 4, 'b': 3})
```
>💡 进阶技巧：elements()方法生成迭代器，subtract()实现减法操作


# defaultdict：智能字典
避免KeyError异常，自动初始化默认值
```python
from collections import defaultdict

# 值为列表的字典
dd = defaultdict(list)
dd['fruits'].append('apple')  # 无需初始化
print(dd['animal'])  # 访问不存在的key，返回空列表 []

# 值为计数的字典
count_dict = defaultdict(int)
for char in "abracadabra":
    count_dict[char] += 1
```
>支持任意可调用对象：**defaultdict(lambda: 'N/A')**


# ChainMap：字典聚合器
合并多个字典而不创建新对象
```python
from collections import ChainMap

dict1 = {'a': 1, 'b': 2}
dict2 = {'b': 3, 'c': 4}

chain = ChainMap(dict1, dict2)
print(chain['b'])  # 输出2（dict1优先）
print(chain['c'])  # 输出4

# 动态添加字典
chain = chain.new_child({'d': 5}) 
```
>🌟 特点：查找顺序可定制，原始字典修改实时同步


# OrderedDict：有序字典
虽然Python3.7+的dict已有序，但OrderedDict提供额外功能
```python
from collections import OrderedDict

od = OrderedDict()
od['z'] = 1
od['a'] = 2
print(list(od.keys()))  # 保持插入顺序：['z', 'a']

# 特殊方法
od.move_to_end('z')  # 移动键到末尾 ，OrderedDict([('a', 2), ('z', 1)])
od.popitem(last=False)  # FIFO删除，删除 ('a', 2)
```


# 历史相关文章
- [Python-字典已经是有序的，你知道吗？](/Python基础库/Python-字典已经是有序的，你知道吗？.md)
- [Python中的Lambda匿名函数](/Python数据处理/Python中的Lambda匿名函数.md)
- [Python利用partial偏函数，生成不同的聚合函数](/Python基础库/Python利用partial偏函数，生成不同的聚合函数.md)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
