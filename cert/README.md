# stop-debugger / cert

生成CA证书和server证书

> 证书已经生成好，存放在`/cert/ca/ca.crt`和`/cert/ca/ca.key`



## 生成CA证书

### 生成RSA私钥（*.key）

```bash
openssl genrsa -out ca/ca.key 4096
```

### 生成CA证书签发请求（*.csr）

```bash
openssl req -new -sha256 -out ca/ca.csr -key ca/ca.key -config conf/ca.conf --subj="/CN=kajweb"
```

> 其中`kajweb`为CA证书颁发者名称，使用时替换成自己的名字即可。

### 自签发根证书(*.crt)

```bash
openssl x509 -req -days 3650 -in ca/ca.csr -out ca/ca.crt -signkey ca/ca.key -extfile conf/ca.conf
```



## 使用CA证书签发server证书

前面两步和生成CA证书一样，但是注意配置文件需要修改为`server.conf`。同时需要根据生成证书的域名，在`server.conf`中修改`alt_names`中的`DNS1`（Chrome 58↑）  

由于Chrome 58 及以上版本只会使用 subjectAlternativeName 扩展程序（而不是 commonName）来匹配域名和网站证书。如果直接按照下面的步骤生成的ssl证书是不能直接在谷歌正常使用的，会说证书无效，并报错：NET::ERR_CERT_COMMON_NAME_INVALID 。
[https://support.google.com/chrome/a/answer/7391219?hl=zh-Hans](https://support.google.com/chrome/a/answer/7391219?hl=zh-Hans)

### 生成RSA私钥（*.key）

```bash
openssl genrsa -out server/server.key 4096
```

### 生成证书签发请求（*.csr）

```bash
openssl req -new -sha256 -extensions req_ext -out server/server.csr -key server/server.key -config conf/server.conf -subj="/CN=localhost"
```

> `localhost`对应的是域名

### 签发server证书

```bash
openssl x509 -req -days 3650 -extensions req_ext -in server/server.csr -signkey server/server.key -out server/server.crt -CA ca/ca.crt -CAkey ca/ca.key -CAserial server/server.srl -CAcreateserial -extfile conf/server.conf
```



