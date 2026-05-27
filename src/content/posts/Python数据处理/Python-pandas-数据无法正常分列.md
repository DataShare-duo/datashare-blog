---
title: Python pandas 数据无法正常分列
slug: Python数据处理/Python-pandas-数据无法正常分列
published: 2019-11-29
description: Python Pandas
image: /pandas.svg
tags: [python, pandas]
category: Python/Python数据处理
draft: false
---


在数据处理时，有时需要对数据进行分列，类似于Excel里面的分列功能，这个在pandas里面也可以实现，下面就来详细介绍相关的方法及注意点，前提是你已经对pandas有一定的了解

# 导入数据
这里介绍的是从Excel导入数据，当然也可以从其他文件导入、数据库查询后导入等，为了弄清楚里面的细节，本教程从Excel导入数据
```python
import pandas as pd
import numpy as np

data=pd.read_excel('split.xlsx')
```
查看原始数据及各列数据类型，可以看到指标、选项都是object类型，**其中选项列没有缺失值**
![原始数据.png](./images/6641583-2212f4a79be0f596.webp)


# 对选项列进行分列
对导入的原始数据进行分列，这里运用的是[pandas.Series.str.split](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.str.split.html)方法，可以理解为把Series作为字符串进行分列操作，分列都是对字符串进行操作的



```
split_data=data['选项'].str.split(':',expand=True)   #需要添加expand=True，使分列后的数据扩展为一个数据框
split_data
```
![原始数据分列.png](./images/6641583-9f8edd5a95d8ad53.webp)

**可以明显看到分列后的数据，第1、5、6索引行全是缺失值，** 对比上面的原始数据，这些都是只有一个数字，**难道分列方法split对只有一个数字不能分列吗？其实则并不然，实际的原因请往下看**
# 寻找原因
查看Excel里面的数据寻找原因，**发现选项所在列，单个数字在Excel单元格是数字，其他的都是文本**，因Excel里面数字一般都是在单元格里面都是靠右对齐，而文本都是靠左对齐
![Excel数据.png](./images/6641583-500eddf0575129cd.webp)

**但是pandas导入数据后，已经查看了选项列为object类型，难道判断的数据类型有问题？** 请继续往下看

# 强制转换数据类型，再次分列

```python
data['选项']=data['选项'].astype('str')
#data['选项']=data['选项'].astype('object')     #这两个代码都可以转换

split_data=data['选项'].str.split(':',expand=True)
split_data
```
![数据类型转换后再分列.png](./images/6641583-afd0b66784a6a463.webp)
可以看到已经成功进行分列了，**说明pandas读取的数据，判断出来的数据类型并不一定是这一列所有数据的真实类型，而是能概括所有类型的一个较大的类型（兼容所有类型），并没有强制转换为同一个数据类型，比如选项列，里面有数值型、字符串型，那么较大的一个类型是object，pandas及认为该列数据类型是object**

# 合并数据
```
split_data.columns=['s_1','s_2','s_3','s_4']
data.join(split_data)   #join比较方便，根据索引直接对两个表进行链接，而merge需要设置链接时的字段
```
![成功分列后数据.png](./images/6641583-ef591ea6f196c1eb.webp)

# 分列时注意事项
1. 导入数据后一定要检查数据类型，不要急着去处理
2. 分列前检查该列数据类型，确保该列数据类型都是字符串类型，或者object类型，当数据量很大的时候这个很容易出错

# pandas里面数据类型对照
详情请参考这篇博文，[数据处理过程的数据类型](https://www.cnblogs.com/onemorepoint/p/9404753.html)

![数据类型.jpg](./images/6641583-cc104eae21ba2560.webp)

