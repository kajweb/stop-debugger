var https = require('https');
var Iconv = require('iconv-lite');
var url = require('url');


var u = url.parse( "https://zhidao.baidu.com" );
let opt = {
    hostname : u.hostname, 
    port     : u.port || 443,
    path     : u.path,       
    method   : "GET",
    encoding: null,
}
var pReq = https.request( opt, function(pRes) {
	let str = [];
	pRes.on("data",e=>{
		// console.log(e)
		str.push(e);
	})
	pRes.on("end",e=>{
		// console.log( str )
		// let title = str.split("title")[1].split("</")[0]
		// console.log( title )
		var decodedBody = Iconv.decode(Buffer.concat(str), 'gbk');
		console.log( decodedBody )
		// console.log( Iconv.decode(str, 'gb2312').toString() )
		// console.log( Iconv.decode(title, 'gbk').toString() )
	})
}).end();