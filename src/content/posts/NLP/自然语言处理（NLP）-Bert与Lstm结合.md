---
title: 自然语言处理（NLP）-Bert与LSTM结合
slug: NLP/自然语言处理（NLP）-Bert与Lstm结合
published: 2020-09-08
description: Python 自然语言处理
image: /python.jpg
showCoverInPost: false
tags: [python, NLP]
category: Python/NLP
draft: false
---


# 背景介绍
自然语言处理（NLP）在深度学习领域是一大分支（其他：CV、语音），经过这些年的发展NLP发展已经很成熟，同时在工业界也慢慢开始普及，谷歌开放的Bert是NLP前进的又一里程碑。本篇文章结合Bert与Lstm，对文本数据进行二分类的研究。
# 需要的第三方库
- pandas
- numpy
- torch
- transformers
- sklearn

以上这些库需要读者对机器学习、深度学习有一定了解

# 数据及预训练Bert
- 预训练好的Bert（BERT-wwm, Chinese  中文维基）<br/>
[https://github.com/ymcui/Chinese-BERT-wwm](https://github.com/ymcui/Chinese-BERT-wwm)
- 语料 <br/>
[https://github.com/duo66/Data_for_ML-Deeplearning/blob/master/dianping.csv](https://github.com/duo66/Data_for_ML-Deeplearning/blob/master/dianping.csv)

# 完整过程
- **数据预处理**
```python
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import TensorDataset, DataLoader

np.random.seed(2020)
torch.manual_seed(2020)
USE_CUDA = torch.cuda.is_available()
if USE_CUDA:
    torch.cuda.manual_seed(2020)

data=pd.read_csv('./dianping.csv',encoding='utf-8')

#剔除标点符号,\xa0 空格
def pretreatment(comments):
    result_comments=[]
    punctuation='。，？！：%&~（）、；“”&|,.?!:%&~();""'
    for comment in comments:
        comment= ''.join([c for c in comment if c not in punctuation])
        comment= ''.join(comment.split())   #\xa0
        result_comments.append(comment)
    
    return result_comments

result_comments=pretreatment(list(data['comment'].values))

len(result_comments)
```
2000
```python
result_comments[:1]
```
 ['口味不知道是我口高了还是这家真不怎么样我感觉口味确实很一般很一般上菜相当快我敢说菜都是提前做好的几乎都不热菜品酸汤肥牛干辣干辣的还有一股泡椒味着实受不了环境室内整体装修确实不错但是大厅人多太乱服务一般吧说不上好但是也不差价格一般大众价格都能接受人太多了排队很厉害以后不排队也许还会来比如早去路过排队就不值了票据六日没票告我周一到周五可能有票相当不正规在这一点同等价位远不如外婆家']

- **利用transformers 先进行分字编码**
```python
from transformers import BertTokenizer,BertModel

tokenizer = BertTokenizer.from_pretrained("./chinese-bert_chinese_wwm_pytorch/data")

result_comments_id=tokenizer(result_comments,padding=True,truncation=True,max_length=200,return_tensors='pt')

result_comments_id
```
{'input_ids': tensor([[ 101, 1366, 1456,  ...,    0,    0,    0],
            [ 101, 5831, 1501,  ...,    0,    0,    0],
            [ 101, 6432, 4696,  ...,    0,    0,    0],
            ...,
            [ 101, 7566, 4408,  ...,    0,    0,    0],
            [ 101, 2207, 6444,  ...,    0,    0,    0],
            [ 101, 2523,  679,  ...,    0,    0,    0]]), 'token_type_ids': tensor([[0, 0, 0,  ..., 0, 0, 0],
            [0, 0, 0,  ..., 0, 0, 0],
            [0, 0, 0,  ..., 0, 0, 0],
            ...,
            [0, 0, 0,  ..., 0, 0, 0],
            [0, 0, 0,  ..., 0, 0, 0],
            [0, 0, 0,  ..., 0, 0, 0]]), 'attention_mask': tensor([[1, 1, 1,  ..., 0, 0, 0],
            [1, 1, 1,  ..., 0, 0, 0],
            [1, 1, 1,  ..., 0, 0, 0],
            ...,
            [1, 1, 1,  ..., 0, 0, 0],
            [1, 1, 1,  ..., 0, 0, 0],
            [1, 1, 1,  ..., 0, 0, 0]])}

```python
result_comments_id['input_ids'].shape
```
torch.Size([2000, 200])

- **分割数据集**
```python
from sklearn.model_selection import train_test_split
```
```python
X=result_comments_id['input_ids']
y=torch.from_numpy(data['sentiment'].values).float()

X_train,X_test, y_train, y_test =train_test_split(X,y,test_size=0.3,shuffle=True,stratify=y,random_state=2020)

len(X_train),len(X_test)
```
(1400, 600)
```python
X_valid,X_test,y_valid,y_test=train_test_split(X_test,y_test,test_size=0.5,shuffle=True,stratify=y_test,random_state=2020)

len(X_valid),len(X_test)
```
 (300, 300)
 
```python
X_train.shape
```
torch.Size([1400, 200])

```python
y_train.shape
```
torch.Size([1400])
```python
y_train[:1]
```
 tensor([1.])
- **数据生成器**
```python
# create Tensor datasets
train_data = TensorDataset(X_train, y_train)
valid_data = TensorDataset(X_valid, y_valid)
test_data = TensorDataset(X_test,y_test)

# dataloaders
batch_size = 32

# make sure the SHUFFLE your training data
train_loader = DataLoader(train_data, shuffle=True, batch_size=batch_size,drop_last=True)
valid_loader = DataLoader(valid_data, shuffle=True, batch_size=batch_size,drop_last=True)
test_loader = DataLoader(test_data, shuffle=True, batch_size=batch_size,drop_last=True)
```
- **建立模型**
```python
if(USE_CUDA):
    print('Training on GPU.')
else:
    print('No GPU available, training on CPU.')
```
Training on GPU.
    


```python
class bert_lstm(nn.Module):
    def __init__(self, hidden_dim,output_size,n_layers,bidirectional=True, drop_prob=0.5):
        super(bert_lstm, self).__init__()
 
        self.output_size = output_size
        self.n_layers = n_layers
        self.hidden_dim = hidden_dim
        self.bidirectional = bidirectional
        
        #Bert ----------------重点，bert模型需要嵌入到自定义模型里面
        self.bert=BertModel.from_pretrained("../chinese-bert_chinese_wwm_pytorch/data")
        for param in self.bert.parameters():
            param.requires_grad = True
        
        # LSTM layers
        self.lstm = nn.LSTM(768, hidden_dim, n_layers, batch_first=True,bidirectional=bidirectional)
        
        # dropout layer
        self.dropout = nn.Dropout(drop_prob)
        
        # linear and sigmoid layers
        if bidirectional:
            self.fc = nn.Linear(hidden_dim*2, output_size)
        else:
            self.fc = nn.Linear(hidden_dim, output_size)
          
        #self.sig = nn.Sigmoid()
 
    def forward(self, x, hidden):
        batch_size = x.size(0)
        #生成bert字向量
        x=self.bert(x)[0]     #bert 字向量
        
        # lstm_out
        #x = x.float()
        lstm_out, (hidden_last,cn_last) = self.lstm(x, hidden)
        #print(lstm_out.shape)   #[32,100,768]
        #print(hidden_last.shape)   #[4, 32, 384]
        #print(cn_last.shape)    #[4, 32, 384]
        
        #修改 双向的需要单独处理
        if self.bidirectional:
            #正向最后一层，最后一个时刻
            hidden_last_L=hidden_last[-2]
            #print(hidden_last_L.shape)  #[32, 384]
            #反向最后一层，最后一个时刻
            hidden_last_R=hidden_last[-1]
            #print(hidden_last_R.shape)   #[32, 384]
            #进行拼接
            hidden_last_out=torch.cat([hidden_last_L,hidden_last_R],dim=-1)
            #print(hidden_last_out.shape,'hidden_last_out')   #[32, 768]
        else:
            hidden_last_out=hidden_last[-1]   #[32, 384]
            
            
        # dropout and fully-connected layer
        out = self.dropout(hidden_last_out)
        #print(out.shape)    #[32,768]
        out = self.fc(out)
        
        return out
    
    def init_hidden(self, batch_size):
        weight = next(self.parameters()).data
        
        number = 1
        if self.bidirectional:
            number = 2
        
        if (USE_CUDA):
            hidden = (weight.new(self.n_layers*number, batch_size, self.hidden_dim).zero_().float().cuda(),
                      weight.new(self.n_layers*number, batch_size, self.hidden_dim).zero_().float().cuda()
                     )
        else:
            hidden = (weight.new(self.n_layers*number, batch_size, self.hidden_dim).zero_().float(),
                      weight.new(self.n_layers*number, batch_size, self.hidden_dim).zero_().float()
                     )
        
        return hidden
```

```python
output_size = 1
hidden_dim = 384   #768/2
n_layers = 2
bidirectional = True  #这里为True，为双向LSTM

net = bert_lstm(hidden_dim, output_size,n_layers, bidirectional)

#print(net)
```
- **训练模型**
```python
# loss and optimization functions
lr=2e-5
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(net.parameters(), lr=lr)

# training params
epochs = 10
# batch_size=50
print_every = 7
clip=5 # gradient clipping
 
# move model to GPU, if available
if(USE_CUDA):
    net.cuda()
```


```python
net.train()
# train for some number of epochs
for e in range(epochs):
    # initialize hidden state
    h = net.init_hidden(batch_size)
    counter = 0
 
    # batch loop
    for inputs, labels in train_loader:
        counter += 1
        
        if(USE_CUDA):
            inputs, labels = inputs.cuda(), labels.cuda()
        h = tuple([each.data for each in h])
        net.zero_grad()
        output= net(inputs, h)
        loss = criterion(output.squeeze(), labels.float())
        loss.backward()
        optimizer.step()
 
        # loss stats
        if counter % print_every == 0:
            net.eval()
            with torch.no_grad():
                val_h = net.init_hidden(batch_size)
                val_losses = []
                for inputs, labels in valid_loader:
                    val_h = tuple([each.data for each in val_h])

                    if(USE_CUDA):
                        inputs, labels = inputs.cuda(), labels.cuda()

                    output = net(inputs, val_h)
                    val_loss = criterion(output.squeeze(), labels.float())

                    val_losses.append(val_loss.item())
 
            net.train()
            print("Epoch: {}/{}...".format(e+1, epochs),
                  "Step: {}...".format(counter),
                  "Loss: {:.6f}...".format(loss.item()),
                  "Val Loss: {:.6f}".format(np.mean(val_losses)))
```
Epoch: 1/10... Step: 7... Loss: 0.679703... Val Loss: 0.685275 <br/>
Epoch: 1/10... Step: 14... Loss: 0.713852... Val Loss: 0.674887  <br/>
.............  <br/>
Epoch: 10/10... Step: 35... Loss: 0.078265... Val Loss: 0.370415  <br/>
Epoch: 10/10... Step: 42... Loss: 0.171208... Val Loss: 0.323075  

- **测试**
```python
test_losses = [] # track loss
num_correct = 0
 
# init hidden state
h = net.init_hidden(batch_size)
 
net.eval()
# iterate over test data
for inputs, labels in test_loader:
    h = tuple([each.data for each in h])
    if(USE_CUDA):
        inputs, labels = inputs.cuda(), labels.cuda()
    output = net(inputs, h)
    test_loss = criterion(output.squeeze(), labels.float())
    test_losses.append(test_loss.item())
    output=torch.nn.Softmax(dim=1)(output)
    pred=torch.max(output, 1)[1]

    # compare predictions to true label
    correct_tensor = pred.eq(labels.float().view_as(pred))
    correct = np.squeeze(correct_tensor.numpy()) if not USE_CUDA else np.squeeze(correct_tensor.cpu().numpy())
    num_correct += np.sum(correct)

print("Test loss: {:.3f}".format(np.mean(test_losses)))
 
# accuracy over all test data
test_acc = num_correct/len(test_loader.dataset)
print("Test accuracy: {:.3f}".format(test_acc))
```
Test loss: 0.442
Test accuracy: 0.827

- **直接用训练的模型推断**
```python
def predict(net, test_comments):
    result_comments=pretreatment(test_comments)   #预处理去掉标点符号
    
    #转换为字id
    tokenizer = BertTokenizer.from_pretrained("./chinese-bert_chinese_wwm_pytorch/data")
    result_comments_id=tokenizer(result_comments,padding=True,truncation=True,max_length=120,return_tensors='pt')
    tokenizer_id=result_comments_id['input_ids']
    inputs=tokenizer_id
    batch_size = inputs.size(0)
    
    # initialize hidden state
    h = net.init_hidden(batch_size)
    
    if(USE_CUDA):
        inputs = inputs.cuda()
    
    net.eval()
    with torch.no_grad():
        # get the output from the model
        output = net(inputs, h)
        output=torch.nn.Softmax(dim=1)(output)
        pred=torch.max(output, 1)[1]
        # printing output value, before rounding
        print('预测概率为: {:.6f}'.format(output.item()))
        if(pred.item()==1):
            print("预测结果为:正向")
        else:
            print("预测结果为:负向")
```
```python
comment1 = ['菜品一般，不好吃！！']
predict(net, comment1)  
```
 预测概率为: 0.015379
 预测结果为:负向
 
```python
comment2 = ['环境不错']
predict(net, comment2)
```
预测概率为: 0.972344
预测结果为:正向

```python
comment3 = ['服务员还可以，就是菜有点不好吃']
predict(net, comment3)
```
预测概率为: 0.581665
预测结果为:正向

```python
comment4 = ['服务员还可以，就是菜不好吃']
predict(net, comment4)
```
预测概率为: 0.353724
预测结果为:负向
- **保存模型**

```python
# 保存
torch.save(net.state_dict(), './大众点评二分类_parameters.pth')
```
- **加载保存的模型，进行推断**

```python
output_size = 1
hidden_dim = 384   #768/2
n_layers = 2
bidirectional = True  #这里为True，为双向LSTM

net = bert_lstm(hidden_dim, output_size,n_layers, bidirectional)
```
```python
net.load_state_dict(torch.load('./大众点评二分类_parameters.pth'))
```
`<All keys matched successfully>`

```python
# move model to GPU, if available
if(USE_CUDA):
    net.cuda()
```


```python
comment1 = ['菜品一般，不好吃！！']
predict(net, comment1)
```
预测概率为: 0.015379
预测结果为:负向

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**


