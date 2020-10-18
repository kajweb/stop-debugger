// 判断文档类型是否可修改
function isDocModifiable( contentType ){
	return /(?:text)+(?:json)+(?:javascript)+(?:javascript)+/.test( contentType )  &&
				!/css/.test(contentType )
}

// process stream
function pipe( chunk,enc,cb ){
	let data = chunk.toString();
	// console.log( data )
	let newBuff = Buffer.from( stopDebugger(data) );
	cb(null,newBuff)
}

// annotate debugger
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