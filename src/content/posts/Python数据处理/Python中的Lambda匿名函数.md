---
title: Python中的Lambda匿名函数
slug: Python数据处理/Python中的Lambda匿名函数
published: 2019-12-13
description: Python xlwings库
image: /python.jpg
showCoverInPost: false
tags: [python, Excel, 工具]
category: Python/Python数据处理
draft: false
---


# 背景
Lambda匿名函数在Python中经常出现，小巧切灵活，使用起来特别方便，但是小编建议大家少使用，最好多写几行代码，自定义个函数。

既然Python中存在Lambda匿名函数，那么小编本着存在即合理的原则，还是介绍一下，本篇文章翻译自《Lambda Functions in Python》，分享出来供大家参考学习

原文地址：[https://www.clcoding.com/2024/03/lambda-functions-in-python.html](https://www.clcoding.com/2024/03/lambda-functions-in-python.html)

# 案例1：基本语法
**常规函数**
```python
def add(x, y):
    return x + y
```

**匿名函数**
```python
lambda_add = lambda x, y: x + y
```

**调用2种类型函数**
```python
print(add(3, 5))   #8
print(lambda_add(3, 5))    #8
```

# 案例2：在sorted排序函数中使用匿名函数

```python
students = [("Alice", 25), ("Bob", 30), ("Charlie", 22)]

sorted_students = sorted(students, key=lambda student: student[1])

print("Sorted Students by Age:", sorted_students)
#Sorted Students by Age: [('Charlie', 22), ('Alice', 25), ('Bob', 30)]
```

# 案例3：在filter过滤函数中使用匿名函数
```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

even_numbers = list(filter(lambda x: x % 2 == 0, numbers))

print("Even Numbers:", even_numbers)
#Even Numbers: [2, 4, 6, 8]
```

# 案例4：在map函数中使用匿名函数
```python
numbers = [1, 2, 3, 4, 5]

squared_numbers = list(map(lambda x: x**2, numbers))

print("Squared Numbers:", squared_numbers)
#Squared Numbers: [1, 4, 9, 16, 25]
```

# 案例5：在max函数中使用匿名函数
```python
numbers = [10, 5, 8, 20, 15]

max_number = max(numbers, key=lambda x: -x)

print("Maximum Number:", max_number)
#Maximum Number: 5
```

# 案例6：在sorted排序函数中，多个排序条件
```python
people = [{"name": "Charlie", "age": 25}, 
          {"name": "Bob", "age": 30}, 
          {"name": "Alice", "age": 25}]

sorted_people = sorted(people, 
                       key=lambda person: (person["age"], person["name"]))

print("Sorted People:", sorted_people)
#Sorted People: [{'name': 'Alice', 'age': 25}, {'name': 'Charlie', 'age': 25}, {'name': 'Bob', 'age': 30}]
```

# 案例7：在reduce函数中使用匿名函数
```python
from functools import reduce

numbers = [1, 2, 3, 4, 5]
product = reduce(lambda x, y: x * y, numbers)
print("Product of Numbers:", product)
#Product of Numbers: 120
```

# 案例8：在条件表达式中使用匿名函数

```python
numbers = [10, 5, 8, 20, 15]

filtered_and_squared = list(map(lambda x: x**2 if x % 2 == 0 else x, numbers))

print("Filtered and Squared Numbers:", filtered_and_squared)
#Filtered and Squared Numbers: [100, 5, 64, 400, 15]
```

# 历史相关文章
- [Python利用partial偏函数，生成不同的聚合函数](../../Python基础库/Python利用partial偏函数，生成不同的聚合函数/)
- [Python 字典已经是有序的，你知道吗？](../../Python基础库/Python-字典已经是有序的，你知道吗？/)
- [Python 内建模块 bisect，数组二分查找算法](../../Python基础库/Python-内建模块-bisect，数组二分查找算法/)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**












