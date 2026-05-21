---
title: Python 项目管理新思路：用 uv Workspace 共享虚拟环境，省时省空间！
slug: Python基础库/Python-项目管理新思路：用-uv-Workspace-共享虚拟环境，省时省空间！
published: 2025-07-29
description: Python uv项目管理
image: ./python.jpg
showCoverInPost: false
tags: [python, uv]
category: Python/Python基础库
draft: false
---


# 背景
上手 **`uv`** 一段时间后，真心觉得这款工具让 Python 项目管理变得省心不少！它不仅操作便捷，安装第三方包的速度更是快得飞起。

不过，在使用过程中也发现了一个小痛点：**`uv`** 默认会为每个项目创建独立的虚拟环境。这意味着，如果你同时开发多个项目，即使它们依赖相同的第三方包（比如常用的 **`requests`**、**`pandas`**），这些包也需要在每个项目的虚拟环境中**重复安装**。久而久之，宝贵的磁盘空间就这样被悄悄占用了不少。

难道只能忍受这种“甜蜜的负担”吗？当然不是！仔细翻阅 **`uv`** 的文档后发现，它其实贴心地提供了**工作空间（Workspace）**功能！通过工作空间，你可以让**多个项目共享同一个虚拟环境**。这样一来，公共依赖包只需安装一次，所有关联项目都能顺畅使用，**大幅减少了重复安装带来的空间浪费**，管理效率再上一个台阶！

在尝试获取 **`uv` 工作空间（Workspace）** 功能的相关信息时，小编注意到 DeepSeek 模型提供的回答有时存在**不准确或偏离主题**的情况。

这表明，**`uv`** 这一相对较新的功能细节，**可能尚未被充分纳入 DeepSeek 当前模型版本的训练数据**。这一现象也提醒我们，即使是强大的 AI 模型，**其知识覆盖和能力也存在一定的边界与时效性局限**

# 小编环境
```python
import sys

print('python 版本：',sys.version.split('|')[0])
#python 版本： 3.11.11
```

```
uv self version
# uv 0.8.2 (21fadbcc1 2025-07-22)
```
# 工作空间示例
1. 创建根项目，并添加一个三方包 `pandas`
在根项目的文件夹里面生成一个虚拟环境 `.venv` ，`pandas`被安装在该文件夹内

```bash
uv init workspace_project  -p 3.11
cd workspace_project
uv add pandas
uv tree
```
```text
workspace-project v0.1.0
└── pandas v2.3.1
    ├── numpy v2.3.1
    ├── python-dateutil v2.9.0.post0
    │   └── six v1.17.0
    ├── pytz v2025.2
    └── tzdata v2025.2
```
2. 创建子项目1，并添加一个三方包 `fastapi`
在子项目中添加的包，会被安装到根项目的虚拟环境`.venv`中
```bash
pwd  # D:\桌面\Python\uv\workspace_project
uv init sub_project1  # 创建子项目1
cd sub_project1  
uv add fastapi
uv tree
```
```text
workspace-project v0.1.0
└── pandas v2.3.1
    ├── numpy v2.3.1
    ├── python-dateutil v2.9.0.post0
    │   └── six v1.17.0
    ├── pytz v2025.2
    └── tzdata v2025.2
sub-project1 v0.1.0
└── fastapi v0.116.1
    ├── pydantic v2.11.7
    │   ├── annotated-types v0.7.0
    │   ├── pydantic-core v2.33.2
    │   │   └── typing-extensions v4.14.1
    │   ├── typing-extensions v4.14.1
    │   └── typing-inspection v0.4.1
    │       └── typing-extensions v4.14.1
    ├── starlette v0.47.2
    │   ├── anyio v4.9.0
    │   │   ├── idna v3.10
    │   │   ├── sniffio v1.3.1
    │   │   └── typing-extensions v4.14.1
    │   └── typing-extensions v4.14.1
    └── typing-extensions v4.14.1
```


3. 创建子项目2，并添加一个三方包 `requests`
```bash
pwd  # D:\桌面\Python\uv\workspace_project
uv init sub_project2  # 创建子项目1
cd sub_project2  
uv add requests
uv tree
```
```text
workspace-project v0.1.0
└── pandas v2.3.1
    ├── numpy v2.3.1
    ├── python-dateutil v2.9.0.post0
    │   └── six v1.17.0
    ├── pytz v2025.2
    └── tzdata v2025.2
sub-project2 v0.1.0
└── requests v2.32.4
    ├── certifi v2025.7.14
    ├── charset-normalizer v3.4.2
    ├── idna v3.10
    └── urllib3 v2.5.0
sub-project1 v0.1.0
└── fastapi v0.116.1
    ├── pydantic v2.11.7
    │   ├── annotated-types v0.7.0
    │   ├── pydantic-core v2.33.2
    │   │   └── typing-extensions v4.14.1
    │   ├── typing-extensions v4.14.1
    │   └── typing-inspection v0.4.1
    │       └── typing-extensions v4.14.1
    ├── starlette v0.47.2
    │   ├── anyio v4.9.0
    │   │   ├── idna v3.10
    │   │   ├── sniffio v1.3.1
    │   │   └── typing-extensions v4.14.1
    │   └── typing-extensions v4.14.1
    └── typing-extensions v4.14.1
```

所有的三方包都安装在根项目的虚拟环境内，`path\workspace_project\.venv\Lib\site-packages`，这样公共依赖包只需安装一次

以上的操作，其实是 `uv` 自动在根项目的配置文件 `pyproject.toml` 中，增加了如下配置，这样 `uv` 才识别所有项目同属于一个工作空间
```toml
[tool.uv.workspace]
members = [
    "sub_project1",
    "sub_project2",
]
```

4. 在子项目2中使用同工作空间其它项目安装的包
```python
import pandas as pd 
import fastapi

def main():
    print("Hello from sub-project2!")


if __name__ == "__main__":
    main()
    print('pandas版本：',pd.__version__)
    print('fastapi版本：',fastapi.__version__)
```
运行：
```
pwd  # D:\桌面\Python\uv\workspace_project\sub_project2
uv run .\main.py
# Hello from sub-project2!
# pandas版本： 2.3.1
# fastapi版本： 0.116.1
```

# 历史相关文章
- [Python-新晋包项目工具uv的简单尝试](/Python基础库/Python-新晋包项目工具uv的简单尝试.md)
- [Python-在指定文件夹安装三方库，并进行加载使用](/Python基础库/Python-在指定文件夹安装三方库，并进行加载使用.md)
- [Rust-是否会重写-Python-解释器与有关的库，替代-C-语言地位？](/Python基础库/Rust-是否会重写-Python-解释器与有关的库，替代-C-语言地位？.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
