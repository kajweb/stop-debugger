var http = require('http');
var url = require('url');
var zlib = require('zlib');
var through2 = require('through2');

// annotate debugger
function stopDebugger( data ){
	let regx = /(?<!")(debugger(?=\s*^"|\s*$|\s*;))(?:\s*;)?/gm;
	let newData = data.replace( regx, "/*debugger*/" );
	return newData;
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

// visit the web as a proxy
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

// StartProxy && Listening port
http.createServer().on('request', request).listen(8888, '0.0.0.0');