const zlib = require('zlib');
const iconv = require("iconv-lite");

const Config = require('./config');
const Inc = require('./inc');

let CharacterSetPriority = Config.characterSet.priority;
let CharacterSetDefault = Config.characterSet.default;
let IncCharacterSetPriority = Inc.config.characterSet.priority;

/**
 * 根据网页返回的contentEncoding获得压索算法
 * Obtain the compression algorithm according to the contentEncoding of the returned webpage
 * @param   {string}   contentEncoding  代理暴露地址
 * @return  {Object}   {}				压缩后的对象
 */
function getZlib( contentEncoding ){
	switch( contentEncoding ){
	    case 'gzip':
	    	return { 
	    		encoding: true, 
	    		unzip: zlib.Gunzip(), 
	    		zip: zlib.Gzip()
	    	}
	      break;
	    case 'deflate':
	    	return { 
	    		encoding: true, 
	    		unzip: zlib.Inflate(), 
	    		zip: zlib.Deflate()
	    	}
	      break;
	    case 'br':
	    	return { 
	    		encoding: true, 
	    		unzip: zlib.BrotliDecompress && zlib.BrotliDecompress(),
	    	 	zip: zlib.BrotliCompress && zlib.BrotliCompress() 
	    	}
	      break;
	    case '':
	    	return { encoding: false };
	    default:
	    	console.log( contentEncoding )
	    	throw new Error("UnKnow content-encoding");
	}
}

/**
 * 根据网页返回的header获得获得网页的编码方式( content-encoding )
 * Obtain the encoding method of the webpage according to the header returned by the webpage
 * @param   {Array}   headers  	headers
 * @return  {String}  function 	content-encoding
 */
function getContentEncoding( headers ){
    return getHeader( headers, "content-encoding" );
}

/**
 * 根据网页返回的header获得获得网页的类型( content-type )
 * Get the type of webpage based on the header returned by the webpage
 * @param   {Array}   headers  	headers
 * @return  {String}  function 	content-encoding
 */
function getContentType( headers ){
    return getHeader( headers, "content-type" );
}

/**
 * 根据headers与key获得value
 * Obtain value according to headers and key
 * @param   {Array}   headers  	headers
 * @param   {String}  key	  	headers数组的key
 * @return  {String}  function 	content-encoding
 */
function getHeader( headers, key ){
    let value = "";
    if (headers && headers[key])
        value = headers[key];
    return value;
}

/**
 * [optimize] Need to be more elegant
 * 获得网页的Charset
 * @param   {String}   	contentType  	header的contentType
 * @param   {Buffer}   	chunk  			网页的内容
 * @return  {Objcet}  	iconvObj 		网页的Charset，网页String(当为Meta获取)
 * 						{ characterSet, data }
 */
function getCharset( contentType, chunk ){
	let pageObj = getPageCharset( contentType, chunk );
	let iconvObj = {
		data: 	 		pageObj.data,
		characterSet: 	pageObj.data? pageObj.characterSet : resetCharsetToIconv( pageObj.characterSet )
	}
	return iconvObj;
}


/**
 * [optimize] Need to be more elegant
 * 获得网页的Charset
 * @param   {String}   	contentType  	header的contentType
 * @param   {Buffer}   	chunk  			网页的内容
 * @return  {Objcet}  	pageObj 		网页的Charset，网页String(当为Meta获取)
 * 						{ characterSet, data }
 */
function getPageCharset( contentType, chunk ){
	let characterSet = false;
	let data = false;
	if( CharacterSetPriority == IncCharacterSetPriority.default ){
		// 优先默认设置
		characterSet = CharacterSetDefault;
	}
	if( !characterSet && (CharacterSetPriority==IncCharacterSetPriority.header) ){
		// 优先头搜索
		characterSet = getCharsetFromContentType( contentType );
	}
	if( !characterSet ){
		// 优先头搜索无结果，进行meta搜索
		// 优先meta搜索
		let pageObj = getCharsetFromMeta( chunk, CharacterSetDefault );
		characterSet = pageObj.result ? pageObj.enc : false;
		data == pageObj.result? pageObj.data: data;
	}
	if( !characterSet && (CharacterSetPriority==IncCharacterSetPriority.meta) ){
		// 优先meta搜索无结果，进行头搜索
		characterSet = getCharsetFromContentType( contentType );
	}
	if( !characterSet ){
		// 返回默认结果
		characterSet = CharacterSetDefault;
	}
	return { characterSet, data };
}

/**
 * 从头部的contentType搜索charset
 * Search the character set from the contentType of the head
 * @param   {String}   			contentType  		header的contentType
 * @return  {String|Boolean}  	regResult[1]|false 	搜索成功，返回Charset，失败返回null
 */
function getCharsetFromContentType( contentType ){
	let regExp = /charset=\s*([a-zA-z0-9\-\_]+)/i;
	let regResult = contentType.match( regExp );
	return regResult?regResult[1]:false;
}

/**
 * 从网页搜索charset
 * Search the character set from the contentType of the head
 * @param   {Buffer}   			chunk  			网页的Buffer
 * @param   {String}   			contentType  	header的contentType
 * @return  {Object|false}  	pageObj 		搜索成功，网页String、搜索加密方式和搜索结果
 *								{ data, enc, result }
 */
function getCharsetFromMeta( chunk, characterSetDefault ){
	let enc = resetCharsetToIconv( characterSetDefault );
	let data = iconv.decode( chunk, enc );
	let regExp = /<meta[^>]*?charset=(["\']?)([a-zA-z0-9\-\_]+)(\1)[^>]*?>/is;
	let regResult = data.match( regExp );
	let pageObj = { data, enc };
	if( regResult ){
		pageObj.enc = regResult[2];
		pageObj.result = true;
	} else {
		pageObj.result = false;
	}
	return pageObj;
}

/**
 * 将Charset变为iconv支持的写法
 * @param   {String}   	Charset
 * @return  {String}  	iconvCharset
 * 
 * Noitce: 如果因为字符集报错，请根据iconv-lite重写字符集
 * https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings
 */
function resetCharsetToIconv( charset ){
	charset = charset.toLowerCase();
	console.log( `[resetChrasetToIconv] ${charset}` );
	return charset;
}

module.exports = {
	getZlib,
	getContentEncoding,
	getContentType,
	getCharset,
}