const CreateServer = require( "./src/createServer" );

function main(){
	CreateServer.start()
	.then( ([servers, ports]) => {
		console.log( `Diversion:  \t http[s]://${servers}:${ports}` );
		console.log( `HttpServer: \t http:   //${servers}:${ports.http}` );
		console.log( `HttpsServer:\t https:  //${servers}:${ports.https}` );
		console.log( `SNIServer:  \t https:  //${servers}:${ports.SNI}` );
		console.log( "\nAll Services Are Started, But One Step Away: " );
		console.log( "\nPlease Set Up [system Agent]\nand Test Whether The Service Is Available." );
	})
}

main();