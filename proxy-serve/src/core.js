const iconv = require("iconv-lite");

const Encoding = require('./encoding');


/**
 * 根据网页返回的contentType
 * 判断文档类型是否可修改
 * 处理对象：
 * 对包含 text、json、javascript
 * 不包含 css
 *
 * (Google Translate)
 * According to the contentType returned by the webpage
 * Determine whether the document type can be modified
 * Processing object:
 * To include text, json, javascript
 * Does not include css
 * 
 * @param 	{string} 	contentType	网页返回的header中的content-type
 * @return 	{boolean}	noVariables	返回是否需要修改的文档类型
 */
/*  May need to be optimized  */
function isDocModifiable( contentType ){
	// console.log( contentType )
	// return /(?:text|json|javascript)+/.test( contentType ) && !/css/.test(contentType )
	return /(?=.*(text|javascript|json)+)(^((?!css).)*$)/.test( contentType )
}


/**
 * @function 对函数的数据流进行处理 ，并调用stopDebugger注释debugger
 * @description [optimize] 匿名函数可能会调用多次，需要增加缓存
 *
 * (Google Translate)
 * @function Process the data flow of the function and call stopDebugger to annotate debugger
 * @description  The anonymous function may be called multiple times, and the cache needs to be increased
 * 
 * @param   {String}   	contentType  	header的contentType
 * @return  {Function}  through2 		through2调用的函数
 *
 * through2处理函数
 * @param 	{buffer} 	chunk	待处理的buffer
 * @param 	{string} 	enc		编码方式
 * @param 	{function} 	cb		callback 回调
 * @return 	{void}
 */
function pipeIconv( contentType ){
	var characterSet = false;
	return ( chunk, enc, cb )=>{
		console.log( chunk.toString() )
		let data = false;
		if( !characterSet ){
			let charsetObj = Encoding.getCharset( contentType, chunk );
			characterSet = charsetObj.characterSet;
			data = charsetObj.data;
		}
		data = data || iconv.decode( chunk, characterSet );
		let newString = stopDebugger( data );
		let newBuff = iconv.encode( newString, characterSet );
		cb( null, newBuff );
	}
}

function pipeIconv_old( chunk, enc, cb ){
	// 判断优先级
	// 如果header->meta->def
	// 如果meta->header->def
	// 如果默认

	// 获得默认编码
	// 用默认编码解析代码
	// 解析代码后获得正确的参数
	let data = iconv.decode( chunk, 'gb2312' );
	let newString = stopDebugger( data );
	let newBuff = iconv.encode( newString, 'gb2312' );
	cb( null, newBuff );
}

/**
 * 使用正则匹配、注释相应的函数
 *
 * (Google Translate)
 * Use regular matching and annotate corresponding functions
 *
 * @param 	{string} 	data	需要处理的网页内容
 * @return 	{string}	newData	经过处理的网页内容
 */
function stopDebugger( data ){
    let regx = /(?<!")(debugger(?=\s*^"|\s*$|\s*;))(?:\s*;)?/gm;
    let newData = data.replace( regx, "/*debugger*/" );
    return newData;
}

module.exports = {
	pipeIconv,
	stopDebugger,
	isDocModifiable
}