const net = require('net');
const http = require('http');
const https = require('https');
var url = require('url');
var through2 = require('through2');

var Encoding = require('./encoding');
var Core = require('./core');

// 请求到HTTP服务器的请求（HTTP）
function httpReques( cReq, cRes ) {
    console.log("Http Request Http");
	console.log( "request：" + cReq.url );

    var u = url.parse(cReq.url);
    var options = {
        hostname : u.hostname, 
        port     : u.port || 80,
    };
    requestProcess( cReq, cRes, http, options );
}


// 请求到SNI服务器的请求（HTTPS）
function SNIServer( cReq, cRes ){
    console.log("SNIServer")
    console.log( "request：" + cReq.url )
    var u = url.parse(cReq.url);
    var options = {
        hostname : cReq.headers.host, 
        port     : u.port || 443,
    };
    requestProcess( cReq, cRes, https, options );
}

function optionsAssign( cReq, options ){
    var u = url.parse(cReq.url);
    return Object.assign( options, {
        path     : u.path,       
        method   : cReq.method,
        headers  : cReq.headers
    });
}

function requestProcess( cReq, cRes, requestObj, options ){
    let newOptions = optionsAssign( cReq, options );
    var pReq = requestObj.request(options, function(pRes) {
        if ('content-length' in pRes.headers) {
            delete pRes.headers['content-length'];
        }
        cRes.writeHead( pRes.statusCode, pRes.headers );
        let contentEncoding = Encoding.getContentEncoding(pRes.headers);
        let thisZlib = Encoding.getZlib( contentEncoding );
        let contentType = Encoding.getContentType(pRes.headers);
        let isDocModifiable = Core.isDocModifiable( contentType );
        if( isDocModifiable && thisZlib.encoding ){
            console.log("pip: utz")
            pRes.pipe(thisZlib.unzip)
                .pipe(through2(Core.pipe))
                .pipe(thisZlib.zip)
                .pipe(cRes);
        } else if( isDocModifiable ){
            console.log("pip: t")
            pRes.pipe(through2(Core.pipe)).pipe(cRes);
        } else {
            console.log("pip: null")
            pRes.pipe(cRes);
        }
    })
    pReq.on('error', (err)=>{
        if( err.code == "ENOTFOUND" ){
            console.error("[ENOTFOUND] Failed to requestProcess");
        } else {
            console.error(`[${err.code}] Failed to requestProcess`);
        }
    })
    pReq.end();
}

module.exports = {
	httpReques,
    SNIServer
}