---
title: polars学习-09_数据框关联与拼接
slug: polars-学习/Python_polars学习-09_数据框关联与拼接
published: 2024-07-23
description: Polars 数据框关联与拼接（Join 、Concat）
image: ./polars.svg
tags: [python, polars]
category: Polars-学习
draft: false
---

# 背景
polars学习系列文章，第9篇 数据框关联与拼接（Join 、Concat）

该系列文章会分享到github，大家可以去下载jupyter文件，进行参考学习

仓库地址：[https://github.com/DataShare-duo/polars_learn](https://github.com/DataShare-duo/polars_learn)

# 小编运行环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.9

import polars as pl

print("polars 版本：",pl.__version__)
#polars 版本： 1.2.1
```

# 数据框关联 Join
`polars` 通过指定参数 `how`，支持以下方式的关联：
- **inner**：类似sql中的 inner join,取2个数据框共同的部分
- **left**：类似sql中的 left join,取左边数据框所有数据，匹配右边数据框数据，能匹配到的进行匹配，匹配不到的用 `null` 填充
- **full**：类似sql中的 full outer join，返回2个数据框的全量数据，匹配不到的用 `null` 填充
- **cross**：2个数据框的笛卡尔积，数据行数为，`len(A) × len(B)`
- **semi**：用的相对比较少，左边数据框中关联字段同时存在右边数据框中，只返回左边数据框的行，有点类似 `inner join`,但是不全完一样，即使右边数据框有多行的，左边返回的还是单行，也就是遇到关联字段存在于右边数据框，就返回
- **anti**：用的相对比较少，返回左边数据框中关联字段不存在右边数据框中的行，与 `semi` 相反

## 数据准备
```python
df_customers = pl.DataFrame(
    {
        "customer_id": [1, 2, 3],
        "name": ["Alice", "Bob", "Charlie"],
    }
)

print(df_customers)
#shape: (3, 2)
┌─────────────┬─────────┐
│ customer_id ┆ name    │
│ ---         ┆ ---     │
│ i64         ┆ str     │
╞═════════════╪═════════╡
│ 1           ┆ Alice   │
│ 2           ┆ Bob     │
│ 3           ┆ Charlie │
└─────────────┴─────────┘

df_orders = pl.DataFrame(
    {
        "order_id": ["a", "b", "c"],
        "customer_id": [1, 2, 2],
        "amount": [100, 200, 300],
    }
)

print(df_orders)
#shape: (3, 3)
┌──────────┬─────────────┬────────┐
│ order_id ┆ customer_id ┆ amount │
│ ---      ┆ ---         ┆ ---    │
│ str      ┆ i64         ┆ i64    │
╞══════════╪═════════════╪════════╡
│ a        ┆ 1           ┆ 100    │
│ b        ┆ 2           ┆ 200    │
│ c        ┆ 2           ┆ 300    │
└──────────┴─────────────┴────────┘
```
## Inner join
```python
df_inner_customer_join = df_customers.join(df_orders, 
                                           on="customer_id", 
                                           how="inner")

print(df_inner_customer_join)
#shape: (3, 4)
┌─────────────┬───────┬──────────┬────────┐
│ customer_id ┆ name  ┆ order_id ┆ amount │
│ ---         ┆ ---   ┆ ---      ┆ ---    │
│ i64         ┆ str   ┆ str      ┆ i64    │
╞═════════════╪═══════╪══════════╪════════╡
│ 1           ┆ Alice ┆ a        ┆ 100    │
│ 2           ┆ Bob   ┆ b        ┆ 200    │
│ 2           ┆ Bob   ┆ c        ┆ 300    │
└─────────────┴───────┴──────────┴────────┘
```
## Left join
```python
df_left_join = df_customers.join(df_orders, 
                                 on="customer_id", 
                                 how="left")

print(df_left_join)
#shape: (4, 4)
┌─────────────┬─────────┬──────────┬────────┐
│ customer_id ┆ name    ┆ order_id ┆ amount │
│ ---         ┆ ---     ┆ ---      ┆ ---    │
│ i64         ┆ str     ┆ str      ┆ i64    │
╞═════════════╪═════════╪══════════╪════════╡
│ 1           ┆ Alice   ┆ a        ┆ 100    │
│ 2           ┆ Bob     ┆ b        ┆ 200    │
│ 2           ┆ Bob     ┆ c        ┆ 300    │
│ 3           ┆ Charlie ┆ null     ┆ null   │
└─────────────┴─────────┴──────────┴────────┘
```
## Outer join
```python
df_outer_join = df_customers.join(df_orders, 
                                  on="customer_id", 
                                  how="full")

print(df_outer_join)
#shape: (4, 5)
┌─────────────┬─────────┬──────────┬───────────────────┬────────┐
│ customer_id ┆ name    ┆ order_id ┆ customer_id_right ┆ amount │
│ ---         ┆ ---     ┆ ---      ┆ ---               ┆ ---    │
│ i64         ┆ str     ┆ str      ┆ i64               ┆ i64    │
╞═════════════╪═════════╪══════════╪═══════════════════╪════════╡
│ 1           ┆ Alice   ┆ a        ┆ 1                 ┆ 100    │
│ 2           ┆ Bob     ┆ b        ┆ 2                 ┆ 200    │
│ 2           ┆ Bob     ┆ c        ┆ 2                 ┆ 300    │
│ 3           ┆ Charlie ┆ null     ┆ null              ┆ null   │
└─────────────┴─────────┴──────────┴───────────────────┴────────┘
```
## Cross join
```python
df_colors = pl.DataFrame(
    {
        "color": ["red", "blue", "green"],
    }
)
print(df_colors)
#shape: (3, 1)
┌───────┐
│ color │
│ ---   │
│ str   │
╞═══════╡
│ red   │
│ blue  │
│ green │
└───────┘

df_sizes = pl.DataFrame(
    {
        "size": ["S", "M", "L"],
    }
)
#print(df_sizes)

df_cross_join = df_colors.join(df_sizes, 
                               how="cross")

print(df_cross_join)
#shape: (9, 2)
┌───────┬──────┐
│ color ┆ size │
│ ---   ┆ ---  │
│ str   ┆ str  │
╞═══════╪══════╡
│ red   ┆ S    │
│ red   ┆ M    │
│ red   ┆ L    │
│ blue  ┆ S    │
│ blue  ┆ M    │
│ blue  ┆ L    │
│ green ┆ S    │
│ green ┆ M    │
│ green ┆ L    │
└───────┴──────┘
```
## Semi join
```python
df_cars = pl.DataFrame(
    {
        "id": ["a", "b", "c"],
        "make": ["ford", "toyota", "bmw"],
    }
)
print(df_cars)
shape: (3, 2)
┌─────┬────────┐
│ id  ┆ make   │
│ --- ┆ ---    │
│ str ┆ str    │
╞═════╪════════╡
│ a   ┆ ford   │
│ b   ┆ toyota │
│ c   ┆ bmw    │
└─────┴────────┘

df_repairs = pl.DataFrame(
    {
        "id": ["c", "c"],
        "cost": [100, 200],
    }
)
print(df_repairs)
#shape: (2, 2)
┌─────┬──────┐
│ id  ┆ cost │
│ --- ┆ ---  │
│ str ┆ i64  │
╞═════╪══════╡
│ c   ┆ 100  │
│ c   ┆ 200  │
└─────┴──────┘

df_semi_join = df_cars.join(df_repairs, 
                            on="id", 
                            how="semi")
print(df_semi_join)
#shape: (1, 2)
┌─────┬──────┐
│ id  ┆ make │
│ --- ┆ ---  │
│ str ┆ str  │
╞═════╪══════╡
│ c   ┆ bmw  │
└─────┴──────┘
```
## Anti join
```python
df_anti_join = df_cars.join(df_repairs, 
                            on="id", 
                            how="anti")

print(df_anti_join)
#shape: (2, 2)
┌─────┬────────┐
│ id  ┆ make   │
│ --- ┆ ---    │
│ str ┆ str    │
╞═════╪════════╡
│ a   ┆ ford   │
│ b   ┆ toyota │
└─────┴────────┘
```
# 数据框拼接 Concat
有以下3种方式的数据框拼接：
- 纵向拼接/垂直拼接：2个数据框有相同的字段，拼接后产生更长的数据框
- 横向拼接/水平拼接：2个数据框没有重叠的字段，拼接后产生更宽的数据框
- 对角拼接：2个数据框有不同的行与列，既有重叠的字段，也有非重叠的字段，拼接后产生即长又宽的数据框
## 纵向拼接/垂直拼接 Vertical concatenation
当没有相同的列字段时，纵向拼接会失败
```python
df_v1 = pl.DataFrame(
    {
        "a": [1],
        "b": [3],
    }
)
df_v2 = pl.DataFrame(
    {
        "a": [2],
        "b": [4],
    }
)
df_vertical_concat = pl.concat(
    [
        df_v1,
        df_v2,
    ],
    how="vertical",
)
print(df_vertical_concat)
#shape: (2, 2)
┌─────┬─────┐
│ a   ┆ b   │
│ --- ┆ --- │
│ i64 ┆ i64 │
╞═════╪═════╡
│ 1   ┆ 3   │
│ 2   ┆ 4   │
└─────┴─────┘
```
## 横向拼接/水平拼接 Horizontal concatenation
当2个数据框有不同的行数时，拼接后短的行会用 `null` 进行填充
```python
df_h1 = pl.DataFrame(
    {
        "l1": [1, 2],
        "l2": [3, 4],
    }
)
df_h2 = pl.DataFrame(
    {
        "r1": [5, 6],
        "r2": [7, 8],
        "r3": [9, 10],
    }
)
df_horizontal_concat = pl.concat(
    [
        df_h1,
        df_h2,
    ],
    how="horizontal",
)
print(df_horizontal_concat)
#shape: (2, 5)
┌─────┬─────┬─────┬─────┬─────┐
│ l1  ┆ l2  ┆ r1  ┆ r2  ┆ r3  │
│ --- ┆ --- ┆ --- ┆ --- ┆ --- │
│ i64 ┆ i64 ┆ i64 ┆ i64 ┆ i64 │
╞═════╪═════╪═════╪═════╪═════╡
│ 1   ┆ 3   ┆ 5   ┆ 7   ┆ 9   │
│ 2   ┆ 4   ┆ 6   ┆ 8   ┆ 10  │
└─────┴─────┴─────┴─────┴─────┘
```
## 对角拼接 Diagonal concatenation
```python
df_d1 = pl.DataFrame(
    {
        "a": [1],
        "b": [3],
    }
)
df_d2 = pl.DataFrame(
    {
        "a": [2],
        "d": [4],
    }
)

df_diagonal_concat = pl.concat(
    [
        df_d1,
        df_d2,
    ],
    how="diagonal",
)
print(df_diagonal_concat)
#shape: (2, 3)
┌─────┬──────┬──────┐
│ a   ┆ b    ┆ d    │
│ --- ┆ ---  ┆ ---  │
│ i64 ┆ i64  ┆ i64  │
╞═════╪══════╪══════╡
│ 1   ┆ 3    ┆ null │
│ 2   ┆ null ┆ 4    │
└─────┴──────┴──────┘
```
# 历史相关文章
- [Python polars学习-01 读取与写入文件](./Python_polars学习-01_读取与写入文件.md)
- [Python polars学习-02 上下文与表达式](./Python_polars学习-02_上下文与表达式.md)
- [Python polars学习-03 数据类型转换](./Python_polars学习-03_数据类型转换.md)
- [Python polars学习-04 字符串数据处理](./Python_polars学习-04_字符串数据处理.md)
- [Python polars学习-05 包含的数据结构](./Python_polars学习-05_包含的数据结构.md)
- [Python polars学习-06 Lazy / Eager API](./Python_polars学习-06_Lazy-Eager-API.md)
- [Python polars学习-07 缺失值](./Python_polars学习-07_缺失值.md)
- [Python polars学习-08 分类数据处理](./Python_polars学习-08_分类数据处理.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
