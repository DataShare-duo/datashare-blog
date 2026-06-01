---
title: Python---opencv一次读取视频里面多张视频帧
slug: Python图像处理/Python---opencv一次读取视频里面多张视频帧
published: 2020-08-24
description: Python 读取视频里面多张视频帧
image: /python.jpg
showCoverInPost: false
tags: [python, opencv]
category: Python/Python图像处理
draft: false
---

# 背景
在对视频进行人脸打码时，需要从磁盘读取视频帧，然后通过训练好的深度神经网络模型进行人脸监测，获取到人脸的位置后，然后进行打码。

# opencv读取多张视频帧，提高性能
由于opencv每次只能读取一张视频帧，然后把这一张视频帧送入神经网络模型进行人脸监测，这样逐帧的处理视频，速度相对来说比较慢。

为了提高性能，需要进行优化。如果对训练深度神经网络模型，原理了解的话，那么可以每次传入多个视频帧，这样每次作为一个batch，使计算效率更高一些。深度神经网络模型在训练时，是每次处理一个batch图像，来通过梯度下降，优化模型参数。

这样就需要opencv每次读取多个视频帧，但是opencv里面没有这样的方法，只能自己去实现这样的方法。

# 实例代码
```python
import cv2
import numpy as np

video_full_path_and_name='./test.mp4'
videoCapture = cv2.VideoCapture()  # 创建视频读取对象
videoCapture.open(video_full_path_and_name)  # 打开视频
fps = int(round(videoCapture.get(cv2.CAP_PROP_FPS),0))
image_width=int(videoCapture.get(cv2.CAP_PROP_FRAME_WIDTH))   #视频帧宽度
image_height=int(videoCapture.get(cv2.CAP_PROP_FRAME_HEIGHT))   #视频帧高度
image_channel=3   #RGB 3通道

ret=True
while ret:
	img_batch_rgb=np.empty(shape=[0,image_height,image_width,image_channel],dtype=np.uint8)
	#每次读取1s的视频帧，可以根据自己的内存大小，每次读取多秒
	for i in range(fps*1):
		ret, img = videoCapture.read()
		#读取到图像帧   
		if ret:
			# opencv:BGR  转换为 RGB
			rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
			img_batch_rgb=np.append(img_batch_rgb,np.expand_dims(rgb_img, 0),axis=0)
		else:
			break

print(img_batch_rgb.shape,flush=True)
#img_batch_rgb      #该变量即为多个视频帧
```
# 历史相关文章
- [Python 人脸检测方法总结](../../Python图像处理/Python-人脸检测方法总结/)
- [Python 多线程，真实使用代码](../../Python数据处理/Python-多线程，真实使用代码/)



**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号，不定期分享干货**
