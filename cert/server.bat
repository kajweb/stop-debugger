@rem 生成server/server - SSL证书
@rem 注意，先生成CA证书，并加入到“信任的根证书颁发机构”
@rem 注意，需要配置conf，使证书带SubjectAltName / alternate_names
@rem 否则证书将不被Chrome信任

mkdir server

call openssl genrsa -out server/server.key 4096

call openssl req -new -sha256 -extensions req_ext -out server/server.csr -key server/server.key -config conf/server.conf -subj="/CN=localhost"

call openssl x509 -req -days 3650 -extensions req_ext -in server/server.csr -signkey server/server.key -out server/server.crt -CA ca/ca.crt -CAkey ca/ca.key -CAserial server/server.srl -CAcreateserial -extfile conf/server.conf