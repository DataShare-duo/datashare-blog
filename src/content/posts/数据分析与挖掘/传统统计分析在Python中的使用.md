---
title: 传统统计分析在Python中的使用
slug: 数据分析与挖掘/传统统计分析在Python中的使用
published: 2020-01-15
description: Python 传统统计分析
image: /python.jpg
showCoverInPost: false
tags: [python, 数据分析]
category: Python/数据分析与挖掘
draft: false
---

# 背景
大家都知道现在大数据非常火爆，在大数据还没有出现时，用的都是“小数据”，这些“小数据”在分析时大部分用的都是Excel、SPSS等工具，直到现在把Excel运用的很熟练的人，仍然很受青睐。但是Python的到来，使处理大数据比较方便。那么之前在Excel、SPSS中的描述统计、假设检验在Python中怎么使用呢？下面将进行详细介绍，**前提是已经掌握numpy、pandas这两个库，并且对统计知识有所了解**

# 加载数据
这里引用的是GitHub上的一个CSV数据文件，insurance.csv 保险数据
，可以下载下来参考练习
网址：[https://github.com/stedy/Machine-Learning-with-R-datasets](https://github.com/stedy/Machine-Learning-with-R-datasets)

```python
>>> import numpy as np
>>> import pandas as pd
>>> data=pd.read_csv('F:/Machine-Learning datasets/insurance.csv')
>>> data
      age     sex     bmi  children smoker     region      charges
0      19  female  27.900         0    yes  southwest  16884.92400
1      18    male  33.770         1     no  southeast   1725.55230
2      28    male  33.000         3     no  southeast   4449.46200
3      33    male  22.705         0     no  northwest  21984.47061
4      32    male  28.880         0     no  northwest   3866.85520
...   ...     ...     ...       ...    ...        ...          ...
1333   50    male  30.970         3     no  northwest  10600.54830
1334   18  female  31.920         0     no  northeast   2205.98080
1335   18  female  36.850         0     no  southeast   1629.83350
1336   21  female  25.800         0     no  southwest   2007.94500
1337   61  female  29.070         0    yes  northwest  29141.36030

[1338 rows x 7 columns]
>>> data.isnull().sum()
age         0
sex         0
bmi         0
children    0
smoker      0
region      0
charges     0
dtype: int64
>>> data.dtypes
age           int64
sex          object
bmi         float64
children      int64
smoker       object
region       object
charges     float64
dtype: object
```
# 描述统计各指标
- #### 最大值、最小值
```python
>>> data['age'].max()
64
>>> data['age'].min()
18
```
- #### 均值
```python
>>> data['age'].mean()
39.20702541106129
```
- #### 方差
```python
>>> data['age'].std()
14.049960379216172
```
- #### 中位数
```
>>> data['age'].median()
39.0
```
- #### 众数

众数有时会有多个，这里是全部返回
```python
>>> data['age'].mode()
0    18
dtype: int64

>>> d=pd.DataFrame([1,1,1,2,2,2,3,4,4,4,5,5,6],columns=['a'])
>>> d['a'].mode()
0    1
1    2
2    4
dtype: int64
```
- #### 分位数
```python
>>> data['age'].quantile([0,0.25,0.5,0.75,1])
0.00    18.0
0.25    27.0
0.50    39.0
0.75    51.0
1.00    64.0
Name: age, dtype: float64
```
- #### 频数统计
```python
>>> data['region'].value_counts()
southeast    364
northwest    325
southwest    325
northeast    324
Name: region, dtype: int64
```
- #### 极差
```python
>>> data['age'].max()-data['age'].min()
46
```
- #### 四分位差
```python
>>> data['age'].quantile(0.75)-data['age'].quantile(0.25)
24.0
```
- #### 变异系数
```python
>>> data['age'].std()/data['age'].mean()
0.3583531326824994
```
# 假设检验
- #### 单样本t检验
```python
>>> data
      age     sex     bmi  children smoker     region      charges
0      19  female  27.900         0    yes  southwest  16884.92400
1      18    male  33.770         1     no  southeast   1725.55230
2      28    male  33.000         3     no  southeast   4449.46200
3      33    male  22.705         0     no  northwest  21984.47061
4      32    male  28.880         0     no  northwest   3866.85520
...   ...     ...     ...       ...    ...        ...          ...
1333   50    male  30.970         3     no  northwest  10600.54830
1334   18  female  31.920         0     no  northeast   2205.98080
1335   18  female  36.850         0     no  southeast   1629.83350
1336   21  female  25.800         0     no  southwest   2007.94500
1337   61  female  29.070         0    yes  northwest  29141.36030

[1338 rows x 7 columns]
>>> data['age'].mean()
39.20702541106129
>>> 
>>> import statsmodels.api as sm   #加载分析库
>>> t=sm.stats.DescrStatsW(data['age'])      #构造统计量对象
>>> t.ttest_mean(38)    #t检验，假设总体均值为38，返回t值、P值、自由度
(3.142457193279878, 0.0017121567548687802, 1337.0)
>>> t.ttest_mean(39)   #假设总体均值为39，p>0.05，接受原假设
(0.5389849179805168, 0.5899869939488361, 1337.0)
>>> t.ttest_mean(18)    #假设总体均值为18，p<0.05，小于0.05拒绝原假设
(55.21190269926711, 0.0, 1337.0)
```
- #### 双样本t检验
```python
>>> data.groupby('sex').mean()['charges']
sex
female    12569.578844
male      13956.751178
Name: charges, dtype: float64
>>> sex0=data[data['sex']=='female']['charges']
>>> sex1=data[data['sex']=='male']['charges']
>>> from scipy import stats
>>> leveneTestRes=stats.levene(sex0,sex1)  #方差齐性检验
>>> leveneTestRes   #p值<0.05，说明方差非齐性
LeveneResult(statistic=9.90925122305512, pvalue=0.0016808765833903443)
>>> stats.stats.ttest_ind(sex0,sex1,equal_var=False)   #双样本T检验
Ttest_indResult(statistic=-2.1008878232359565, pvalue=0.035841014956016645)
```
# 相关系数
```python
>>> data[['age','charges']].corr(method='pearson')   #皮尔逊相关系数
              age   charges
age      1.000000  0.299008
charges  0.299008  1.000000
>>> data[['age','charges']].corr(method='spearman')   #斯皮尔曼等级相关系数
              age   charges
age      1.000000  0.534392
charges  0.534392  1.000000
>>> data[['age','charges']].corr(method='kendall')   #肯德尔相关系数
              age   charges
age      1.000000  0.475302
charges  0.475302  1.000000
```

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**

