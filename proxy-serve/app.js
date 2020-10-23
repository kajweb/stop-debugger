/**
 * 接受命令行的参数，指定语言
 * npm run zh_CN       |   npm run en
 * node app.js zh_CN   |   node app.js en
 */
const CreateServer = require( "./src/createServer" );

/**
 * 根据命令行参数读取语言包
 * Read language packs based on command line parameters
 */
let languages = process.argv[2] || "zh_CN";
let i18n;
try{
	i18n = require("./src/lang/" + languages);
	process.env.i18n = i18n;
} catch (e){
	console.log("Failed to open language pack")
	process.exit();
}

/**
 * 启动代理服务
 * Start proxy service
 * @param   {string}   proxyAddr  代理暴露地址
 * @param   {string}   proxyAddr  代理暴露地址
 * @param   {number}   proxyPort  代理暴露端口
 * @return  {void}
 */
function main( proxyAddr=false, proxyPort=false ){
	CreateServer.start( proxyAddr, proxyPort )
	.then( ([servers, ports]) => {
		console.log( `${i18n.Diversion}:\t  http[s]://${servers}:${ports}` );
		console.log( `${i18n.HttpServer}:\t  http:   //${servers}:${ports.http}` );
		console.log( `${i18n.HttpsServer}:\t  https:  //${servers}:${ports.https}` );
		console.log( `${i18n.SNIServer}:  \t  https:  //${servers}:${ports.SNI}` );
		console.log( `${i18n.BeforeStart}` );
		console.log( `${i18n.SettingStart} http[s]://${servers}:${ports}` );
		console.log( `${i18n.TestStart}\n` );
	}).catch(e=>{
		console.warn( `启动服务器失败` );
	});
}

/**
 * 启动程序
 * starting program
 */
main();