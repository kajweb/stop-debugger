// 测试http、https在同一个端口运行，同时http、https端口随机
// Test http and https run on the same port

// https://www.cnblogs.com/xuhang/p/5496604.html

let config = {
    outPort: 8887,
    key: './cert/localhost.key',
    cert: './cert/localhost.crt'
}

var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var net = require('net');

// visit the web as a proxy
function requestHttp(req, res) {
    console.log( "request HTTP" )
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end("hello http")   
}

// visit the web as a proxy
function requestHttps(req, res) {
    console.log( "request HTTPs" )
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end("hello https")   
}

var options = {
    key: fs.readFileSync( config.key ),
    cert: fs.readFileSync( config.cert ),
};

// StartProxy && Listening port
async function createHttpServer(){
    httpServer =  await http.createServer().on('request', requestHttp).listen( 0, '0.0.0.0' );
    return httpServer.address().port;
}
async function createHttpsServer(){
    httpsServer = await https.createServer(options).on('request', requestHttps).listen( 0, '0.0.0.0' );
    return httpsServer.address().port;
}

function createNetServer( port, httpPort, httpsPort ){
    net.createServer(function(socket){
        socket.once('data', function(buf){
            // console.log(buf[0]);
            // https数据流的第一位是十六进制“16”，转换成十进制就是22
            // http数据流的第一位转换成十进制就是71
            var address = buf[0] === 22 ? httpsPort : httpPort;
            //创建一个指向https或http服务器的链接
            var proxy = net.createConnection(address, function() {
                proxy.write(buf);
                //反向代理的过程，tcp接受的数据交给代理链接，代理链接服务器端返回数据交由socket返回给客户端
                socket.pipe(proxy).pipe(socket);
            });
        
            proxy.on('error', function(err) {
                console.log(err);
            });
        });
        
        socket.on('error', function(err) {
            console.log(err);
        });
    }).listen( port );
}

Promise.all([
    createHttpServer(),
    createHttpsServer()
]).then( ([httpPort, httpsPort])=>{
    createNetServer( config.outPort, httpPort, httpsPort );
    return [config.outPort, httpPort, httpsPort];
}).then( ([outPort, httpPort, httpsPort])=>{
    console.log( "Now,You can send proxy via http or https." );
    console.log( ` http://localhost:${outPort}` )
    console.log( `https://localhost:${outPort}` )
    console.log( ` http://localhost:${httpPort}` )
    console.log( `https://localhost:${httpsPort}` )
})