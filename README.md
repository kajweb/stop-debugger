# stop-debugger

一个禁止Chrome DevTools中执行debugger的拓展。

A Chrome Extension for disable the debugger function in Chrome DevTools。



## 使用说明

- 浏览器扩展

  浏览器拓展用于覆盖浏览器特征函数，浏览器拓展的源码在：`src`目录。

  [图文详解Chrome插件离线安装方法](https://huajiakeji.com/utilities/2019-01/1791.html)

  安装拓展完成后，需要开启扩展方可生效。

- Node代理端

  ```bash
  cd proxy-serve
  npm i
  node index.js
  ```




> https链接需要安装证书，否则可能访问异常。



## 目录结构

### depoly 

github部署页面，用于测试debugger

### proxy-serve

代理服务器代码，用于屏蔽debugger

### src

chrome拓展的源码



## 支持计划

可以在[deploy](./deploy/)，或者打开[在线测试页面](http://test.iwwee.com/debugger/extensionSet.html)

- [x] 不带分号的debugger

```js
let a = 1,b = 2;
debugger
let c = a+b;
```

- [x] 带分号的debugger
```js
let a = 1,b = 2;
debugger;
let c = a+b;
```

- [x] （多语句）后面还带语句的debugger
```js
let a = 1,b = 2;
debugger;let c = a+b;
```

- [x] （多语句）前面、后面还带语句的debugger
```js
let a = 1,b = 2;debugger;let c = a+b;
```

- [x] （多语句）前面还带语句的debugger
```js
let a = 1,b = 2;debugger
let c = a+b;
```

- [x] 使用Function生成的debugger
```js
let fn = new Function("debu"+"gger");
fn()
```

- [x] 使用Function生成的多参数debugger
```js
let fn = new Function("x","debugger");
fn()
```

- [x] 预防简单的检测

```js
let a = ";debugger;"
if( a!==";debug" + "ger;" ){
	console.log("用户行为异常")
}
debugger
```

- [x] 使用eval执行debugger

```js
eval("debugger");
```

- [x] 使用Function执行debugger

```js
Function.prototype.constructor("debugger")()
// 最简单的解决方法是 Function.prototype.constructor=function(){}
// https://blog.csdn.net/zhsworld/article/details/104660742
```


- [ ] 使用Function执行debugger（经过混淆）

```js
// http://www.sc.10086.cn/service/login.html

let _0x2764ed = {
	wcluU: "debu",
	tvBGO: "gger",
	tOyvN: "action",	
	vyxZy(a,b){return a+b}
}

function xhs__0x4f79(e){
	switch(e){
		case '0x1e3':
			return "constructor";
			break;
		case '0x5c6':
			return "vyxZy";
			break;
		case '0x5ca':
			return "wcluU";
			break;
		case '0x5d0':
			return "tOyvN";
			break;
		default:
			throw new RangeError( e );
			break;
	}
}

(function() {}[xhs__0x4f79('0x1e3')](_0x2764ed[xhs__0x4f79('0x5c6')](_0x2764ed[xhs__0x4f79('0x5ca')], _0x2764ed['\x74\x76\x42\x47\x4f']))['\x63\x61\x6c\x6c'](_0x2764ed[xhs__0x4f79('0x5d0')]));

(function() {}["constructor"]("debugger")["call"]("action"));
```

