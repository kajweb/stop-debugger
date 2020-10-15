console.log("拦截任务启动")


Function.prototype.constructor=function(){}
console.log("拦截方法1已启动")

Function = (function(oldFn){
	return function(e){
		if( e=="debugger" ){
			return ()=>{console.log("can't exec debugger")};
		}
        console.log(e)
		return new oldFn(e)
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