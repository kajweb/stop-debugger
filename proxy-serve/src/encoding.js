const zlib = require('zlib');

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

module.exports = {
	getZlib,
	getContentEncoding,
	getContentType
}