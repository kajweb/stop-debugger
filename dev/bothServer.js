// 测试http、https在同一个端口运行
// Test http and https run on the same port

// https://www.cnblogs.com/xuhang/p/5496604.html

let config = {
    outPort: 8887,
    httpPort: 8888,
    httpsPort: 8889,
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
http.createServer().on('request', requestHttp).listen(config.httpPort, '0.0.0.0');
https.createServer(options).on('request', requestHttps).listen(config.httpsPort, '0.0.0.0');

net.createServer(function(socket){
    socket.once('data', function(buf){
        // console.log(buf[0]);
        // https数据流的第一位是十六进制“16”，转换成十进制就是22
        // http数据流的第一位转换成十进制就是71
        var address = buf[0] === 22 ? config.httpsPort : config.httpPort;
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
}).listen(config.outPort);

console.log( "Now,You can send proxy via http or https." );
console.log( ` http://localhost:${config.outPort}` )
console.log( `https://localhost:${config.outPort}` )
console.log( ` http://localhost:${config.httpPort}` )
console.log( `https://localhost:${config.httpsPort}` )