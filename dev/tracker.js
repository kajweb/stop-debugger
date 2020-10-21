let languages = "zh_CN";
const i18n = require("./lang/" + languages);

function onGetZlibNoType( contentEncoding ) {
	console.log( i18n.tracker )
	console.group( i18n.tracker.onGetZlibNoType[0] + contentEncoding );
	console.info(  i18n.tracker.onGetZlibNoType[1] );
	console.info(  i18n.tracker.onGetZlibNoType[2] );
	console.info(  i18n.tracker.onGetZlibNoType[3] );
	console.info(  i18n.tracker.onGetZlibNoType[4] );
	console.info(  i18n.tracker.onGetZlibNoType[5] );
	console.info(  i18n.tracker.onGetZlibNoType[6] );
	console.info(  i18n.tracker.onGetZlibNoType[7] + contentEncoding );
	console.groupEnd()
}

module.exports = {
	onGetZlibNoType
}