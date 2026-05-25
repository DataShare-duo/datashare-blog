---
title: 利用Python 自己动手制作动漫效果图片
slug: Python图像处理/利用Python-自己动手制作动漫效果图片
published: 2021-11-27
description: Python 动漫效果图片
image: /python.jpg
showCoverInPost: false
tags: [python]
category: Python/Python图像处理
draft: false
---


# 背景
动漫效果的头像最近比较火，微信里面有大量的朋友都是使用这种风格的头像，在一些软件里面也慢慢开始集成该功能，在手机里面可以直接制作出动漫效果的图片

这种风格的图片是怎么生成的呢，那就不得不说最近这几年大火的AI，也就是神经网络模型，可以用来处理目前的一些问题，比如：自然语言/NLP类、图像/CV类、声音类 等，动漫图片就归属于图像/CV类中的一种，本篇文章主要是介绍一个开源的模型，来生成这种动漫效果的图片

# 动漫效果
![动漫效果](./images/6641583-0a17524399db2343.webp)

# 开源项目介绍
最近发现一个开源项目可以实现该功能，其模型的权重只有 8.2M ，相对一些大的模型来说已经很轻量级了，并且该模型在自己的笔记本电脑能够很好运行，你可以直接下载该项目到自己的电脑里面，来处理自己想要的图片

pytorch版本地址：（本文基于pytorch版本）<br/>
[https://github.com/bryandlee/animegan2-pytorch](https://github.com/bryandlee/animegan2-pytorch)

tensorflow版本地址： <br/>
[https://github.com/TachibanaYoshino/AnimeGANv2](https://github.com/TachibanaYoshino/AnimeGANv2)

![开源项目](./images/6641583-b38b5b66d0df68fa.webp)

# 自己动手实践
本篇文章里面的代码是依赖开源项目中的 
模型框架： model.py
模型权重： weights文件夹里面的4个权重文件
其他的文件没有涉及，下载开源项目后，用以下的脚本在开源项目里面运行后，生成的结果图片会放在当前目录的 `animegan_outs` 里面，运用模型的4个不同权重，最终会生成4张不同风格的动漫图片

需要的环境，第三方库：`pytorch`、`opencv`

```python
import torch
import cv2
import numpy as np
import os
import shutil
from model import Generator
from torchvision.transforms.functional import to_pil_image
from PIL import Image


def load_image(image_path):
    img = cv2.imread(image_path).astype(np.float32)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = torch.from_numpy(img)
    img = img/127.5 - 1.0
    
    return img

image = load_image('yangmi.jpg')   #RGB  此处需要加载自己的图片
#image.shape  #HWC 

models=['face_paint_512_v2','face_paint_512_v1','paprika','celeba_distill']
models_path=[f'./weights/{model}.pt' for model in models]

if os.path.exists('./animegan_outs/'):
    shutil.rmtree('./animegan_outs')
    os.makedirs('./animegan_outs/')
else:
    os.makedirs('./animegan_outs/')

device='cpu'
net = Generator()
images=[]
for model,model_path in zip(models,models_path):
    net.load_state_dict(torch.load(model_path, map_location="cpu"))
    net.to(device).eval()
    
    with torch.no_grad():
        input = image.permute(2, 0, 1).unsqueeze(0).to(device)   #BCHW
        out = net(input, False).squeeze(0).permute(1, 2, 0).cpu().numpy()  #HWC
        out = (out + 1)*127.5
        out = np.clip(out, 0, 255).astype(np.uint8)
        
        pil_out=to_pil_image(out)
        
        pil_out.save(f'./animegan_outs/{model}.jpg')   #保存处理过后的图片
        images.append(pil_out)


font=cv2.FONT_HERSHEY_SIMPLEX    #使用默认字体
UNIT_WIDTH_SIZE,UNIT_HEIGHT_SIZE=images[0].size[:2]

images_add_font=[]      #保存加了文字之后的图片
for model,image in zip(models,images):
    image_font=cv2.putText(np.array(image),model,(280,50),font,1.2,(0,0,0),3)  
    #添加文字，1.2表示字体大小，（280,50）是初始的位置，(0,0,0)表示颜色，3表示粗细
    
    images_add_font.append(Image.fromarray(image_font))

target = Image.new('RGB', (UNIT_WIDTH_SIZE * 2, UNIT_HEIGHT_SIZE * 2))   #创建成品图的画布
#第一个参数RGB表示创建RGB彩色图，第二个参数传入元组指定图片大小，第三个参数可指定颜色，默认为黑色
for row in range(2):
    for col in range(2):
        #对图片进行逐行拼接
        #paste方法第一个参数指定需要拼接的图片，第二个参数为二元元组（指定复制位置的左上角坐标）
        #或四元元组（指定复制位置的左上角和右下角坐标）
        target.paste(images_add_font[2*row+col], (0 + UNIT_WIDTH_SIZE*col, 0 + UNIT_HEIGHT_SIZE*row))

target.save('./animegan_outs/out_all.jpg', quality=100) #保存合并的图片
```
![完整代码](./images/6641583-4557698554c7b324.webp)

# 生成的动漫图片
![原始图片](./images/6641583-7325b334ce1f76ea.webp)

![face_paint_512_v2](./images/6641583-ed87e465648eaa32.webp)


![face_paint_512_v1](./images/6641583-cd06d834dd0f9646.webp)

![paprika](./images/6641583-2437a9b9a55bc05f.webp)

![celeba_distill](./images/6641583-ee0ddaec1f99e2c5.webp)

![out_all](./images/6641583-b8182d145b0de459.webp)



# 历史相关文章
- [Python opencv一次读取视频里面多张视频帧]()
- [Python 人脸检测方法总结]()
- [利用Python生成手绘效果的图片]()

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
