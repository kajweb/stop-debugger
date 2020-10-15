const config = require('../config');

const ca = require('./ca');

// 第一次执行程序时会运行
function once(){
    // Nothing
}

// 每次启动程序的时候会运行
function each(){
    // 安装CA证书
    ca.install( config.caCert )
}

module.exports = {
    once,
    each
}