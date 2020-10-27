const Inc  = require("./inc");

const IncCharacterSetPriority = Inc.config.characterSet.priority;

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
		request: true
	},
	// 默认字符集设置
	characterSet: {
		// 检测编码时默认字符集
		default: "utf-8",
		// 优先设置：header、meta、default
		priority: IncCharacterSetPriority.header
	}
}