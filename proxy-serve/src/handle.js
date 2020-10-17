const net = require('net');

// 请求到HTTP服务器的请求（HTTP）
function httpReques( cReq, cRes ) {
    console.log("Http Request Http")
	console.log( "request：" + cReq.url )
    cRes.writeHead(200);
    cRes.end('hello world Http Request Http\n');
}


// 请求到SNI服务器的请求（HTTPS）
function SNIServer( cReq, cRes ){
    console.log("SNIServer")
    console.log( "request：" + cReq.url )
    cRes.writeHead(200);
    cRes.end('SNIServer\n');
}

module.exports = {
	httpReques,
    SNIServer
}