---
title: polars学习-04_字符串数据处理
slug: polars-学习/Python_polars学习-04_字符串数据处理
published: 2024-05-23
description: Polars 字符串数据处理
image: ./polars.svg
tags: [python, polars]
category: Python/Polars-学习
draft: false
---

# 背景
polars学习系列文章，第4篇 字符串数据处理 <br/>
该系列文章会分享到github，大家可以去下载jupyter文件，进行参考学习

仓库地址：[https://github.com/DataShare-duo/polars_learn](https://github.com/DataShare-duo/polars_learn)

# 小编运行环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.9

import polars as pl

print("polars 版本：",pl.__version__)
#polars 版本： 0.20.22
```
# 字符串长度
可以获取字符串中的字符数或者字节数
```python
df = pl.DataFrame({"animal": ["Crab", "cat and dog", "rab$bit", '张',None]})

out = df.select(
    pl.col("animal").str.len_bytes().alias("byte_count"),  #字节数
    pl.col("animal").str.len_chars().alias("letter_count"),  #字符串数
)
print(out)

shape: (5, 2)
┌────────────┬──────────────┐
│ byte_count ┆ letter_count │
│ ---        ┆ ---          │
│ u32        ┆ u32          │
╞════════════╪══════════════╡
│ 4          ┆ 4            │
│ 11         ┆ 11           │
│ 7          ┆ 7            │
│ 3          ┆ 1            │
│ null       ┆ null         │
└────────────┴──────────────┘
```
# 判断是否包含特定字符串或正则字符串
- contains：包含指定的字符串，或正则表达式字符串，返回ture/false
- starts_with：判断是否以指定的字符串开头，返回ture/false
- ends_with：判断是否以指定的字符串结尾，返回ture/false

如果包含了特殊的字符，但又不是正则表达式，需要设置参数`literal=True`,`literal`默认是 `False`,代表字符是正则表达式字符串
```python
out = df.select(
    pl.col("animal"),
    pl.col("animal").str.contains("cat|bit").alias("regex"),
    pl.col("animal").str.contains("rab$", literal=True).alias("literal"),  #匹配$原始字符
    pl.col("animal").str.contains("rab$").alias("regex_pattern"),
    pl.col("animal").str.starts_with("rab").alias("starts_with"),
    pl.col("animal").str.ends_with("dog").alias("ends_with"),
)
print(out)

shape: (5, 6)
┌─────────────┬───────┬─────────┬───────────────┬─────────────┬───────────┐
│ animal      ┆ regex ┆ literal ┆ regex_pattern ┆ starts_with ┆ ends_with │
│ ---         ┆ ---   ┆ ---     ┆ ---           ┆ ---         ┆ ---       │
│ str         ┆ bool  ┆ bool    ┆ bool          ┆ bool        ┆ bool      │
╞═════════════╪═══════╪═════════╪═══════════════╪═════════════╪═══════════╡
│ Crab        ┆ false ┆ false   ┆ true          ┆ false       ┆ false     │
│ cat and dog ┆ true  ┆ false   ┆ false         ┆ false       ┆ true      │
│ rab$bit     ┆ true  ┆ true    ┆ false         ┆ true        ┆ false     │
│ 张          ┆ false ┆ false   ┆ false         ┆ false       ┆ false     │
│ null        ┆ null  ┆ null    ┆ null          ┆ null        ┆ null      │
└─────────────┴───────┴─────────┴───────────────┴─────────────┴───────────┘
```

正则表达式的各种标识，需要写到字符串开始，用括号括起来，`(?iLmsuxU)`
```python
out=pl.DataFrame({"s": ["AAA", "aAa", "aaa"]}).with_columns(
    default_match=pl.col("s").str.contains("AA"),
    insensitive_match=pl.col("s").str.contains("(?i)AA")  #忽略大小写
)

print(out)

shape: (3, 3)
┌─────┬───────────────┬───────────────────┐
│ s   ┆ default_match ┆ insensitive_match │
│ --- ┆ ---           ┆ ---               │
│ str ┆ bool          ┆ bool              │
╞═════╪═══════════════╪═══════════════════╡
│ AAA ┆ true          ┆ true              │
│ aAa ┆ false         ┆ true              │
│ aaa ┆ false         ┆ true              │
└─────┴───────────────┴───────────────────┘
```
# 根据正则表达式提取特定字符
使用`extract`方法，根据提供的正则表达式模式，进行提取匹配到的字符串,需要提供想要获取的组索引 `group_index`，默认是第1个
```python
df = pl.DataFrame(
    {
        "a": [
            "http://vote.com/ballon_dor?candidate=messi&ref=polars",
            "http://vote.com/ballon_dor?candidat=jorginho&ref=polars",
            "http://vote.com/ballon_dor?candidate=ronaldo&ref=polars",
        ]
    }
)
out = df.select(
    a1=pl.col("a").str.extract(r"candidate=(\w+)", group_index=1),
    a2=pl.col("a").str.extract(r"candidate=(\w+)", group_index=0),
    a3=pl.col("a").str.extract(r"candidate=(\w+)")  #默认获取第1个
)
print(out)

shape: (3, 3)
┌─────────┬───────────────────┬─────────┐
│ a1      ┆ a2                ┆ a3      │
│ ---     ┆ ---               ┆ ---     │
│ str     ┆ str               ┆ str     │
╞═════════╪═══════════════════╪═════════╡
│ messi   ┆ candidate=messi   ┆ messi   │
│ null    ┆ null              ┆ null    │
│ ronaldo ┆ candidate=ronaldo ┆ ronaldo │
└─────────┴───────────────────┴─────────┘
```
如果想获取所有正则表达式匹配到的字符串，需要使用 `extract_all` 方法，结果是一个列表
```python
df = pl.DataFrame({"foo": ["123 bla 45 asd", "xyz 678 910t"]})
out = df.select(
    pl.col("foo").str.extract_all(r"(\d+)").alias("extracted_nrs"),
)
print(out)

shape: (2, 1)
┌────────────────┐
│ extracted_nrs  │
│ ---            │
│ list[str]      │
╞════════════════╡
│ ["123", "45"]  │
│ ["678", "910"] │
└────────────────┘
```

# 字符串替换
- replace：替换第一次匹配到的字符串，为新的字符串
- replace_all：替换所有匹配到的字符串，为新的字符串
```python
df = pl.DataFrame({"id": [1, 2], "text": ["abc123abc", "abc456"]})
out = df.with_columns(
    s1=pl.col("text").str.replace(r"abc\b", "ABC"), #\b 字符串结束位置，以 abc 出现在字符串结尾处
    s2=pl.col("text").str.replace("a", "-"), #只替换第一次出现的 a
    s3=pl.col("text").str.replace_all("a", "-", literal=True) #替换所有的 a
)
print(out)

shape: (2, 5)
┌─────┬───────────┬───────────┬───────────┬───────────┐
│ id  ┆ text      ┆ s1        ┆ s2        ┆ s3        │
│ --- ┆ ---       ┆ ---       ┆ ---       ┆ ---       │
│ i64 ┆ str       ┆ str       ┆ str       ┆ str       │
╞═════╪═══════════╪═══════════╪═══════════╪═══════════╡
│ 1   ┆ abc123abc ┆ abc123ABC ┆ -bc123abc ┆ -bc123-bc │
│ 2   ┆ abc456    ┆ abc456    ┆ -bc456    ┆ -bc456    │
└─────┴───────────┴───────────┴───────────┴───────────┘
```
# 历史相关文章
- [Python polars学习-01 读取与写入文件](./Python_polars学习-01_读取与写入文件.md)
- [Python polars学习-02 上下文与表达式](./Python_polars学习-02_上下文与表达式.md)
- [Python polars学习-03 数据类型转换](./Python_polars学习-03_数据类型转换.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
