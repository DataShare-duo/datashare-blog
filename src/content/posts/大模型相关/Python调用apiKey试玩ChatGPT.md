---
title: Python调用apiKey试玩ChatGPT
slug: 大模型相关/Python调用apiKey试玩ChatGPT
published: 2023-02-18
description: Python 试玩ChatGPT
showCoverInPost: false
tags: [python, ChatGPT, 大模型]
category: 大模型相关
draft: false
---


# 背景
小编是在2019年开始学习机器学习，在查找资料时知道的OpenAI公司，当时该公司才成立没多久（创建于2018年），他的一些技术让小编感觉很厉害，便对他有了深刻印象。这短短过去4年时间，该公司便使人工智能又上了一个台阶，让大家都称赞不绝

# GPT发展历程
官方的模型介绍文档：

从文档可以看出，开放的api是GPT-3，所以在调动api时，使用的模型是GPT-3，但是OpenAI官网的聊天，使用的是GPT-3.5，所以同样的问题，回答可能会不一样，
![发展历程](./images/6641583-1736ed74cf830471.webp)

>GPT-3（Generative Pre-trained Transformer 3，简称GPT-3）指的是生成型预训练变换模型第3版，是一个自回归语言模型，目的是为了使用深度学习生成人类可以理解的自然语言

>GPT-3.5 与GPT-3 最大的差别在于GPT-3 主要扮演一个搜集资料的角色，较单纯的使用网路上的资料进行训练。而GPT-3.5 则是由GPT-3 微调出来的版本，而其中GPT-3.5 使用与GPT-3 不同的训练方式，所产生出来不同的模型，比起GPT-3 来的更强大

**最近特别火的ChatGPT就是是建立GPT-3.5 之上，且更加上使用更完整的 人类反馈强化学习(RLHF)去训练。(大致上可以想成GPT-3 → GPT-3.5 → ChatGPT这样)**
 
也因此ChatGPT 除了能够准确理解问题，更能够将对话一路记住和按此调整内容，其中包括承认错误、纠正错处和拒绝不当要求等等较为复杂的互动内容，更符合道德要求的训练方式，达到更接近真人的效果，这也是GPT-3 所没有的。


# 注册要点
因为官方限制了在中国地区使用，并且必须得用国外手机号验证，难点就是得有一个国外的手机号，可以使用接码平台，懂的话可以试试注册一个玩一下，如果对翻墙、机场、接码平台不了解的话，小编不建议大家折腾半天来注册一个官方账号

现在国内有一些网站、微信群基于api接口，开发出来供大家尝鲜使用，但基于的是不是OpenAI的api接口，这个有待验证（**国内的开发大家都知道，喜欢骗人，要么是广告，要么调用就不是真正的OpenAI接口**），所以大家在试玩的时候，得注意安全

# 基于官方网页版试玩
![测试-1](./images/6641583-67cc51d92fa22d63.webp)

![测试-2](./images/6641583-4cebd6c336021fa6.webp)

# 基于apikey试玩
![apikey](./images/6641583-473e46eb08add0ed.webp)


```python
import openai
openai.api_key = 'sk-xxxx'  #注册的api key

response = openai.Completion.create(
  model='text-davinci-003',  #GPT-3 模型
  prompt='给我一些全球的新闻网址',
  temperature=0.5,
  max_tokens=2048,
  top_p=1.0,
  frequency_penalty=0.5,
  presence_penalty=0.0,
)

print(response.choices[0].text)
```

# 历史相关文章
- [Python 人脸检测方法总结](../../Python图像处理/Python-人脸检测方法总结/)
- [自然语言处理（NLP）-Bert与Lstm结合](../../NLP/自然语言处理（NLP）-Bert与Lstm结合/)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
