const net = require('net');
const http = require('http');
const https = require('https');
const url = require('url');
const through2 = require('through2');

const Encoding = require('./encoding');
const Core = require('./core');
const Config = require('./config');

var clRequest = Config.log.request;

/**
 * 【HTTP】请求到HTTP服务器的请求执行的操作
 * [HTTP] Request to HTTP server
 * @param   {http.ClientRequest}    cReq
 * @param   {http.ServerResponse}   cRes
 * @return  {Void}
 */
function httpReques( cReq, cRes ) {
    var u = url.parse(cReq.url);
    var options = {
        hostname : u.hostname, 
        port     : u.port || 80,
    };
    clRequest && console.log( `【HttpRequest】${cReq.url}` );
    requestProcess( cReq, cRes, http, options );
}

/**
 * 【HTTPS】请求到SNI服务器的请求执行的操作
 * [HTTPS] Request to SNI server
 * @param   {http.ClientRequest}    cReq
 * @param   {http.ServerResponse}   cRes
 * @return  {Void}
 */
function SNIServer( cReq, cRes ){

    var u = url.parse(cReq.url);
    var options = {
        hostname : cReq.headers.host, 
        port     : u.port || 443,
    };
    clRequest && console.log( `【HttpsRequest】${options.hostname}:${options.port}${cReq.url}` );
    requestProcess( cReq, cRes, https, options );
}

/**
 * 合并url参数
 * Combine url parameters
 * @param   {http.ClientRequest}   cReq
 * @param   {Object}               options
 * @return  {Object}               Object.assign()
 */
function optionsAssign( cReq, options ){
    var u = url.parse(cReq.url);
    return Object.assign( options, {
        path     : u.path,       
        method   : cReq.method,
        headers  : cReq.headers
    });
}

/**
 * 处理请求，对请求执行解密、处理、加密操作
 * Process the request, perform decryption, processing, and encryption operations on the request
 * @param   {http.ClientRequest}   cReq
 * @param   {http.ServerResponse}  cRes
 * @param   {Object}               requestObj   执行request的模块（如http、https、net模块）
 * @param   {Object}               options      url参数
 * @return  {Void}
 */
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
            pRes.pipe(thisZlib.unzip)
                .pipe(through2(Core.pipe))
                .pipe(thisZlib.zip)
                .pipe(cRes);
        } else if( isDocModifiable ){
            pRes.pipe(through2(Core.pipe)).pipe(cRes);
        } else {
            pRes.pipe(cRes);
        }
    })
    pReq.on('error', (err)=>{
        console.error(`[${err.code}] Failed to requestProcess`);
    })
    pReq.end();
}

module.exports = {
	httpReques,
    SNIServer
}