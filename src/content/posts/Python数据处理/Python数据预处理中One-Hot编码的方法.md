---
title: Python 数据预处理中 One-Hot 编码的方法
slug: Python数据处理/Python数据预处理中One-Hot编码的方法
published: 2020-05-30
description: Python One-Hot编码
image: /python.jpg
showCoverInPost: false
tags: [python, 特征工程]
category: Python/Python数据处理
draft: false
---


# 背景
在进行数据建模时（有时也叫训练模型），我们需要先经过数据清洗、特征选择与特征构造等预处理步骤，然后构造一个模型进行训练，其中One-Hot编码属于数据清洗步骤里面。

# One-Hot意义
在进行特征处理时，分类数据和顺序数据这种字符型变量，无法直接用于计算，那么就需要进行数值化处理。

其中分类数据，比如一个特征包含红（R），绿（G），蓝（B）3个分类，那么怎么给这3个分类进行数值化处理呢，可以直接用1,2,3来表示吗?

**肯定不行，如果用1,2,3表示，那么3种颜色之间就会产生等级差异，本来他们之间应该是平等的**，这时就需要进行one-hot编码（哑变量），如下图所示的转换
![one-hot](./images/6641583-f59372eab9db16ce.webp)

# 实操数据
利用西瓜数据集（部分特征）为例进行实操，这个数据在网上都可下载到
![西瓜数据集](./images/6641583-802d00130db8653b.webp)
读取西瓜数据到数据框里面
```python
import pandas as pd

data = pd.read_excel('西瓜数据集.xlsx', sheet_name='西瓜')

data.head()
```
![读取西瓜数据](./images/6641583-40756cb1636646c9.webp)


# 常用方法
- **pandas里面的get_dummies方法**

这个方法是最简单，最直接的方法

```python
#也可以用concat,join
data_onehot=data.merge(pd.get_dummies(data,columns=['色泽','触感']),on='编号')    

data_onehot.head()
```
![pd.get_dummies](./images/6641583-76ae828a0a2a0669.webp)
- **sklearn里面的One-HotEncoder方法**

利用One-HotEncoder进行转换

```python
from sklearn.preprocessing import OneHotEncoder

one_hot=OneHotEncoder()

data_temp=pd.DataFrame(one_hot.fit_transform(data[['色泽','触感']]).toarray(),
             columns=one_hot.get_feature_names(['色泽','触感']),dtype='int32')
data_onehot=pd.concat((data,data_temp),axis=1)    #也可以用merge,join

data_onehot.head()
```
![OneHotEncoder](./images/6641583-21f709c3a6da15b1.webp)

- **自定义函数方法**
```python
def OneHot(df,columns):
    df_new=df.copy()
    for column in columns:
        value_sets=df_new[column].unique()
        for value_unique in value_sets:
            col_name_new=column+'_'+value_unique
            df_new[col_name_new]=(df_new[column]==value_unique)
            df_new[col_name_new]=df_new[col_name_new].astype('int32')
    return df_new

data_onehot_def=OneHot(data,columns=['色泽','触感'])

data_onehot_def.head()
```
![OneHot_def](./images/6641583-834bbbd8c224a05c.webp)

# 历史相关文章
- **[Python pandas 里面的数据类型坑，astype要慎用]()**
- **[Pandas数据处理误区要知其然知其所以然]()**
- **[Python pandas 数据筛选与赋值升级版详解]()**
- **[历史双色球数据分析---python]()**

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**

