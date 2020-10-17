const net = require('net');

// temp
// function httpsRequestHttp( cReq, cRes ) {
//     console.log("HttpS Request Http")
// 	console.log( "request：" + cReq.url )
//     cRes.writeHead(200);
//     cRes.end('hello world HttpS Request Http\n');
// }

// temp
function httpReques( cReq, cRes ) {
    console.log("Http Request Http")
	console.log( "request：" + cReq.url )
    cRes.writeHead(200);
    cRes.end('hello world Http Request Http\n');
}

// temp
// function httpsRequestHttps( cReq, cRes ) {
//     console.log("HttpS Request HttpS")
// 	console.log( "request：" + cReq.url )
//     cRes.writeHead(200);
//     cRes.end('hello world HttpS Request HttpS\n');
// }

// temp
// function httpRequestHttps( cReq, cRes ) {
//     console.log("Http Request HttpS")
// 	console.log( "request：" + cReq.url )
//     cRes.writeHead(200);
//     cRes.end('hello world Http Request HttpS\n');
// }

function httpsConnect(clientRequest, clientSocket, head) {
    // 连接目标服务器
    console.log( "app.js/connect" )
    const targetSocket = net.connect(this.SNIServerPort, '127.0.0.1', () => {
        // 通知客户端已经建立连接
        clientSocket.write(
            'HTTP/1.1 200 Connection Established\r\n'
                + 'Proxy-agent: MITM-proxy\r\n'
                + '\r\n',
        );

        // 建立通信隧道，转发数据
        targetSocket.write(head);
        clientSocket.pipe(targetSocket).pipe(clientSocket);
    });
}

function httpsConnectBinder( SNIServerPort ) {
    return function(){
        httpsConnect.bind({ 
            SNIServerPort 
        })(...arguments)
    }
}



// 临时业务逻辑 temp
function tempRequestHandle(cReq, cRes) {
    console.log("tempRequestHandle")
    if( cReq.url == '/' ){
	    // console.log( cReq )
    }
    const url = require("url");
    var u = url.parse(cReq.url);
    // console.log( u )
    console.log( u.hostname )
	// console.log( "request：" + cReq.url )
    cRes.writeHead(200);
    cRes.end('hello world\n');
}

// 请求到SNI服务器的请求
function SNIServer( cReq, cRes ){
    console.log("SNIServer")
    console.log( "request：" + cReq.url )
    cRes.writeHead(200);
    cRes.end('SNIServer\n');
}


module.exports = {
	httpReques,
    // httpsRequestHttp,
	// httpsRequestHttps,
	// httpRequestHttps,
	httpsConnect,
	tempRequestHandle,
	SNIServer,
    httpsConnectBinder
}