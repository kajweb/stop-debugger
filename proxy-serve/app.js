const CreateServer = require( "./src/createServer" );

function main(){
	CreateServer.start()
	.then( ([servers, ports]) => {
		console.log( `代理服务器: 	\t  http[s]://${servers}:${ports}` );
		console.log( `HTTP服务器: 	\t  http:   //${servers}:${ports.http}` );
		console.log( `HTTPS服务器: 	\t  https:  //${servers}:${ports.https}` );
		console.log( `SNI服务器:   	\t  https:  //${servers}:${ports.SNI}` );
		console.log( "\n所有服务都已启动，但只有还差一步：" );
		console.log( "\n请设置【系统代理】 \n并测试该服务是否可用。" );
	})
}

main();