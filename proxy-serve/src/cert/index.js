// 通过CA证书生成server证书
// Generate the Server certificate from the CA certificate

const fs = require('fs');
const forge = require('node-forge');
const path = require('path');

const config = require('../config');
const utils = require('../utils');

// 读取 CA证书，后面需要根据它创建域名证书
// decrypts a PEM-formatted, encrypted private key
// const caKey = forge.pki.decryptRsaPrivateKey(fs.readFileSync(path.resolve(__dirname, config.caKey)));
const caKey = forge.pki.decryptRsaPrivateKey(fs.readFileSync( config.caKey ));
// convert a Forge certificate from PEM
// const caCert = forge.pki.certificateFromPem(fs.readFileSync(path.resolve(__dirname, config.caCert)));
const caCert = forge.pki.certificateFromPem(fs.readFileSync( config.caCert ));

// 证书缓存列表
const certCache = {};

// 判断证书时候已经被生成
function isCertExite( domain ){
	return certCache[domain] ? true : false;
}

// 判断证书时候已经被生成
function getCert( domain ){
	if( certCache[domain] ){
		return certCache[domain];
	}
	return createServerCertificate( domain );
}


// 缓存生成的证书
function setCert( domain, key, cert ){
	let _cached = {
		key,
		cert
	};
	certCache[ domain ] = _cached
	return _cached;
}

// 生成证书序列号
/*
	NOTE: serialNumber is the hex encoded value of an ASN.1 INTEGER.
	Conforming CAs should ensure serialNumber is:
	- no more than 20 octets
	- non-negative (prefix a '00' if your value starts with a '1' bit)
*/
function getSerialNumber(){
	return `${new Date().getTime()}`;
}

// 生成证书有效期
function getNotBeforeDate(){
	let notBeforeDate = new Date();
	return notBeforeDate;
}

// 生成证书有效期结束时间
function getNotAfterDate(){
	let notAfterDate = new Date();
	notAfterDate.setFullYear( notAfterDate.getFullYear() + 30 );
	return notAfterDate;
}

// 生成Subject
function getSubject( caCertSubject, domain ){
	let isExits = false;
	certCertSubject = caCertSubject.map(e=>{
		if( e.name == 'commonName' ){
			e.value = domain;
			isExits = true;
		}
		return e;
	})
	if( !isExits ){
		certCertSubject.push({
			name: 'commonName',
			value: domain
		})
	}
	return certCertSubject;
}

// 生成Extensions
/*
	SubjectAltName ::= GeneralNames
	GeneralNames ::= SEQUENCE SIZE (1..MAX) OF GeneralName
	GeneralName ::= CHOICE {
	    otherName                       [0]     OtherName,
	    rfc822Name                      [1]     IA5String,
	    dNSName                         [2]     IA5String,
	    x400Address                     [3]     ORAddress,
	    directoryName                   [4]     Name,
	    ediPartyName                    [5]     EDIPartyName,
	    uniformResourceIdentifier       [6]     IA5String,
	    iPAddress                       [7]     OCTET STRING,
	    registeredID                    [8]     OBJECT IDENTIFIER 
	}
*/
function getExtensions( domain ) {
	return [    {
        name: 'subjectAltName',
        altNames: [{
            type: 2,
            value: domain
        }]
    }, {
        name: 'subjectKeyIdentifier'
    }];
}

// 生成客户端证书
function createServerCertificate( domain ){
    const keys = forge.pki.rsa.generateKeyPair(2046);
    const cert = forge.pki.createCertificate();
	cert.publicKey = keys.publicKey;
	cert.serialNumber = getSerialNumber();
	cert.validity.notBefore = getNotBeforeDate();
    cert.validity.notAfter = getNotAfterDate();
    let caIssuer = caCert.subject.attributes
    cert.setIssuer( caIssuer );
    let certSubject = getSubject( utils.deepClone( caIssuer ), domain );
    cert.setSubject( certSubject );
    cert.setExtensions( getExtensions( domain ) );
    cert.sign(caKey, forge.md.sha256.create());
    let serverKey = forge.pki.privateKeyToPem( keys.privateKey );
    let serverCert = forge.pki.certificateToPem(cert);
    let certObj = setCert( domain, serverKey, serverCert );
    return certObj;
}

module.exports = getCert