// 实现一个最简单的代理（只支持HTTPS）
// 拦截相关请求，并输出访问数据到控制台
// 部分网页乱码是由于没有启用gzip压缩

//Implement a simplest proxy (only supports HTTPS)
//Intercept related requests and output access data to the console
//Some webpages are garbled because gzip compression is not enabled

var http = require('http');
var net = require('net');
var url = require('url');

function request(cReq, cRes) {
    var u = url.parse(cReq.url);

    
    var options = {
        hostname : u.hostname, 
        port     : u.port || 80,
        path     : u.path,       
        method     : cReq.method,
        headers     : cReq.headers
    };

    let data = "";
    var pReq = http.request(options, function(pRes) {
        cRes.writeHead(pRes.statusCode, pRes.headers);
        // pRes.setEncoding('utf8');
        pRes.on('data', function (chunk) {
            data += chunk.toString();
        });
        pRes.on('end', function (chunk) {
            console.log(data)
            cRes.end(data)
        });

    })
    pReq.on('error', function(e) {
        console.log("请求出错")
        cRes.end();
    });
    pReq.end()
}


http.createServer().on('request', request).listen(8888, '0.0.0.0');