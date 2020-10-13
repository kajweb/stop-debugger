let setSwitch = (value)=>{
	chrome.storage.sync.set({switch: value},(res)=>{
		console.log("switch has been set")
	})
	getStatus();
}

function getStatus(){
	var status = document.getElementById("status");
	chrome.storage.sync.get(['switch'], (res) => {
		console.log(res)
		switch( res.switch ){
			case false:
				open.style.background = "";
				close.style.background = "red";
				status.innerHTML ="关"
			break;
			case true:
			default:
				open.style.background = "#32f732";
				close.style.background = "";
				status.innerHTML ="开"
			break;
		}
	});
}

var open = document.getElementById("open");
var close = document.getElementById("close");
var status = document.getElementById("status");

getStatus()

open.onclick=function(){
	setSwitch(true)
	
}
close.onclick=function(){
	setSwitch(false)
}