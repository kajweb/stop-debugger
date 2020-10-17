const createServer = require( "./src/createServer" );

function main( proxyAddr, proxyPort ){
	createServer.start( proxyAddr, proxyPort )
	.then( ([servers, ports]) => {
		console.log( `Diversion:  \t http[s]://${proxyAddr}:${proxyPort}` )
		console.log( `httpServer: \t    http://${proxyAddr}:${ports.http}` )
		console.log( `httpsServer:\t   https://${proxyAddr}:${ports.https}` )
		console.log( `SNIServer:  \t   https://${proxyAddr}:${ports.SNI}` )
		console.log("everything is ok")
	})
}

let proxyAddr = "localhost";
let proxyPort = 8888;
main( proxyAddr, proxyPort );