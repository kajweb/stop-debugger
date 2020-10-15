console.log("拦截任务启动")

// Function.prototype.constructor=function(){}
let config = {
	console: false,
	setInterval: 1000
};

let _constructor = Function.prototype.constructor;
Function.prototype.constructor = function() {
    var arg = arguments[0];
    if (arg) {
        if (arg.includes('debugger')) {
		    let regx = /(?<!")(debugger(?=\s*^"|\s*$|\s*;))(?:\s*;)?/gm;
		    arg = arg.replace( regx, "/*debugger*/" );
		    let args = [...arguments]
		    args.slice(1).unshift( arg );
		    config.console && console.log('%c 【stop-debugger】 ','background:#000;color:#fff','拦截成功');
		    config.console && console.log('%c 【拦截后的语句为】 ',
		    	'background:#000;color:#fff',
		    	arg,
		    );
            return _constructor.apply(this, [arg] );
        }
    }
	console.log('%c 【stop-debugger】 ','background:red;color:#fff','拦截方法1已启动');
    return _constructor.apply(this, arguments);
};

let _setInterval = window.setInterval;
window.setInterval = function(){
	// return false;
	// let fn = arguments[0];
	// let milliseconds = arguments[1];
	// if( !milliseconds || milliseconds<config.setInterval ){
	// 	milliseconds = config.setInterval;
	// }
	// console.log( milliseconds )
	// _setInterval.call( this, fn, milliseconds );
}

let _setTimeout = window.setTimeout;
window.setTimeout = function(){
	// let fn = arguments[0];
	// let milliseconds = arguments[1];
	// console.log( milliseconds )
	// console.log( fn )
}

Function.prototype.constructor("debugger")()


Function = (function(oldFn){
	return function(){
		if( arguments[0]=="debugger" ){
			return ()=>{console.log("can't exec debugger")};
		}
		return new oldFn(arguments)
	}
})(Function)
console.log("拦截方法2已启动")


eval = (function(oldFn){
	return function(e){
		if( e=="debugger" ){
			return console.log("can't exec debugger");
		}
		console.log(e)
		return oldFn(e)
	}
})(eval)
console.log("拦截方法3已启动")