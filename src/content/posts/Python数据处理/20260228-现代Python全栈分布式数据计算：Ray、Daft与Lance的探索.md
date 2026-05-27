---
title: 现代Python全栈分布式数据计算：Ray、Daft与Lance的探索
slug: Python数据处理/20260228-现代Python全栈分布式数据计算：Ray、Daft与Lance的探索
published: 2026-02-28
description: Python 决策树原理
image: /python.jpg
showCoverInPost: false
tags: [python, 大数据]
category: Python/Python数据处理
draft: false
---


# 引言：AI时代的计算新范式

随着人工智能和大模型技术的飞速发展，数据处理的需求已经超越了传统ETL的范畴。现代AI工作流需要处理的不再仅仅是结构化表格数据，而是包含图像、视频、音频、文本向量的**多模态数据**。在这种背景下，一套基于Python原生体验、能够弹性扩展、且深度优化AI负载的分布式计算栈正在崛起

本文将深入探讨以**Ray**为分布式底层、**Daft**为分布式计算引擎、**Lance**为列式存储格式的现代Python全栈方案，并对比传统Hadoop+Spark生态，分析其优劣势


# 核心技术解析

## 1. Ray：通用的分布式调度内核

Ray起源于UC Berkeley RISELab，是一个用于构建和运行分布式应用的开源框架。它的设计目标是将分布式计算的复杂性隐藏起来，提供从单机到集群的无缝扩展体验 

**核心特性：**
- **统一的Python API**：通过`@ray.remote`装饰器，可以轻松将Python函数转化为分布式任务（Task）或将类转化为分布式Actor
- **动态任务图**：支持细粒度的、依赖复杂的任务调度，非常适合强化学习、模型训练等迭代式算法
- **生态丰富**：Ray不仅是一个内核，还构建了完整的AI生态库，包括用于数据加载的Ray Data、分布式训练的Ray Train、超参调优的Ray Tune、模型服务的Ray Serve以及强化学习库RLlib 
- **语言无关性**：虽然核心API是Python，但Ray架构支持跨语言，底层采用C++构建，保证高性能

在实际部署中，Ray集群由Head节点和若干Worker节点组成。Head节点负责全局调度和状态维护，Worker节点执行具体的计算任务 。开发者只需在代码中调用`ray.init()`，即可连接本地或远程集群，无需关心底层的节点通信和资源管理

![带有两个工作节点的 Ray 集群](./images/20260228-ray-cluster.svg)


## 2. Daft：原生多模态分布式计算引擎

Daft是一个新兴的分布式DataFrame引擎，专为AI场景下的多模态数据处理而设计。它采用Rust编写核心执行引擎，通过Python API提供类似Pandas的使用体验，但底层支持分布式执行

**核心特性：**
- **多模态原生支持**：Daft内置了`image`、`video`、`audio`、`embedding`等数据类型，可以直接在DataFrame中处理非结构化数据，并执行图像解码、向量相似度计算等操作，无需繁琐的序列化转换
- **Pipeline执行模型**：与Spark的批处理模型不同，Daft采用Pipeline执行模型（类似流式计算），数据在算子间以微批（micro-batch）形式流动，降低了延迟，提高了CPU/GPU利用率 
- **异构资源调度**：Daft可以根据算子类型（如图像解码用CPU，Embedding用GPU）自动将任务调度到合适的硬件上，实现同一工作流中CPU与GPU的无缝协作 
- **基于Ray的分布式执行**：Daft的分布式版本名为Flotilla，它构建在Ray之上。每个Ray Worker节点上运行一个常驻的Swordfish执行引擎，负责执行本地计算。这种设计使得Daft既能享受Ray的弹性调度能力，又能保持Rust核心的高性能 

## 3. Lance：面向AI的列式数据格式

Lance是一种开源的列式数据格式，可以看作是对Parquet的现代化重构，专门优化了AI工作负载。它不仅存储张量数据（如Embedding向量），还管理数据的版本和元数据 

**核心特性：**
- **极速随机访问**：得益于其底层的结构化设计，Lance支持零拷贝（zero-copy）读取，随机访问（如按行取数据）性能比Parquet快100倍以上，这对于训练时的小批量随机读取至关重要 
- **内置向量索引**：Lance原生支持向量索引（如IVF-PQ），可直接在存储层进行高效的近似最近邻（ANN）搜索，无需引入专门的向量数据库 
- **自动版本控制**：每次写入都会自动生成一个新的数据集版本，支持时间旅行（Time Travel），确保实验的可复现性 
- **生态系统集成**：Lance与Apache Arrow深度集成，可以零拷贝地与Pandas、DuckDB、Daft等内存格式交互


