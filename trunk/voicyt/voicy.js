
var msg;
var loadMessage;
var prefs = new gadgets.Prefs();
var debugMode = prefs.getBool("debugMode");
var firstrun = prefs.getBool("firstrun");
var firstpass = true;
var myID;
var theHost;
var iCanListen = false;
var tabs;
var iamTheHost = false;
var nbmessages;
var nbmessnew;
var IamRecording = false;
var particiPready = false;
	
function vmessage() {
	var ajaxReq;
	try{
		// Opera 8.0+, Firefox, Safari
		ajaxReq = new XMLHttpRequest();
	} catch (e){
		// Internet Explorer Browsers
		try{
			ajaxReq = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try{
				ajaxReq = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e){
				return false;
			}
		}
	}
	ajaxReq.onreadystatechange = function () {
		if (ajaxReq.readyState == 4) {
			alert("received:"+ajaxReq.responseText);
			msg.createDismissibleMessage(ajaxReq.responseText);
		}
	}
	ajaxReq.open("GET", "http://www.charlau.com/gwave/voicyaj.php?fl=sfdsf.txt", true);
	ajaxReq.send(null);
}

	function init(){
			msg = new gadgets.MiniMessage();
			loadMessage = msg.createStaticMessage("loading gadget");
			gagheight = "210";
			if (prefs.getString("zfile") == "") {
				prefs.set("zfile", randomString(15)+".txt"); 
			}
			prefs.set("firstrun",false);
			wave.setStateCallback(stateUpdated);
	}

	function stateUpdated() {
//			var getList = new vmessage;
			vmessage();
//			getList.get("http://www.charlau.com/gwave/voicyaj.php&fl=sfdsf.txt");
	}

	function randomString(length){
		var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		var rSt = "";
		var i;
		for(x=0;x<length;x++){
			i = Math.floor(Math.random() * 62);
			rSt += chars.charAt(i);
	  	}
		return rSt;
	}

	function loGit(tolog){
		if (debugMode) {
			msg.createDismissibleMessage("*** " + tolog.toString() + " ***");
		}
	}

    gadgets.util.registerOnLoadHandler(init);
    gadgets.window.adjustHeight();
