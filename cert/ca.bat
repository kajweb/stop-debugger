@rem 这个文件用于生成CA证书

@rem 创建新文件夹
mkdir ca

@rem 用于生成CA RSA私钥
call openssl genrsa -out ca/ca.key 4096

@rem 成ca证书签发请求，得到ca.csr
call openssl req -new -sha256 -out ca/ca.csr -key ca/ca.key -config conf/ca.conf --subj="/CN=kajweb"

@rem 自签发根证书
call openssl x509 -req -days 3650 -in ca/ca.csr -out ca/ca.crt -signkey ca/ca.key -extfile conf/ca.conf