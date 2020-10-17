const https = require('https');
const http = require('http');
const tls = require('tls');
const net = require('net');

const getCert = require('./cert');
const handle = require( "./handle" );

async function start( proxyAddr, proxyPort ){
    return Promise.all([
        createHttpProxyServer(),
        createHttpsProxyServer( proxyAddr ),
        createSNIHttpServer()
    ]).then( ([httpServer, httpsServer, SNIServer]) => {
        let SNIServerPort = SNIServer.address().port;
        [httpServer,httpsServer].map( server => {
            server.on( "request", handle.httpReques )
            server.on( "connect", httpsConnect(SNIServerPort) )
        })
        SNIServer.on( "request", handle.SNIServer )
        let servers = {
            http: httpServer,
            https: httpsServer,
            SNI: SNIServer,
        };
        let ports = {
            http: httpServer.address().port,
            https: httpsServer.address().port,
            SNI: SNIServerPort
        }
        return [ servers, ports ];
    }).then( ([servers, ports]) => {
        createDiversionServer( proxyPort, ports.http, ports.https );
        return [servers, ports];
    });
}

// HTTP代理
async function createHttpProxyServer( httpProxyServerProt=0 ){
    return await http.createServer()
    .on('error', ()=>{
        return Promise.reject( new Error("Failed to create HttpServer") );
    })
    .listen( httpProxyServerProt );
}

// HTTPS代理
async function createHttpsProxyServer( proxyAddr='proxyPort', httpsProxyServerProt=0 ){
    const serverCrt = getCert( proxyAddr );
    return await https.createServer({
        key: serverCrt.key,
        cert: serverCrt.cert,
    })
    .on('error', ()=>{
        return Promise.reject( new Error("Failed to create HttpsServer") );
    })
    .listen( httpsProxyServerProt );
}

// 创建SNI服务，用于分发证书
async function createSNIHttpServer( SNIServerPort=0 ){
    return await https.Server({
        SNICallback: (hostname, callback) => {
            const { key, cert } = getCert(hostname);
            callback(
                null,
                tls.createSecureContext({
                    key: key,
                    cert: cert,
                }),
            );
        },
    })
    .on('error', ()=>{
        return Promise.reject( new Error("Failed to create SNI HttpServer") );
    })
    .listen(SNIServerPort);
}

function httpsConnect(SNIServerPort) {
    // 连接目标服务器
    return function(clientRequest, clientSocket, head){
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
    }.bind({SNIServerPort})
}

// 对外接口，统一处理HTTP/HTTPS，再分流到其他端口
async function createDiversionServer( outPort, httpPort, httpsPort ){
    // console.log( httpsPort  )
    return net.createServer(function(socket){
        // socket.on('lookup',(e)=>{
        //     console.log("lookup")
        //     console.log( e )
        // })

        // socket.on('connect',(e)=>{
        //     console.log("connect")
        //     console.log( e )
        // })

        socket.once('data', function(buf){
            // console.log( buf )
            console.log("DiversionServerOnData")
            // console.log( buf[0] );
            // console.log( socket.localAddress )
            console.log( buf.toString() )
            // https数据流的第一位是十六进制“16”，转换成十进制就是22
            // http数据流的第一位转换成十进制就是47-?71 / 43->67
            var address = buf[0] === 22 ? httpsPort : httpPort;
            // address = httpPort;
            // address = httpsPort;
            // 创建一个指向https或http服务器的链接
            var proxy = net.createConnection(address, function() {
                proxy.write(buf);
                // 反向代理的过程，tcp接受的数据交给代理链接，代理链接服务器端返回数据交由socket返回给客户端
                socket.pipe(proxy).pipe(socket);
            });
        
            proxy.on('error', function(err) {
                console.log(err);
            });
        });
        
        socket.on('error', function(err) {
            console.log(err);
        });
    }).listen( outPort );
}

module.exports = {
    start,
    // createHttpProxyServer,
    // createHttpsProxyServer,
    // createSNIHttpServer,
    // createDiversionServer
}