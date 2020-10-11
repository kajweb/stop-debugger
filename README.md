# stop-debugger

一个禁止Chrome DevTools中执行debugger的拓展。

A Chrome Extension for disable the debugger function in Chrome DevTools。



## 使用说明

还在写完



## 目录结构

### depoly 

github部署页面，用于测试debugger



### src

chrome拓展的源码



## 支持计划

可以在[deploy](./deploy/)，或者打开[在线测试页面](http://test.iwwee.com/debugger/extensionSet.html)

- [ ] 不带分号的debugger

```js
let a = 1,b = 2;
debugger
let c = a+b;
```

- [ ] 带分号的debugger
```js
let a = 1,b = 2;
debugger;
let c = a+b;
```

- [ ] （多语句）后面还带语句的debugger
```js
let a = 1,b = 2;
debugger;let c = a+b;
```

- [ ] （多语句）前面、后面还带语句的debugger
```js
let a = 1,b = 2;debugger;let c = a+b;
```

- [ ] （多语句）前面还带语句的debugger
```js
let a = 1,b = 2;debugger
let c = a+b;
```

- [ ] 使用Function生成的debugger
```js
let fn = new Function("debu"+"gger");
fn()
```

- [ ] 使用Function生成的多参数debugger
```js
let fn = new Function("x","debugger");
fn()
```

- [ ] 预防简单的检测

```js
let a = ";debugger;"
if( a!==";debug" + "ger;" ){
	console.log("用户行为异常")
}
debugger
```