# 三者的协同工作流

Ray、Daft、Lance三者构成了一个从存储、计算到调度的完整闭环

**架构图示：**
- **存储层**：Lance 格式，存放原始多模态数据（图像、文本、向量）及特征
- **计算引擎**：Daft (基于Ray运行)，负责读取Lance数据，执行ETL、特征工程、模型推理预处理
- **调度层**：Ray Core/AIR，负责任务分发、资源管理和库的集成（如Train/Tune）
- **应用层**：PyTorch/TensorFlow (通过Ray Train)，直接消费Daft处理后的数据流

**典型代码示例：**

以下示例展示了如何利用Daft读取Lance数据集，进行向量相似度搜索，并进行分布式处理 

```python
import daft
import ray
from daft.io import IOConfig, S3Config

# 1. 初始化Ray (如果未在集群环境中自动连接)
ray.init(address="auto")

# 2. 配置S3存储访问 (假设Lance数据存放在S3)
io_config = IOConfig(s3=S3Config(region_name="us-west-2", anonymous=True))

# 3. 使用Daft分布式读取Lance数据集，并执行向量搜索
#    底层Daft会自动利用Ray集群进行分布式扫描
df = daft.read_lance(
    "s3://my-bucket/lance/image_embeddings",
    io_config=io_config,
    # 直接在存储层进行向量近邻搜索 (Lance特性)
    default_scan_options={
        "nearest": {
            "column": "embedding",          # 向量列名
            "q": query_vector,               # 查询向量
            "k": 10,                          # 返回最相似的10条
        }
    }
)

# 4. 继续在Daft DataFrame中进行后续处理
#    例如：过滤、连接元数据、应用Python UDF
df = df.with_column(
    "image_path",
    df["image_uri"].url.download()        # Daft的URL处理原生函数
)

# 5. 定义一个使用GPU的UDF，对图像进行预处理
@daft.udf(return_dtype=daft.DataType.tensor(daft.DataType.float32()))
def preprocess_image(img_batch):
    # 这里可以调用PyTorch的 transforms
    # 假设img_batch是图片字节流
    processed = [transform(image) for image in img_batch]
    return processed

df = df.with_column("processed_tensor", preprocess_image(df["image_data"]))

# 6. 触发计算并显示结果 (分布式执行)
df.show(5)
```

在上述流程中，Daft的`read_lance`操作在Ray集群上被拆分成多个并行任务，每个任务读取Lance文件的不同片段（Fragment）。Lance的高效索引和列式存储确保了I/O开销最小化。UDF函数`preprocess_image`如果标记了GPU资源，Daft会协同Ray将其调度到具有GPU的节点上执行



# 与Hadoop + Spark生态的对比

Hadoop + Spark是过去十年大数据处理的标杆。Hadoop提供分布式文件系统（HDFS）和资源调度（YARN），Spark提供内存计算能力。下面我们将这套经典组合与Ray+Daft+Lance进行对比

## 1. 架构与设计哲学对比

| **维度** | **Hadoop + Spark 生态** | **Ray + Daft + Lance 生态** |
| :--- | :--- | :--- |
| **设计初衷** | 处理大规模结构化数据（如日志、交易记录）的批处理。 | 处理多模态数据（图像、视频、向量）的AI工作负载。 |
| **编程模型** | 以JVM（Scala/Java）为核心，Python API（PySpark）作为 wrapper。 | 原生Python优先，Rust内核，提供真正的Pythonic体验。 |
| **调度粒度** | 粗粒度调度（Stage），基于DAG，任务通常涉及整个数据集的分区。 | 细粒度任务并行，支持Actor模型，适合有状态计算和微服务化。 |
| **数据格式** | 推崇Parquet作为列式存储，但处理非结构化数据需额外序列化。 | Lance作为一等公民，原生支持向量和多模态数据类型。 |
| **资源异构** | 主要通过YARN或Kubernetes管理CPU和内存，对GPU支持需额外插件（如Spark-RAPIDS）。 | 原生支持GPU资源声明，可将特定算子（如UDF）调度到GPU上。 |

