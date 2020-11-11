中文　　[English](docs/README_EN.md)  

<p align="right">你是第 <img align="center"  alt="visitors" src="https://visitor-badge.glitch.me/badge?page_id=kajweb/stop-debugger" /> 个（次）人浏览 stop-debugger.</p>

# stop-debugger

<img src="https://i.loli.net/2020/10/30/bF3u8VDjAkiqQIt.png" width="200">

一个**禁止**`Chrome DevTools`中执行**debugger**的拓展和`系统代理`。

A `Chrome Extension` and `system proxy`  for **disable** the **debugger** function in `Chrome DevTools`。



## 运行效果

- 未使用程序

![TurnOff.gif](https://i.loli.net/2020/10/28/YpXkGZhVa5Hi6Lx.gif)

- 使用程序

![TurnOn.gif](https://i.loli.net/2020/10/28/TIqopWDmUzKrO5k.gif)



## 原理架构

- Proxy


![theory.png](https://i.loli.net/2020/11/11/YwHRDBWr2eVmn3f.png)


## 使用说明

本程序分为两个部分：`chrome浏览器拓展`和`Node系统代理`。  

- chrome浏览器扩展

  `chrome浏览器拓展`用于覆盖浏览器特征函数，浏览器拓展的源码在：`chrome-extension`目录。使用前需要将该拓展安装到浏览器中，安装拓展完成后，需要开启扩展方可生效。  

  [图文详解Chrome插件离线安装方法](https://huajiakeji.com/utilities/2019-01/1791.html)

- Node系统代理端

  `Node系统代理`用于处理javascript`、`html`、`json`等文件中出现的`debugger`，使用特定的正则表达式对`debugger`进行匹配，并注释相应的代码。
  
```bash
  git clone https://github.com/kajweb/stop-debugger.git
  cd stop-debugger/proxy-serve 
  npm i
  npm run cn
```




> https链接需要安装证书到`受信任的根证书颁发机构`，否则可能无法处理HTTPS请求。
>
> 对于`win7`、`win10`系统，会在Node客户端运行时调用系统程序导入证书到系统中。
>
> 其他系统暂时不支持自动导入证书。



## 测试地址

我们提供一个功能相对丰富的测试页面用来测试debugger，您可以打开`Chrome DevTools`控制台，点击相应的项查看运行结果。

[debugger可用性测试地址](https://kajweb.github.io/stop-debugger)



## 目录结构

|       目录名称       | 作用                                                         |
| :------------------: | :----------------------------------------------------------- |
|      **depoly**      | github page部署页面，用于提供给开发者测试debugger运行情况    |
|   **proxy-serve**    | Node代理服务器代码。用于屏蔽明文的debugger                   |
| **chrome-extension** | chrome拓展的源码。用于屏蔽特定能执行`debugger`方法的函数，   |
|                      | 如`Function()`、`eval()`、`Function.prototype.constructor`等方法 |
|       **cert**       | 证书目录。用于生成CA证书与对客户端证书进行签名的代码。       |
|                      | 事实上，已经将生成好的CA证书从`/cert/ca`复制到了`/proxy-serve/src/cert`。 |
|                      | 后续客户端签发证书通过`/proxy-serve/src/cert/index.js`进行接管，开发者无需过多关注此目录。 |
|       **dev**        | 程序测试开发目录，里面绝大部分都是没有意义的代码。           |
|                      | 仅仅用于在开发过程中进行的各种实验性的测试，开发者无需过多关注此目录。 |
|       **docs**       | 系统文档目录，覆盖各种语言的文档、                           |



## 支持计划

可以在[deploy](deploy)，或者打开[在线测试页面](http://test.iwwee.com/debugger/extensionSet.html)

- - [x] 不带分号的debugger


> 此类型代码使用`proxy-serve`进行处理
```js
let a = 1,b = 2;
debugger
let c = a+b;
```

- - [x] 带分号的debugger

>此类型代码使用`proxy-serve`进行处理

```js
let a = 1,b = 2;
debugger;
let c = a+b;
```

- - [x] （多语句）后面还带语句的debugger

>此类型代码使用`proxy-serve`进行处理


```js
let a = 1,b = 2;
debugger;let c = a+b;
```

- - [x] （多语句）前面、后面还带语句的debugger

>此类型代码使用`proxy-serve`进行处理


```js
let a = 1,b = 2;debugger;let c = a+b;
```

- - [x] （多语句）前面还带语句的debugger

>此类型代码使用`proxy-serve`进行处理


```js
let a = 1,b = 2;debugger
let c = a+b;
```

- - [x]  使用Function生成的debugger

>此类型代码使用`chrome-extension`进行处理


```js
let fn = new Function("debu"+"gger");
fn()
```

- - [x] 使用Function生成的多参数debugger

>此类型代码使用`chrome-extension`进行处理

```js
let fn = new Function("x","debugger");
fn()
```

- - [x] 预防简单的检测

>此类型代码使用`chrome-extension`进行处理

```js
let a = ";debugger;"
if( a!==";debug" + "ger;" ){
	console.log("用户行为异常")
}
debugger
```

- - [x] 使用eval执行debugger

>此类型代码使用`chrome-extension`进行处理

```js
eval("debugger");
```

- - [x] 使用Function执行debugger

>此类型代码使用`chrome-extension`进行处理

```js
// https://blog.csdn.net/zhsworld/article/details/104660742
Function.prototype.constructor("debugger")()
```


- [ ] 使用Function执行debugger（经过混淆）

>此类型代码将使用`chrome-extension`进行处理

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



## 实现原理

[RSS源](https://blog.iwwee.com/atom.xml)： 如果您对本程序的实现原理感兴趣，请关注[我的博客(kajweb - iwwee)](https://blog.iwwee.com)。  
我将不定时地更新本程序的思想、开发过程和思想原理。



**博文列表：**

- [ ] 【stop-debugger】debugger介绍
- [ ] 【stop-debugger】浏览器拓展的安装与开发
- [ ] 【stop-debugger】HTTP代理原理及实现方法
- [ ] 【stop-debugger】中间人攻击
- [ ] 【stop-debugger】HTTP与HTTPS代理中的差异及细节
- [ ] 【stop-debugger】实现一个最简单的HTTP代理
- [ ] 【stop-debugger】实现一个最简单的HTTPS代理
- [ ] 【stop-debugger】普通代理与隧道代理
- [ ] 【stop-debugger】HTTP和HTTPS共用一个端口原理及实现
- [ ] 【stop-debugger】……
