/**
 * 创建各个服务，承载流量分发与代理服务
 */
const http = require('http');
const https = require('https');
const tls = require('tls');
const net = require('net');

const GetCert = require('./cert');
const Handle = require( "./handle" );
const Utils = require( "./utils" );
const Config = require( "./config" );

/**
 * 启动服务器入口
 * @param   {string}   proxyAddr            代理暴露地址
 * @param   {number}   proxyPort            代理暴露端口
 * @return  {Promise}  [servers, ports]     启动的服务与端口
 */
async function start( proxyAddr=false, proxyPort=false ){
    proxyAddr = proxyAddr || Config.proxyAddr;
    proxyPort = proxyPort || Config.proxyPort;
    if( Utils.isIp( proxyAddr ) ){
        // ERR_SSL_VERSION_OR_CIPHER_MISMATCH
        console.warn( "使用IP将可能导致CA生成域名证书，HTTPS有可能发生ERR_PROXY_CERTIFICATE_INVALID异常" )
    }
    return Promise.all([
        createHttpProxyServer(),
        createHttpsProxyServer( proxyAddr ),
        createSNIHttpServer()
    ]).then( ([httpServer, httpsServer, SNIServer]) => {
        let SNIServerPort = SNIServer.address().port;
        [httpServer,httpsServer].map( server => {
            server.on( "request", Handle.httpReques )
            server.on( "connect", httpsConnect(SNIServerPort) )
        })
        SNIServer.on( "request", Handle.SNIServer )
        let servers = {
            http: httpServer,
            https: httpsServer,
            SNI: SNIServer,
            [Symbol.toPrimitive]() {
                return proxyAddr;
            }
        };
        let ports = {
            http: httpServer.address().port,
            https: httpsServer.address().port,
            SNI: SNIServerPort,
            [Symbol.toPrimitive]() {
                return proxyPort;
            }
        }
        return [servers, ports];
    }).then( ([servers, ports]) => {
        createDiversionServer( proxyPort, ports.http, ports.https )
        return [servers, ports];
    }).catch(e=>{
        console.log( e )
    });
}

/**
 * 启动HTTP代理
 * @param   {number}   httpProxyServerProt  代理暴露地址
 * @return  {Promise}  createServer()       启动的服务与端口
 */
async function createHttpProxyServer( httpProxyServerProt=0 ){
    return await http.createServer()
    .on('error', ()=>{
        return Promise.reject( new Error("Failed to create HttpServer") );
    })
    .listen( httpProxyServerProt );
}

/**
 * 启动HTTPS代理
 * @param   {string}   proxyAddr                代理暴露地址
 * @param   {number}   httpsProxyServerProt     代理暴露端口
 * @return  {Promise}  createServer()           启动的服务与端口
 */
async function createHttpsProxyServer( proxyAddr='proxyPort', httpsProxyServerProt=0 ){
    const serverCrt = GetCert( proxyAddr );
    return await https.createServer({
        key: serverCrt.key,
        cert: serverCrt.cert,
    })
    .on('error', ()=>{
        return Promise.reject( new Error("Failed to create HttpsServer") );
    })
    .listen( httpsProxyServerProt );
}

/**
 * 创建SNI服务，用于分发serce证书
 * @param   {number}   SNIServerPort    代理暴露的代理端口
 * @return  {Promise}  https.Server     https.Server
 */
async function createSNIHttpServer( SNIServerPort=0 ){
    return await https.Server({
        SNICallback: (hostname, callback) => {
            const { key, cert } = GetCert(hostname);
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

/**
 * 处理HTTPS的接口，代理到本地SNI服务
 * @param   {number}   SNIServerPort    代理暴露的代理端口
 * @return  {Promise}  https.Server     
 */
function httpsConnect( SNIServerPort ) {
    // 连接目标服务器
    return function( clientRequest, clientSocket, head ){
        let clHttpsConnect = Config.log.httpsConnect;
        clHttpsConnect && console.log( "httpsConnect" )
        const { port, hostname } = new URL(`http://${clientRequest.url}`);
        const targetSocket = net.connect( this.SNIServerPort, '127.0.0.1', () => {
            // 通知客户端已经建立连接
            clientSocket.write(
                'HTTP/1.1 200 Connection Established\r\n' +
                'Proxy-agent: MITM-proxy\r\n' +
                '\r\n',
            );
            // 建立通信隧道，转发数据
            targetSocket.write(head);
            clientSocket.pipe(targetSocket).pipe(clientSocket);
        });
        targetSocket.on("error",(err)=>{
            console.error(`[${err.code}] httpsConnect targetSocket error`);
        });
    }.bind({SNIServerPort})
}

/**
 * 对外接口，统一处理HTTP/HTTPS，再分流到其他端口
 * https数据流的第一位是十六进制“16”，转换成十进制就是22
 * 
 * @param   {outPort}  outPort      数据库暴露端口
 * @param   {number}   httpPort     代理暴露的代理端口
 * @param   {number}   httpsPort    代理暴露的代理端口
 * @return  {Promise}  https.Server     
 */
async function createDiversionServer( outPort, httpPort, httpsPort ){
    return await net.createServer(function(socket){
        socket.once('data', function(buf){
            let clDiversionServerOnData = Config.log.diversionServerOnData;
            clDiversionServerOnData && console.log("DiversionServerOnData")
            // https数据流的第一位是十六进制“16”，转换成十进制就是22
            // http数据流的第一位转换成十进制就是47-?71 / 43->67
            var address = buf[0] === 22 ? httpsPort : httpPort;
            // 创建一个指向https或http服务器的链接
            var proxy = net.createConnection(address, function() {
                proxy.write(buf);
                // 反向代理的过程，tcp接受的数据交给代理链接，代理链接服务器端返回数据交由socket返回给客户端
                socket.pipe(proxy).pipe(socket);
            });
        
            proxy.on('error', function(err) {
                console.error( `[${err.code}] createDiversionServer proxy error` );
            });
        });
        
        socket.on('error', function(err) {
            console.error( `[${err.code}] createDiversionServer socket error` );
        });
    })
    .on("error", function(err){
        console.error( `\n\n[Exit] ${outPort}端口已被占用` );
        process.exit();
        // return Promise.reject( new Error( `${outPort}端口已被占用` ) );
    })
    .listen( outPort );
}

module.exports = {
    start
}