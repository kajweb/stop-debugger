module.exports = {
	// 代理地址
	// 使用IP时，CA证书可能会自签名出错
	// HTTPS代理将提示ERR_PROXY_CERTIFICATE_INVALID
	proxyAddr: "localhost",
	// 代理端口
	proxyPort: 8888,
	// caKey路径
	caKey: './src/cert/ca.key',
	// caCert路径
	caCert: './src/cert/ca.crt',
	log: {
		diversionServerOnData: false,
		httpsConnect: false,
		request: false
	}
}