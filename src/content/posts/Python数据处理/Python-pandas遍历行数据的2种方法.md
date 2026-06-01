---
title: Python pandas遍历行数据的2种方法
slug: Python数据处理/Python-pandas遍历行数据的2种方法
published: 2024-03-06
description: Python Pandas
image: /pandas.svg
tags: [python, pandas]
category: Python/Python数据处理
draft: false
---


# 背景
pandas在数据处理过程中，除了对整列字段进行处理之外，有时还需求对每一行进行遍历，来处理每行的数据。本篇文章介绍 2 种方法，来遍历pandas 的行数据

# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])   
#python 版本： 3.11.5

import pandas as pd

print(pd.__version__)
#2.1.0
```
# 演示数据
![演示数据](./images/6641583-8be62eaf7c7a3f27.png)

# 方法1
`pandas.DataFrame.itertuples`：返回的是一个命名元组

官方文档：https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.itertuples.html

**1. 无任何参数**
```python
import pandas as pd
data=pd.read_excel("data.xlsx")

for row in data.itertuples():
    print("row:",row,"\n")
    #row: Pandas(Index=0, 序号=1, 分割字符='1&1&1', 固定宽度='111') 
    
    print("type(row):",type(row),"\n")
    #type(row): <class 'pandas.core.frame.Pandas'> 
    
    print("row.序号:",row.序号)
    #row.序号: 1
    
    print("row.分割字符:",row.分割字符)
    #row.分割字符: 1&1&1
    
    print("row.固定宽度:",row.固定宽度)
    #row.固定宽度: 111
    
    break
```
<br/>

**2. 忽略掉索引**
```python
import pandas as pd
data=pd.read_excel("data.xlsx")

for row in data.itertuples(index=False):  #忽律索引
    print("row:",row,"\n")
    #row: Pandas(序号=1, 分割字符='1&1&1', 固定宽度='111') 
    
    print("type(row):",type(row),"\n")
    #type(row): <class 'pandas.core.frame.Pandas'> 
    
    print("row.序号:",row.序号)
    #row.序号: 1
    
    print("row.分割字符:",row.分割字符)
    #row.分割字符: 1&1&1
    
    print("row.固定宽度:",row.固定宽度)
    #row.固定宽度: 111
    
    break
```
<br/>

**3. 对命名元组起别名**
```python
import pandas as pd
data=pd.read_excel("data.xlsx")

for row in data.itertuples(index=False,name="data"):
    print("row:",row,"\n")
    #row: data(序号=1, 分割字符='1&1&1', 固定宽度='111')  
    
    print("type(row):",type(row),"\n")
    #type(row): <class 'pandas.core.frame.data'> 
    
    print("row.序号:",row.序号)
    #row.序号: 1
    
    print("row.分割字符:",row.分割字符)
    #row.分割字符: 1&1&1
    
    print("row.固定宽度:",row.固定宽度)
    #row.固定宽度: 111
    
    break
```

<br/>

# 方法2
`pandas.DataFrame.iterrows`：返回 `(index, Series)` 元组

官方文档：https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.iterrows.html
```python
import pandas as pd
data=pd.read_excel("data.xlsx")

for index,row in data.iterrows():
    print("index:",index,"\n")
    #index: 0
    
    print("row:",row,"\n")
    #row: 序号          1
    #分割字符    1&1&1
    #固定宽度      111
    #Name: 0, dtype: object
    
    print("type(row):",type(row),"\n")
    #type(row): <class 'pandas.core.series.Series'> 
    
    print("row['序号']:",row['序号'])
    #row['序号']: 1
    
    print("row['分割字符']:",row['分割字符'])
    #row['分割字符']: 1&1&1
    
    print("row['固定宽度']:",row['固定宽度'])
    #row['固定宽度']: 111
    
    break
```

# 历史相关文章
- [Python 利用pandas对数据进行特定排序](../../Python数据处理/Python-利用pandas对数据进行特定排序/)
- [Python pandas.2.0 初探](../../Python数据处理/Python-pandas-2-0-初探/)
- [Python pandas.str.replace 不起作用](../../Python数据处理/Python-pandas-str-replace-不起作用/)
- [Python数据处理中 pd.concat 与 pd.merge 区别](../../Python数据处理/Python数据处理中-pd-concat-与-pd-merge-区别/)
- [对比Excel，利用pandas进行数据分析各种用法](../../Python数据处理/对比Excel，利用pandas进行数据分析各种用法/)




**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
