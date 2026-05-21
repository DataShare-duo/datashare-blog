---
title: Python 标准库之pathlib（二），路径操作
slug: Python基础库/Python-标准库之pathlib（二），路径操作
published: 2025-10-15
description: Python pathlib基础库
image: ./python.jpg
showCoverInPost: false
tags: [python, 基础库]
category: Python/Python基础库
draft: false
---


# 背景
小编之前写过一篇介绍 `pathlib` 标准库的文章，最近在做项目时，又发现其有一个更好用的功能，分享给大家，供大家参考学习

# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.11
```
# 创建目录方法：Path.mkdir()
`pathlib.Path.mkdir()` 方法是 Python 中创建目录的核心方法，提供了灵活且安全的目录创建功能

### 方法签名：
```python
Path.mkdir(mode=0o777, parents=False, exist_ok=False)
```
### 参数详解：
**1. `mode` (可选)**
- **作用:** 设置目录权限（Unix/Linux/Mac 系统有效）
- **默认值:** 0o777 (八进制，表示最大权限)
- **注意:** 在 Windows 上此参数被忽略

**常用权限值:**
```python
from pathlib import Path

# 创建用户可读/写/执行，组和其他用户只读/执行的目录
Path("my_dir").mkdir(mode=0o755)  # drwxr-xr-x

# 创建只有用户可读/写/执行的目录  
Path("private_dir").mkdir(mode=0o700)  # drwx------
```

**2. `parents` (可选)**
- **作用:** 是否自动创建父目录
- **默认值:** `False`
- **当 `False` 时:** 父目录必须存在，否则抛出 `FileNotFoundError`
- **当 `True` 时:** 自动创建所有不存在的父目录

**3. `exist_ok` (可选)**
- **作用:** 目录已存在时的处理方式
- **默认值:** `False`
- **当 `False` 时:** 目录已存在会抛出 `FileExistsError`
- **当 `True` 时:** 目录已存在不会报错

# 基础用法示例

### 示例 1: 创建单级目录
```python
from pathlib import Path

# 在当前目录下创建新文件夹
Path("new_folder").mkdir()

# 创建指定路径的目录
Path("/tmp/example").mkdir()
```

### 示例 2: 创建多级目录（使用 `parents=True`）
```python
from pathlib import Path

# 传统方式 - 需要逐级检查创建
# 这里演示只判断父目录是否存在
path = Path("a/b/c/d/e")
if not path.parent.exists():
    path.parent.mkdir()
path.mkdir()

# 简化方式 - 一次性创建所有层级
Path("a/b/c/d/e").mkdir(parents=True)
```

### 示例 3: 安全创建目录（使用 `exist_ok=True`）
```python
from pathlib import Path

# 安全创建 - 目录存在也不报错
Path("my_project").mkdir(exist_ok=True)

# 等同于检查是否存在再创建
path = Path("my_project")
if not path.exists():
    path.mkdir()
```


# 历史相关文章
- [Python-标准库之pathlib，路径操作](/Python基础库/Python-标准库之pathlib，路径操作.md)
- [Python-collections详解：解锁高效数据结构](/Python基础库/Python-collections详解：解锁高效数据结构.md)
- [Python利用partial偏函数，生成不同的聚合函数](/Python基础库/Python利用partial偏函数，生成不同的聚合函数.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
