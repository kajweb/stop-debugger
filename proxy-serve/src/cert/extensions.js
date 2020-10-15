const Enum = require('enum');
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
let subjectAltType = new Enum({
	"otherName": 0,
	"rfc822Name": 1,
	"dNSName": 2,
	"x400Address": 3,
	"directoryName": 4,
	"ediPartyName": 5,
	"uniformResourceIdentifier": 6,
	"iPAddress": 7,
	"registeredID": 8
});

module.exports = {
    subjectAltType
}