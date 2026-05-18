---
title: 数据去重 VBA字典法
slug: EXCEL数据处理与VBA/数据去重-----VBA字典法
published: 2019-03-18
description: Excel 通过VBA编写宏程序来进行数据去重
image: ./Excel.png
tags: [Excel, VBA, 数据处理]
category: EXCEL数据处理与VBA
draft: false
---

在Excel里面数据去重方法比较多，目前用的比较多的有：

#### 1. 数据--筛选---高级筛选

#### 2. 数据透视表

#### 但以上这两种方法都有局限性，比如需要去重的区域是多列数据

------------------------------------------------------------------------------------------------------
下面介绍一种通过VBA编写宏程序来进行数据去重，可以去重多列数据

先把代码呈现出来，再进行解释：

```vba

Sub 字典方法()

    Dim rng As Range       '定义一个区域，用于接收需要去重的单元格区域

    Set rng = Application.InputBox("请指定去重区域", "数据源区域", , , , , , 8)     '可以是一列，也可以是多列

    If rng Is Nothing Then End         '如果没有选择区域，则退出，注：是End，不是End IF



    Dim arr    '定义一个数组，用于存储去重区域的值

    arr = rng.value



    Dim a

    On Error Resume Next         '这里需要忽略错误，后面添加重复键值会引发错误



    Dim dic As Object    

    Set dic = CreateObject("scripting.dictionary")            '引用字典对象



    For Each a In arr

        If Len(a) > 0 Then     

            dic.Add CStr(a), ""     '往字典里面添加键值

        End If

    Next a

    Err.Clear



    Set rng = Application.InputBox("请指定结果存放区域，单个单元格即可", "存放区域", , , , , , 8)



    If Err <> 0 Then End



    rng(1).Resize(dic.Count, 1) = WorksheetFunction.Transpose(dic.Keys)         '往单元格里面写入去重后的数据



End Sub

```

------------------------------------------------------------------------------------------------------

这里主要运用的字典的键值唯一性，如果向字典里面添加已经存在的键，则会引发错误，所以中间部分需要忽略错误

**数组+字典在VBA里面可以提升程序运行效率，如想提升VBA程序运行效率，可多运用数组、字典**
