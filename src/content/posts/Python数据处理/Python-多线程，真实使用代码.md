---
title: Python 多线程，真实使用代码
slug: Python数据处理/Python-多线程，真实使用代码
published: 2020-07-20
description: Python 多线程
image: /python.jpg
showCoverInPost: false
tags: [python, 多线程]
category: Python/Python数据处理
draft: false
---

# 背景
在网上搜集到的多线程资料都是一些概念介绍，而没有真实的案例告诉读者怎么真实来使用，下面就一个真实的使用场景来介绍多线程。

以下为一些概念引用：
>在非python环境中，单核情况下，同时只能有一个任务执行。多核时可以支持多个线程同时执行。但是在python中，无论有多少个核同时只能执行一个线程。究其原因，这就是由于GIL（全局解释器）的存在导致的。

>GIL的全称是全局解释器，来源是python设计之初的考虑，为了数据安全所做的决定。某个线程想要执行，必须先拿到GIL，我们可以把GIL看做是“通行证”，并且在一个python**进程**之中，GIL只有一个，拿不到通行证的线程，就不允许**进入CPU**执行。GIL只在cpython中才有，因为cpython调用的是c语言的原生线程，所以他不能直接操作cpu，而只能利用GIL保证同一时间只能有一个线程拿到数据。

>python针对不同类型的代码执行效率也是不同的：
1、CPU密集型代码（各种循环处理、计算等），在这种情况下，由于计算工作多，ticks技术很快就会达到阀值，然后触发GIL的释放与再竞争（多个线程来回切换当然是需要消耗资源的），所以python下的多线程对CPU密集型代码并不友好。
 2、IO密集型代码（文件处理、网络爬虫等设计文件读写操作），多线程能够有效提升效率（单线程下有IO操作会进行IO等待，造成不必要的时间浪费，而开启多线程能在线程A等待时，自动切换到线程B，可以不浪费CPU的资源，从而能提升程序的执行效率）。所以python的多线程对IO密集型代码比较友好。

>主要要看任务的类型，我们把任务分为I/O密集型和计算密集型，而多线程在切换中又分为 **I/O切换** 和 **时间切换**（一个线程执行一段时间后，再切换到另外一个线程）。如果任务属于是I/O密集型，若不采用多线程，我们在进行I/O操作时，势必要等待前面一个I/O任务完成，后面的I/O任务才能进行，在这个等待的过程中，CPU处于等待状态，这时如果采用多线程的话，刚好可以切换到进行另一个I/O任务。这样就刚好可以充分利用CPU避免CPU处于闲置状态，提高效率。但是如果多线程任务都是计算型，CPU会一直在进行工作，直到一定的时间后采取多线程时间切换的方式进行切换线程，此时CPU一直处于工作状态，此种情况下并不能提高性能，相反在切换多线程任务时，可能还会造成时间和资源的浪费，导致效能下降。这就是造成上面两种多线程结果不能的解释。

>**结论：I/O密集型任务，建议采取多线程；对于计算密集型任务，python此时就不适用了。**

