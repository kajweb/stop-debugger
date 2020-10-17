// 废弃不用的函数列表

function main( proxyAddr, proxyPort ){
	Promise.all([
	    createServer.createHttpProxyServer(),
	    createServer.createHttpsProxyServer( proxyAddr ),
	    createServer.createdSNIHttpServer()
	]).then(( [httpServer, httpsServer, SNIServer] )=>{
		httpServer.on("request", tempRequestHandle)
		SNIServer.on("request", tempRequestHandle)
		httpsServer.on('connect', connect.bind({
            SNIServerPort: SNIServer.address().port,
        }))
		return [httpServer, httpsServer, SNIServer];
	}).then(( [httpServer, httpsServer, SNIServer] )=>{
		let httpServerPort = httpServer.address().port;
		let httpsServerPort = httpsServer.address().port;
		createServer.createdDiversionServer( proxyPort, httpServerPort, httpsServerPort )
		return [httpServer, httpsServer, SNIServer];
	}).then(([httpServer, httpsServer, SNIServer])=>{
		console.log( `Diversion: \t http[s]://${proxyAddr}:${proxyPort}` )
		console.log( `httpServer: \t http://${proxyAddr}:${httpServer.address().port}` )
		console.log( `httpsServer: \t https://${proxyAddr}:${httpsServer.address().port}` )
		console.log( `SNIServer: \t https://${proxyAddr}:${SNIServer.address().port}` )
		console.log("everything is ok")
	})
}

