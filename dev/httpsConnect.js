// 使用 https.Connect测试https中的connect请求
// 隧道代理

var http = require('http');
var https = require('https');
var fs = require('fs');
var url = require('url');
var net = require('net');
var through2 = require('through2');

// visit the web as a proxy
function requestHttps(req, res) {
	console.log("requestHttps")
     var u = url.parse(req.url);
    
    var options = {
        hostname : u.hostname, 
        port     : u.port || 80,
        path     : u.path,       
        method   : req.method,
        headers  : req.headers
    };

// console.log( options )
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end("hello https")   
}

function connect(cReq, cSock){
    console.log( "We aren't support HTTPS!" )
    console.log( "connect：" + cReq.url )
    var u = url.parse('http://' + cReq.url);

    var pSock = net.connect(u.port, u.hostname, function() {
        cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        pSock
        .pipe( through2( (chunk,enc,cb )=>{
            // let data = chunk.toString();
            // console.log( data )
            // let newBuff = Buffer.from( stopDebugger(data) );
            // cb(null,newBuff)
            cb(null,chunk)
        }) )
        .pipe(cSock);
    }).on('error', function(e) {
        console.error("connect failed!")
        cSock.end();
    });

    cSock.pipe(pSock);
}

let config = {
    httpsPort: 9999,
    key: './cert/localhost.key',
    cert: './cert/localhost.crt'
}

var options = {
    key: fs.readFileSync( config.key ),
    cert: fs.readFileSync( config.cert ),
};

https.createServer(options)
    .on('request', requestHttps)
    .on("connect", connect)
    .listen(config.httpsPort, '0.0.0.0');

console.log( config.httpsPort )