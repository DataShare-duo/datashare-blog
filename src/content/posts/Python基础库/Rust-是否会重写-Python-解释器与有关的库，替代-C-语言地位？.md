---
title: Rust 是否会重写 Python 解释器与有关的库，替代 C 语言地位？
slug: Python基础库/Rust-是否会重写-Python-解释器与有关的库，替代-C-语言地位？
published: 2024-09-24
description: Python Rust是否会重写
image: ./python.jpg
showCoverInPost: false
tags: [python, rust]
category: Python/Python基础库
draft: false
---


# 背景
近2年随着Rust语言的大力发展，一些系统与软件开始逐渐使用Rust语言来实现，并且一些大型公司也开始逐渐转向Rust

因为在学习 Polars 库时，看到该库是使用Rust实现的，小编近一年也逐渐开始学习Rust语言，了解到其中的一些思想相对其他语言来说确实比较先进，所有权概念的引入，不仅可以提升性能，而且还保证了数据安全、准确，不会有数据竞争问题的产生

小编最近在处理加解密任务时，借助Rust语言实现了一个DES加解密库，借助Rust 中的 `pyo3` 包，在Python 中借助 `maturin` 库，可以把 Rust 实现的库转换为 Python 的包，供Python调用 

# DES加解密，Rust实现
```rust
use pyo3::prelude::*;

use openssl::provider::Provider;
use openssl::symm::{Cipher,encrypt,decrypt};
use hex;

const KEY:&[u8; 8]=b"ABCD1234";
const IV:&[u8; 8]=b"ABCD1234";

#[pyfunction]
fn des_encrypt(data:String)-> String {
    let _provider = Provider::try_load(None, "legacy", true).unwrap();
    let cipher: Cipher = Cipher::des_cbc();

    let ciphertext = encrypt(cipher, KEY, Some(IV), data.as_bytes());
    
    hex::encode(&ciphertext.unwrap()).to_uppercase()

}

#[pyfunction]
fn des_decrypt(data:String)-> String {
    let _provider = Provider::try_load(None, "legacy", true).unwrap();
    let cipher: Cipher = Cipher::des_cbc();
    
    match hex::decode(&data) {
        Ok(bytes) => {
            // println!("Decoded: {:?}", bytes); // 输出: [104, 101, 108, 108, 111]
            // println!("{:?}", des_decrypt(&bytes));
            match decrypt(cipher, KEY, Some(IV), &bytes) {
                Ok(bytes) => {
                    // println!("Decoded: {:#?}", bytes); // 输出: [104, 101, 108, 108, 111]
                    match String::from_utf8(bytes) {
                        Ok(string) => string, // 输出: "hello"
                        Err(_) => "".to_string(),
                    }
                },
                Err(_) => "".to_string(),
            }
        },
        Err(_) => "".to_string(),
    }

}

#[pymodule]
fn des_rust(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(des_encrypt, m)?)?;
    m.add_function(wrap_pyfunction!(des_decrypt, m)?)?;
    
    Ok(())
}
```

然后利用 `Maturin` 进行打包，可以生成 Python 的库/包/轮子，小编这里生成的是 `des_rust-0.1.0-cp37-abi3-win_amd64.whl`

然后安装该包后，即可在Python中进行使用

# Python 使用
```
from des_rust import des_decrypt,des_encrypt

data=des_decrypt(des_encrypt('DataShare'))

print(data)    #DataShare
```
通过性能测试，效率相对使用Python实现的包，性能有大幅提升

# 进一步思考
通过以上的案例，小编走通了从Python中调用Rust代码的流程，结合小编学习 Rust 的思考，那么Rust + Python 结合，是否会成为将来数据分析、机器学习领域的趋势？

- Python 比较灵活，拿来即用，学习起来也容易，现在普及程度也很广，最重要的是能很快出成果，处在现阶段的社会，出成果很重要，有的老板恨不得第1天晚上想出了一个idea，第2天就想要成果，当然这个也不能怨老板，只能说现阶段竞争很激烈

- Rust 内存安全、性能高，可以弥补Python 的不足，截止当前已经有很多Python 库是使用Rust 实现的，随着老板的想发愈发复杂，想提升数据处理性能，只能使用底层的语言实现，但也不能另起炉灶，否则前期的工作相当于白做，而且业务也需要快速迭代

Rust + Python 结合是否会成为将来数据领域的趋势呢？让我们拭目以待

# 历史相关文章
- [《精益数据分析》读书分享-----增长引擎说](/数据分析与挖掘/《精益数据分析》读书分享-----增长引擎说.md)
- [吴军老师的《计算之魂》部分重点摘要](/随笔/吴军老师的《计算之魂》部分重点摘要.md)

**************************************************************************
**以上是自己实践中遇到的一些问题，分享出来供大家参考学习，欢迎关注微信公众号：DataShare ，不定期分享干货**
