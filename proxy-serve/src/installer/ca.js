// 安装CA证书
const os = require("os");
const fs = require("fs");

function win( caCertPath ){
	var exec = require('child_process').exec;
	let common = `certutil -addstore root ${caCertPath}`;
	exec( common, winInstallHandle);
}

function winInstallHandle( err, data ){
	if( err !== null ){
		console.log( err )
		console.log( "CA证书安装失败" )
	} else {
		// console.log( data.toString() )
		console.log( "已经尝试安装CA根证书" )
	}
}

function notSupport( platform ){
	console.error( `${platform} 平台暂不支持自动安装CA证书，请手动安装` )
}

// 检测证书是否存在
function isCertExits( caCertPath ){
	return fs.existsSync( caCertPath )
}

function install( caCertPath ){
	if( !isCertExits(caCertPath) ){
		console.error( `${caCertPath} CA证书不存在` )
		return false;
	}
	switch( os.type() ){
		case "Windows_NT":
			win( caCertPath );
			break;
		case "Darwin":
		case "Linux":
		default:
			notSupport( os.type() )
	}
}

module.exports = {
	install
}