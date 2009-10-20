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
var iframeWin;
	
	function init(){
			msg = new gadgets.MiniMessage();
			loadMessage = msg.createStaticMessage("loading gadget");
			gagheight = "210";
			if (prefs.getString("zfile") == "") {
				prefs.set("zfile", randomString(15)+".txt"); 
			}
			prefs.set("firstrun",false);
			setIframe();
			wave.setStateCallback(stateUpdated);
	}

	function stateUpdated() {
//		if (iCanListen && (myRamdom != prefs.getString("lastRamdom")) && !waitingForCharlau){
			iframeWin.postMessage('[getlist]~~om~~'+prefs.getString("zfile")+'~~om~~~~om~~~~om~~', 'http://www.charlau.com');
			msg.createDismissibleMessage("***getlist***");
//		}
	}

	function setIframe(){
		iframeWin = document.getElementById('mainIframe').contentWindow;
		window.addEventListener('message', receiver, false);
	}

	function receiver(e) {
		Connected=true;
		msg.dismissMessage(loadMessage);
		if(e.origin == 'http://www.charlau.com') {
			waitingForCharlau = false;
			var messages = e.data.split("~~om~~");
			if(iCanListen){
				switch (messages[0]){
				case "[ping]":
					loGit("[ping]");
					iframeWin.postMessage('[getlist]~~om~~'+prefs.getString("zfile")+'~~om~~~~om~~~~om~~', 'http://www.charlau.com');
					break;
				case "[addrec]":
					loGit("[addrec]");
					myRamdom = randomString(10);
					wave.getState().submitDelta({'added': myRamdom});
					msg.createTimerMessage("Message sent!", 3);
					break;
				case "[getlist]":
					loGit("[getlist]");
					if(message[1]!='BAD') {
						loadMessage = msg.createStaticMessage("loading playlist");
						generateList(messages);
					}
					break;
				default:
				}
			}else{
				switch (messages[0]){
				case "[ping]":
					waitingForCharlau = false;
					break;
				case "[addrec]":
					msg.createTimerMessage("Message sent!", 3);
					myRamdom = randomString(10);
					wave.getState().submitDelta({'added': myRamdom});
					break;
				default:
				}
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
