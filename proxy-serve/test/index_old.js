// 旧版本，不兼容https

var http = require('http');
var https = require('https');
var url = require('url');
var zlib = require('zlib');
var fs = require('fs');
var through2 = require('through2');
var net = require('net');

let outPort = 8887
let httpPort = 8888
let httpsPort = 8889
let httpsCert = {
    key: '../cert/private.key',
    cert: '../cert/public.crt'
}

// process stream
function through( chunk,enc,cb ){
	let data = chunk.toString();
	// console.log( data )
	let newBuff = Buffer.from( stopDebugger(data) );
	cb(null,newBuff)
}

// 获得网页的编码方式
function getContentEncoding( headers ){
	let contentEncoding = "";
	if (headers && headers['content-encoding'])
		contentEncoding = headers['content-encoding'];
    return contentEncoding;
}

// 获得压缩、解压的方法
function getZlib( contentEncoding ){
	switch( contentEncoding ){
    case 'gzip':
    	return { 
    		encoding: true, 
    		unzip: zlib.Gunzip(), 
    		zip: zlib.Gzip()
    	}
      break;
    case 'deflate':
    	return { 
    		encoding: true, 
    		unzip: zlib.Inflate(), 
    		zip: zlib.Deflate()
    	}
      break;
    case 'br':
    	return { 
    		encoding: true, 
    		unzip: zlib.BrotliDecompress && zlib.BrotliDecompress(),
    	 	zip: zlib.BrotliCompress && zlib.BrotliCompress() 
    	}
      break;
    case '':
    	return { encoding: false };
    default:
    	throw new Error("UnKnow content-encoding");
	}
}

// annotate debugger
function stopDebugger( data ){
    let regx = /(?<!")(debugger(?=\s*^"|\s*$|\s*;))(?:\s*;)?/gm;
    let newData = data.replace( regx, "/*debugger*/" );
    return newData;
}

// visit the web as a proxy
function request(cReq, cRes) {
    console.log( "request：" + cReq.url )
    var u = url.parse(cReq.url);
    
    var options = {
        hostname : u.hostname, 
        port     : u.port || 80,
        path     : u.path,       
        method   : cReq.method,
        headers  : cReq.headers
    };

    var pReq = http.request(options, function(pRes) {
        if ('content-length' in pRes.headers) {
            delete pRes.headers['content-length'];
        }
        cRes.writeHead(pRes.statusCode, pRes.headers);

        let contentEncoding = getContentEncoding(pRes.headers);
        let thisZlib = getZlib( contentEncoding );

        if( thisZlib.encoding ){
	        pRes.pipe(thisZlib.unzip)
		        .pipe(through2(through))
		        .pipe(thisZlib.zip)
		        .pipe(cRes);
        } else {
	        pRes.pipe(through2(through)).pipe(cRes);
        }
    }).on('error', function(e) {
    	console.error("ajax failed!")
        cRes.end();
    });

    pReq.end()
}


var options = {
    key: fs.readFileSync(httpsCert.key),
    cert: fs.readFileSync(httpsCert.cert),
};

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

// visit the web as a proxy
function requestHttps(req, res) {
     var u = url.parse(req.url);
    
    var options = {
        hostname : u.hostname, 
        port     : u.port || 80,
        path     : u.path,       
        method   : req.method,
        headers  : req.headers
    };

console.log( options )
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end("hello https")   
}


// StartProxy && Listening port
http.createServer().on('request', request).on("connect", connect).listen(httpPort, '0.0.0.0');
// https.createServer(options).on('request', request).on("connect", connect).listen(httpPort, '0.0.0.0');
// https.createServer(options).on('request', requestHttps).listen(httpsPort, '0.0.0.0');
