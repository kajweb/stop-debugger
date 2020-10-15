// This file is not used
// 使用express对页面进行代理，并替换相关内容
// Use express to proxy the page and replace related content

var express = require('express');
var request = require('request')
var bodyParser = require("body-parser");  

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));  

// 首页
app.get('/', function(req, res) {
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
	let url = req.query.url;
	console.log( url )
	var reqOptions = { 
	    url: url,
	    encoding: null
	};
	request(reqOptions, function (error, response, body) {
		// console.log( response )
		res.end( stopDebugger(body.toString()) );
	});
});

function stopDebugger( data ){
	let regx = /(?<!")(debugger(?=\s*^"|\s*$|\s*;))(?:\s*;)?/gm;
	let newData = data.replace( regx, "/*debugger*/" );
	return newData;
}

app.listen(9600);