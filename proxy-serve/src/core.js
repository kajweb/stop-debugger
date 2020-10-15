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
 *  对函数的数据流进行处理
 *  并调用stopDebugger注释debugger
 * 
 * (Google Translate)
 * Process the data flow of the function
 * And call stopDebugger to comment debugger
 * 
 * through2处理函数
 *
 * @param 	{buffer} 	chunk	待处理的buffer
 * @param 	{string} 	enc		编码方式
 * @param 	{function} 	cb		callback 回调
 * @return 	{void}
 */
function pipe( chunk, enc, cb ){
	let data = chunk.toString();
	// console.log( data )
	let newBuff = Buffer.from( stopDebugger(data) );
	cb(null,newBuff)
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
	pipe,
	stopDebugger,
	isDocModifiable
}