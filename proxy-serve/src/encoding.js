var zlib = require('zlib');

// 获得压缩、解压的方法
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
		    console.log("[getZlib] No Encoding")
	    	return { encoding: false };
	    default:
	    	console.log( contentEncoding )
	    	throw new Error("UnKnow content-encoding");
	}
}

// 获得网页的编码方式
function getContentEncoding( headers ){
    return getHeader( headers, "content-encoding" );
}

// 获得网页的类型
function getContentType( headers ){
    return getHeader( headers, "content-type" );
}

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