# 现实需求
为了解决读取文件、写入文件的I/O密集型任务，现在需要三个线程：<br/>
1、读取文件数据的线程-----读线程  <br/>
2、对读取文件数据进行操作的线程-----数据处理线程  <br/>
3、把处理结果再写入文件的线程-----写线程  <br/>
这样就可以解决读取数据等待，写入数据等待的过程
# 数据准备
建立number.txt，里面放置1~50数字，每行一个
![numbet.txt](./images/6641583-455f6a490a23ae09.webp)
目的：从number.txt每次读取一行数据，对数据进行处理后，再写入number_write.txt（程序自动建立）
# 代码
```python
# -*- coding:UTF-8 -*-
# @Time : 2020/7/19 15:38
# @File : 多线程案例.py
# @Software: PyCharm
# @Platform: Win10
# @Author: data_duo

import threading
import os
import time
import queue


def read_txt(path_file_txt):
    with open(path_file_txt, 'r') as file:
        while True:
            data = file.readline().strip()
            if data:
                while True:  # 确保读取的数据一定存入workQueue_read队列,防止队列满了放不下
                    if not workQueue_read.full():
                        workQueue_read.put(data)
                        print(
                            'read_txt线程给workQueue_read队列存入：{} \n'.format(data),
                            end='',
                            flush=True)
                        break
                    else:
                        pass
            else:
                print('退出read_txt线程', end='\n', flush=True)
                break


def handle():
    count = 0
    while True:
        if not workQueue_read.empty():
            data = workQueue_read.get()
            print(
                'handle线程从workQueue_read队列获取：{} \n'.format(data),
                end='',
                flush=True)
            data = int(data) + 1
            data = str(data - 1)
            time.sleep(1)
            count = 0  # 需要重置

            while True:  # 确保数据存入workQueue_write 队列,防止队列满了放不下
                if not workQueue_write.full():
                    workQueue_write.put(data)
                    print(
                        'handle线程给workQueue_write队列存入：{} \n'.format(data),
                        end='',
                        flush=True)
                    break
                else:
                    pass
        else:
            if count < 5:  # 等待workQueue_read队列有数据，一共5次等待机会
                count += 1
                time.sleep(1)
                pass
            else:
                if thread_read.is_alive():
                    pass
                    count = 0  # 需要重置，再次计时
                else:
                    print('退出handle线程 \n', end='', flush=True)
                    break


def write_txt(path_file_txt):
    count = 0
    with open(path_file_txt, 'w+') as file:
        while True:
            if not workQueue_write.empty():
                data = workQueue_write.get()
                print(
                    'write_txt线程从workQueue_write队列获取：{} \n'.format(data),
                    end='',
                    flush=True)
                file.write(data)
                file.write('\n')
                print('write_txt线程写入数据：{} \n'.format(data), end='', flush=True)
                count = 0  # 需要重置，再次计时
            else:
                if count < 5:  # 确保handle线程处理完毕，把数据存入workQueue_write队列
                    count += 1
                    time.sleep(1)
                    pass
                else:
                    if thread_handle.is_alive():
                        pass
                        count = 0  # 需要重置，再次计时
                    else:
                        print('退出写线程 \n', end='', flush=True)
                        break


if __name__ == "__main__":
    threads = []

    workQueue_read = queue.Queue(20)
    workQueue_write = queue.Queue(20)

    print('原来总线程数为：{} \n'.format(threading.active_count()), end='', flush=True)

    # 创建读取线程
    thread_read = threading.Thread(target=read_txt, args=('number.txt',))
    thread_read.start()
    threads.append(thread_read)
    print(
        '启动读取线程后，总线程数为：{} \n'.format(
            threading.active_count()),
        end='',
        flush=True)

    # 创建操作线程
    thread_handle = threading.Thread(target=handle)
    thread_handle.start()
    threads.append(thread_handle)
    print(
        '启动操作线程后，总线程数为：{} \n'.format(
            threading.active_count()),
        end='',
        flush=True)

    # 创建写入线程
    thread_write = threading.Thread(
        target=write_txt, args=(
            'number_write.txt',))
    thread_write.start()
    threads.append(thread_write)
    print(
        '启动写入线程后，总线程数为：{} \n'.format(
            threading.active_count()),
        end='',
        flush=True)

    # 等待所有线程完成
    for t in threads:
        t.join()

    print('退出主线程')

```
运行结果：
```python
原来总线程数为：1 
启动读取线程后，总线程数为：2 
read_txt线程给workQueue_read队列存入：1 
启动操作线程后，总线程数为：3 
read_txt线程给workQueue_read队列存入：2 
read_txt线程给workQueue_read队列存入：3 
...
read_txt线程给workQueue_read队列存入：20 
启动写入线程后，总线程数为：4 
handle线程从workQueue_read队列获取：1 
read_txt线程给workQueue_read队列存入：21 
handle线程给workQueue_write队列存入：1 
handle线程从workQueue_read队列获取：2 
read_txt线程给workQueue_read队列存入：22 
write_txt线程从workQueue_write队列获取：1 
write_txt线程写入数据：1 
handle线程给workQueue_write队列存入：2 
handle线程从workQueue_read队列获取：3 
...
read_txt线程给workQueue_read队列存入：50 
退出read_txt线程
write_txt线程从workQueue_write队列获取：29 
...
handle线程给workQueue_write队列存入：50 
write_txt线程从workQueue_write队列获取：50 
write_txt线程写入数据：50 
退出handle线程 
退出写线程 
退出主线程
```

# 历时相关文章
- [Python内置的 os 模块常用函数、方法](../../Python基础库/Python内置的-os-模块常用函数、方法/)
- [利用Python枚举所有的排列情况](../../数学知识/利用Python枚举所有的排列情况/)


**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**


