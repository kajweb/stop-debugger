// 测试生成的server证书是否可用
// Test whether the generated server certificate is available

// 使用方法 
// 服务启动后，请手动打开浏览器，访问监听的端口。
// 如果页面无法正常显示，则证书/https服务异常

// usage
// After the service is started, please manually open the browser to access the listening port.
// If the page cannot be displayed normally, the certificate/https service is abnormal

let config = {
	serverKey: './cert/localhost.key',
	serverCert: './cert/localhost.crt',
	httpPort: '10000',
	httpsPort: '10001'
}

// config.serverKey = './cert/server.key';
// config.serverCert = './cert/server.key';

var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');

// visit the web and Return hello https;
function httpHandle(req, res) {
    res.writeHead( 200,{'Content-Type':'text/html'} );
    res.end( "hello http" )   
}

function httpsHandle(req, res) {
    res.writeHead( 200,{'Content-Type':'text/html'} );
    res.end( "hello https" )   
}

var options = {
    key: fs.readFileSync( config.serverKey ),
    cert: fs.readFileSync( config.serverCert )
};

// StartProxy && Listening port
http.createServer()
	.on( 'request', httpHandle )
	.listen( config.httpPort, '0.0.0.0');
https.createServer( options )
	.on( 'request', httpsHandle )
	.listen( config.httpsPort, '0.0.0.0' );

console.log( `Now,You Can Visit The Website.` );
console.log( `http://youDomain:${config.httpPort}` );
console.log( `https://youDomain:${config.httpsPort}` );