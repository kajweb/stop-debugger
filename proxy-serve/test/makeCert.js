// 生成客户端证书

// Generate client certificates

const fs = require('fs');
const path = require('path');
const getServerCert = require('../src/cert');

const config = {
	domain: "localhost",
	serverCrt: {
		key: './cert/localhost.key',
		cert: './cert/localhost.crt'
	}
}

try {
    fs.mkdirSync( path.resolve(__dirname,'cert') );
} catch (e) {
	console.log( "The server cert folder already exists!" )
}

let serverCert = getServerCert( config.domain );

fs.writeFileSync( path.resolve(__dirname,config.serverCrt.key) , serverCert.key );
fs.writeFileSync( path.resolve(__dirname,config.serverCrt.cert), serverCert.cert );

console.log( "[Done] Generate client certificates." )
console.log( `serverCert.key : ${ path.resolve( config.serverCrt.key ) }` )
console.log( `serverCert.cert: ${ path.resolve( config.serverCrt.cert ) }` )