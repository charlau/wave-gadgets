
	var msg;
	var loadMessage;
	var wooYayIntervalId = 0;
	var prefs = new gadgets.Prefs();
	var debugMode = prefs.getBool("debugMode");
	var firstrun = prefs.getBool("firstrun");
	var firstpass = true;
	var theBasePath;
	var myID;
	var theHost;
	var iCanListen = false;
	var tabs;
	var iframeWin;
	var myRamdom="";
	var firstStatus = true;
	var waitingForCharlau = true;
	var gagheight;
	var Connected = false;
	var iframeSrc = "";
	var iamTheHost = false;
	var nbmessages;
	var nbmessnew;
	var IamRecording = false;
	var particiPready = false;

	
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
		iframeWin = document.getElementsByTagName('iframe')[0].contentWindow;
		window.addEventListener('message', receiver, false);
//		iframeWin.postMessage('[ping]~~om~~', 'http://www.charlau.com');
//		msg.createDismissibleMessage("***I ping***");
	}

	function receiver(e) {
		msg.dismissMessage(loadMessage);
		msg.createDismissibleMessage("***received***" + e.origin + "***" + e.source);
		if(e.origin == 'http://www.charlau.com') {
			var messages = e.data.split("~~om~~");
				switch (messages[0]){
				case "[ping]":
					msg.createDismissibleMessage("***YOU ping***" + e.origin + "***" + e.source+"yourorigin:"+messages[1]+"yoursource:"+messages[2]);
					iframeWin.postMessage('[ping]~~om~~', 'http://www.charlau.com');
					break;
				default:
				}
			}	
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