## 2. 优劣势详细对比

### **Spark的优势**

1.  **成熟与稳定**：经过十余年发展，拥有最广泛的用户群和故障模式库，是许多大型企业的默认选择 
2.  **SQL支持完善**：Spark SQL是业界标准，具有强大的ANSI SQL支持和复杂的查询优化器（Catalyst），非常适合BI报表和数仓ETL
3.  **数据源生态丰富**：几乎可以连接任何数据源（数据库、数据湖、消息队列），连接器生态非常庞大
4.  **统一的批流一体**：Structured Streaming使得批处理和流处理API统一，降低了学习成本

### **Spark的劣势**

1.  **非Python原生**：虽然PySpark很流行，但底层通信依赖Py4J，调试复杂，且UDF性能较差（需在JVM和Python间序列化数据）
2.  **多模态处理笨重**：处理图像或视频时，通常需要将其读入为二进制列，然后调用外部库处理，流程割裂且效率低下
3.  **机器学习集成度低**：Spark MLlib虽然提供了常见算法，但远不如Python原生库（如scikit-learn、PyTorch）丰富，且分布式深度学习训练困难
4.  **调度灵活性差**：Spark的调度以Stage为单位，对于需要细粒度控制或长时间运行的服务（如模型推理）支持不佳

### **Ray + Daft + Lance的优势**

1.  **AI原生体验**：从存储（Lance）到计算（Daft）到调度（Ray），整个链条为AI/ML优化。Lance的向量检索和Daft的多模态类型直接解决了AI数据处理的痛点 
2.  **Pythonic与高性能**：开发者可以完全使用Python，无需切换语言心智。底层Rust引擎保证了向量化执行的性能，UDF零拷贝避免了数据移动开销 
3.  **端到端生态整合**：Ray提供了从数据加载（Ray Data）、模型训练（Ray Train）、调优（Ray Tune）到部署（Ray Serve）的全套工具，与Daft无缝衔接 
4.  **异构计算友好**：能够自然地在一个流水线中混合使用CPU和GPU，例如在CPU上进行数据清洗，在GPU上执行Embedding提取
5.  **细粒度弹性**：Ray的Actor模型和任务调度支持更灵活的并行模式，如强化学习中模拟器与神经网络的并行 

### **Ray + Daft + Lance的劣势**

1.  **生态成熟度不足**：相比Spark十多年的积累，这三者组合相对年轻，周边工具链和第三方连接器不如Spark丰富
2.  **SQL能力相对较弱**：Daft虽然支持SQL，但在复杂查询优化和SQL标准兼容性上，短期内难以匹敌Spark SQL
3.  **运维经验少**：企业中对Spark集群的运维（调优、排错）有大量成熟经验，而Ray集群的大规模生产运维经验仍在积累中
4.  **流处理能力欠缺**：Spark有强大的流处理引擎，而这一组合目前主要针对离线批处理和近线推理，实时流处理并非强项

# 结论：如何选择？

选择哪套技术栈，取决于业务的核心场景：

- **如果您的场景是传统数仓、BI报表、大规模ETL**，且数据主要以结构化行式为主，那么 **Hadoop + Spark** 依然是稳定且功能强大的首选。其完善的SQL支持和丰富的连接器生态无可替代

- **如果您的场景是AI/ML、大模型训练与推理**，数据涉及大量图像、视频、Embedding向量，希望在一个Python环境中完成从数据预处理到模型服务的全流程，那么 **Ray + Daft + Lance** 的组合提供了更现代、更高效的路径。它能显著减少因数据格式转换和跨语言通信带来的开销，并原生支持GPU等异构资源

正如Azure Databricks文档所建议的，未来的趋势可能是**混合使用**——用Spark做大规模数据清洗和ETL，然后用Ray做计算密集型的模型训练和推理，两者在同一个平台（如Databricks）上共享数据和资源 

Python全栈的分布式计算并非要完全取代JVM生态，而是为数据密集型和计算密集型的AI时代，提供了一把更趁手、更贴合开发者心智的瑞士军刀

# 历史相关文章
- [Hive---HQL支持的2种查询语句风格，你喜欢哪一种？](/Hive/Hive---HQL支持的2种查询语句风格，你喜欢哪一种？.md)
- [Python-基于pyhive库操作hive](/Python数据处理/Python-基于pyhive库操作hive.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**

