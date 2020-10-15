const createServer = require( "./src/createServer" );
const net = require('net');

// 临时业务逻辑
function tempRequestHandle(req, res) {
    console.log("tempRequestHandle")
    res.writeHead(200);
    res.end('hello world\n');
}

function connect(clientRequest, clientSocket, head) {
    // 连接目标服务器
    console.log( "connect" )
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

function main( proxyAddr, proxyPort ){
	Promise.all([
	    createServer.createHttpProxyServer(),
	    createServer.createHttpsProxyServer( proxyAddr ),
	    createServer.createdSNIHttpServer()
	]).then(( [httpServer, httpsServer, SNIServer] )=>{
		// 启动http 、 https代理
		httpServer.on("request", tempRequestHandle)
		SNIServer.on("request", tempRequestHandle)
		httpsServer.on('connect', connect.bind({
            SNIServerPort: SNIServer.address().port,
        }))
		return [httpServer, httpsServer, SNIServer];
	}).then(( [httpServer, httpsServer, SNIServer] )=>{
		let httpServerPort = httpServer.address().port;
		let httpsServerPort = httpsServer.address().port;
		createServer.createdDiversionServer( proxyPort, httpServer, httpsServer )
		return [httpServer, httpsServer, SNIServer];
	}).then(([httpServer, httpsServer, SNIServer])=>{
		console.log( `Diversion: \t http[s]://${proxyAddr}:${proxyPort}` )
		console.log( `httpServer: \t http://${proxyAddr}:${httpServer.address().port}` )
		console.log( `httpsServer: \t https://${proxyAddr}:${httpsServer.address().port}` )
		console.log( `SNIServer: \t https://${proxyAddr}:${SNIServer.address().port}` )
		console.log("everything is ok")
	})
}

let proxyAddr = "localhost";
let proxyPort = 8888;
main( proxyAddr, proxyPort );