// 实现一个最简单的代理，只支持http

// Implement a simplest proxy, only support http

var http = require('http');
var net = require('net');
var url = require('url');

let config = {
    proxyPort: 8888
}

function request(cReq, cRes) {
    var u = url.parse(cReq.url);

    var options = {
        hostname : u.hostname, 
        port     : u.port || 80,
        path     : u.path,       
        method   : cReq.method,
        headers  : cReq.headers
    };

    var pReq = http.request(options, function(pRes) {
        cRes.writeHead(pRes.statusCode, pRes.headers);
        pRes.pipe(cRes);
    }).on('error', function(e) {
        cRes.end();
    });

    cReq.pipe(pReq);
}

http.createServer()
    .on('request', request)
    .listen( config.proxyPort , '0.0.0.0');

console.log( `请将系统代理设置为：${config.proxyPort}` )