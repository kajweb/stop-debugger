const CreateServer = require( "./src/createServer" );

function main(){
	CreateServer.start()
	.then( ([servers, ports]) => {
		console.log( `Diversion:  \t http[s]://${servers}:${ports}` )
		console.log( `httpServer: \t    http://${servers}:${ports.http}` )
		console.log( `httpsServer:\t   https://${servers}:${ports.https}` )
		console.log( `SNIServer:  \t   https://${servers}:${ports.SNI}` )
		console.log("everything is ok")
	})
}

main();