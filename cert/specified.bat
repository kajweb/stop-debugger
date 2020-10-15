@rem 使用配置文件生成server-SSL证书

mkdir specified

call openssl genrsa -out specified/server.key 4096

call openssl req -new -sha256 -out specified/server.csr -key specified/server.key -extensions req_ext -config conf/specified.conf

call openssl x509 -req -days 3650 -in specified/server.csr -signkey specified/server.key -out specified/server.crt -CA ca/ca.crt -CAkey ca/ca.key -extensions req_ext -CAserial specified/server.srl -CAcreateserial -extfile conf/specified.conf