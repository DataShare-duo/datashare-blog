---
title: Python 常用语句汇总
slug: Python数据处理/Python常用语句汇总
published: 2019-12-18
description: Python 常用语句
image: /python.jpg
showCoverInPost: false
tags: [python]
category: Python/Python数据处理
draft: false
---

# 背景
**平时用时知道有相应的设置及相应的原理，具体设置时又不好查找，现特此整理出来供大家收藏**

*可左右滑动查看代码*
# Anaconda
```
pip list
#或者
conda list
#其中，pip list 只能查看库，而 conda list 则可以查看库以及库的版本


pip install scipy
pip install scipy --upgrade
# 或者
conda install scipy
conda update scipy

# 更新所有库
conda update --all

# 更新 conda 自身
conda update conda

# 更新 anaconda 自身
conda update anaconda
```
# jupyter
```
#显示所有列
pd.set_option('display.max_columns', None)

#显示所有行
pd.set_option('display.max_rows', None)

#设置value的显示长度为100，默认为50
pd.set_option('max_colwidth',100)

#内嵌画图
%matplotlib inline

#单独画图
%matplotlib qt

#画图中文乱码、负号
plt.rcParams['font.sans-serif']=['Microsoft YaHei']
plt.rcParams['axes.unicode_minus']=False

#linux指定字体
from matplotlib.font_manager import FontProperties
zhfont = FontProperties(fname="/home/public/font/SimHei.ttf", size=14) 
plt.xlabel('日期',fontproperties = zhfont,fontsize=14)
plt.xticks(fontproperties=zhfont)

#让一个cell同时有多个输出print
from IPython.core.interactiveshell import InteractiveShell
InteractiveShell.ast_node_interactivity = "all" 
```
# 主要的数据分析包
```
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.figure import SubplotParams  
#我们使用SubplotParams 调整了子图的竖直间距
#plt.figure(figsize=(12, 6), dpi=200, subplotpars=SubplotParams(hspace=0.3))

import scipy.stats as stats
import seaborn as sns
import statsmodels.api as sm
```
# Sklearn
```
from sklearn import datasets    #本地数据
from sklearn.model_selection import train_test_split    #进行数据分割

from sklearn.feature_extraction import DictVectorizer  #特征抽取和向量化
from sklearn.preprocessing import PolynomialFeatures   #多项式特征构造

from sklearn.feature_selection import VarianceThreshold  #基于方差特征选择
from sklearn.feature_selection import SelectKBest,SelectPercentile  #特征选择
#For classification: chi2, f_classif, mutual_info_classif
#For regression: f_regression, mutual_info_regression
from sklearn.feature_selection import RFE   #递归特征消除 (Recursive Feature Elimination)
from sklearn.feature_selection import SelectFromModel   #基于模型选择特征

from sklearn.decomposition import PCA  #主成分分析
from sklearn.manifold import MDS  #多维尺度分析
from sklearn.manifold import TSNE  #T分布和随机近邻嵌入

from sklearn.pipeline import Pipeline       #管道
from sklearn import metrics      #模型评估
from sklearn.model_selection import GridSearchCV  #网格搜索交叉验证
from sklearn.model_selection import KFold  #K折交叉验证
from sklearn.model_selection import cross_val_score  #交叉验证

from sklearn.linear_model import LinearRegression	#线性回归

from sklearn.linear_model import LogisticRegression  #逻辑回归

from sklearn import svm    #支持向量机

from sklearn.tree import DecisionTreeClassifier  #决策树
from sklearn.ensemble import RandomForestClassifier  #随机森林
from sklearn.ensemble import GradientBoostingClassifier  #梯度提升树

from sklearn.naive_bayes import MultinomialNB  #多项式朴素贝叶斯
from sklearn.naive_bayes import BernoulliNB  #伯努利朴素贝叶斯
from sklearn.naive_bayes import GaussianNB  #高斯朴素贝叶斯

from sklearn.neighbors import KNeighborsClassifier  #k紧邻

from sklearn.cluster import KMeans   #k均值聚类
from sklearn.cluster import DBSCAN  #基于密度的空间聚类
from sklearn.cluster import SpectralClustering  #谱聚类
from sklearn.cluster import Birch  #层次聚类

from sklearn.externals import joblib  #保存模型
```

# pycharm脚本模板
```python
"""
===========================
@File  : ${NAME}
@Author: DataShare
@Date  : ${DATE} ${TIME}
===========================
"""
```
