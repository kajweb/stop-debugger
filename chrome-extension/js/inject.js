console.log('%c 【stop-debugger】 ','background:#000;color:#fff','启动');

let config = {
	console: true,
	consoleStart: true,
	setInterval: 1000,
	consoleLockTimer: 1000
};

// 尝试阻止无限console
// console.log = (function( oldFn ){
// 	var consoleLock = false;
// 	var consoleCache = [];
// 	return function(){
// 		if( consoleLock ){
// 			consoleCache.push( [...arguments] )
// 			return false;
// 		}
// 		consoleLock = setTimeout(()=>{
// 			if( consoleCache.length && false ){
// 				console.group( "开始输出" )
// 				consoleCache.map(e=>{
// 					oldFn.apply( this, e )
// 				})
// 				consoleCache = [];
// 				console.groupEnd()
// 			}
// 			consoleLock = false;
// 		}, config.consoleLockTimer)

// 	}
// })(console.log)


// setTimeout(()=>{
// 	console.log = null
// },3000)

// Function.prototype.constructor("debugger")()
Function.prototype.constructor = (function( oldFn ) {
	return function(){
		if( arguments[0] !== 'debugger' ){
			console.log( arguments )
	    	return oldFn.apply(this, arguments);
		}
		return false;

		let args = [...arguments]
	    let arg = args[0];
	    if (arg) {
	        if (arg.includes('debugger')) {
	        	arg = annotateDebugger( arg );
			    args.splice( 0, 1, arg );
			    successInterception( "constructor", arg );
	        }
	    }
	    return oldFn.apply(this, args);
    }
})(Function.prototype.constructor);
successStart( "拦截方法1" );


Function = (function( oldFn ){
	return function(){
		console.log( arguments )
		return oldFn.apply( this, arguments )

		let args = [...arguments];
		let arg = args[args.length-1];
		if( arg.includes("debugger") ){
			arg = annotateDebugger( arg );
			args.splice( args.length-1, 1, arg );
		    successInterception( "Function", arg );
		}
		return oldFn.apply( this, args )
	}
})(Function)
successStart( "拦截方法2" );

eval = (function( oldFn ){
	return function( arg ){
		console.log( arguments )
		return oldFn.apply( this, arguments )

		if( arg.includes("debugger") ){
			arg = annotateDebugger( arg );
		    successInterception( "eval", arg );
		}
		oldFn.call( this, arg );
	}
})(eval)
successStart( "拦截方法3" );

let _setInterval = window.setInterval;
// window.setInterval = function(){
	// return false;
	// let fn = arguments[0];
	// let milliseconds = arguments[1];
	// if( !milliseconds || milliseconds<config.setInterval ){
	// 	milliseconds = config.setInterval;
	// }
	// console.log( milliseconds )
	// _setInterval.call( this, fn, milliseconds );
// }

let _setTimeout = window.setTimeout;
// window.setTimeout = function(){
	// let fn = arguments[0];
	// let milliseconds = arguments[1];
	// console.log( milliseconds )
	// console.log( fn )
// }

// 注释debugger
function annotateDebugger( str ){
    let regx = /(?<!")(debugger(?=\s*^"|\s*$|\s*;))(?:\s*;)?/gm;
    return str.replace( regx, "/*debugger*/" );
}

// 拦截成功时的提醒
function successInterception( type, arg ){
	if( !config.console )
		return false;
    console.log(
    	'%c 【stop-debugger】 ',
    	'background:#000;color:#fff',
    	`${type} 拦截成功`
    );
    console.log(
    	'%c 【拦截后的语句为】 ',
    	'background:#000;color:#fff',
    	arg,
    );
}

// 启动拦截时的提醒
function successStart( type ){
	if( !config.consoleStart )
		return false;
	console.log(
		'%c 【stop-debugger】 ',
		'background:red;color:#fff',
		`${type}已启动`
	);
}