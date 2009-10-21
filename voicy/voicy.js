var msg;
var loadMessage;
var prefs = new gadgets.Prefs();
var debugMode = prefs.getBool("debugMode");
var firstrun = prefs.getBool("firstrun");
var firstpass = true;
var myID;
var theHost;
var myRamdom = "";

var iCanListen = false;
var tabs;

var iamTheHost = false;
var nbmessages;
var nbmessnew;
var IamRecording = false;
var particiPready = false;
var iframeWin;
var waitingForCharlau = true;
var runPerd;
var waitwave;
	
function init(){
	msg = new gadgets.MiniMessage();
	loadMessage = msg.createStaticMessage("loading gadget");
	if (prefs.getString("zfile") == "") {
		prefs.set("zfile", randomString(15)+".txt"); 
	}
	prefs.set("firstrun",false);

//	try{
	if (wave && wave.isInWaveContainer()) {
		wave.setStateCallback(stateUpdated);
		wave.setParticipantCallback(participantIsReady);
	}
//		} catch(err) {
//			loGit(err);
//			msg.dismissMessage(loadMessage);
//			waitwave = msg.createStaticMessage("Wave not ready, waiting for wave...");
//			runPerd = setInterval("waitingWave()", 500);
//		}
}

function waitingWave() {
	try{
		if ((wave) && wave.isInWaveContainer()) {
			clearInterval(runPerd);
			msg.dismissMessage(waitwave);
			loadMessage = msg.createStaticMessage("loading gadget");
			wave.setStateCallback(stateUpdated);
			wave.setParticipantCallback(participantIsReady);
		}
		} catch(err) {
			loGit(err);
		}
}

function stateUpdated() {
//		if (iCanListen && (myRamdom != prefs.getString("lastRamdom")) && !waitingForCharlau){
	if (iCanListen && !waitingForCharlau){
		iframeWin.postMessage('[getlist]~~om~~'+prefs.getString("zfile")+'~~om~~~~om~~~~om~~', 'http://www.charlau.com');
	}
}

function participantIsReady() {		
	if(!particiPready && wave.getViewer()){
		myID = wave.getViewer().getId();
		theHost = wave.getHost().getId();
		document.getElementById('mainIframe').src = "http://www.charlau.com/gwave/voicy/comm-google-charlau.html"
		getReady();
		iframeWin = document.getElementById('mainIframe').contentWindow;
		window.addEventListener('message', receiver, false);
		particiPready = true;
	}
}

function getReady() {
	
	if(myID == theHost){
		iamTheHost = true;
//		document.getElementById("playdiv").style.display="block";
		document.getElementById("mprivates").style.display="block";
		setOpt();
	}else{
		document.getElementById("HostOpt").style.marginTop="97px";
	}

	var therecordpanel = '<div id="rectab" style="font-family:courier, arial, sans-serif; font-size:10px; margin-left:8px; margin-top:3px; margin-right:10px; margin-bottom:10px; float:right;">Recording courtesy of <a href="http://riffly.com/" target="_blank">riffly</a></div><div style="font-family:verdana, arial, sans-serif; font-style:italic; padding-top:3px; padding-left:10px; padding-right:10px;">Note: this recording is not anonymous - your name will appear on the list with your message</div><div id="recorder_container" style="float:left; width:100%; display:block; margin-left:10px;"></div>';
	
	tabs = new gadgets.TabSet("voicy"); 
	tabs.alignTabs("left", 10);
	if(iamTheHost || !(prefs.getBool("priva"))){			
		iCanListen = true;
		tabs.addTab("Play messages", {
			contentContainer: document.getElementById("playdiv"),
			callback: toPlayTab,
			index: 0
		});
	}else{
		IamRecording = true;
		document.getElementById("playdiv").innerHTML="";
		therecordpanel += '<div id="byline" style="font-family:courier, arial, sans-serif; font-size:10px; float:left; width:100%; margin-top:36px; margin-bottom:0; margin-left:10px; padding:0; line-height:14px;">http://wave-gadgets.googlecode.com/svn/trunk/voicy/manifest.xml<br />Gadget by <a href="http://charlau.posterous.com/" target="_blank">charlau</a></div>';
	}
	var therectab = tabs.addTab("Leave a message", {
		callback: toRecTab,
		index: 1
	});

	document.getElementById(therectab).innerHTML = therecordpanel;

	rifflyShowRecorder('recorder_container', 'audio', 'rifflyFinishedRecording');
	document.getElementById('recorder_container').firstChild.style.display="none";
	
	document.getElementById('content_div').style.display="block";

}

function receiver(e) {
	Connected=true;
	msg.dismissMessage(loadMessage);
	if(e.origin == 'http://www.charlau.com') {
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
				waitingForCharlau = false;
				if(messages[1]!='BAD') {
					loadMessage = msg.createStaticMessage("loading playlist");
					generateList(messages);
				}
				break;
			default:
			}
		}else{
			switch (messages[0]){
			case "[getlist]":
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

function generateList(messages) {
	var opt;
	var particip;
	msg.dismissMessage(loadMessage);
	loadMessage = msg.createStaticMessage("loading message list");
	document.getElementById('player_container').innerHTML='';
	document.getElementById('choosefile').style.display = 'none';
	document.toplay.riffly_id2.options.length = 0;
	document.toplay.riffly_id2.options[0]=new Option('-------click to play-------', '', true, true);
	for (x=1;x<messages.length-1;x++) {
		opt = messages[x].split('|||');
		try{
			particip = wave.getParticipantById(opt[0]).getDisplayName();
			} catch(err) {
				loGit(err);
				particip = "unknown user";
			}
			loGit(particip);
		document.toplay.riffly_id2.options[x]=new Option(particip, opt[1], false, false);
	}

	if(!IamRecording){
		tabs.setSelectedTab(0);
	}

	msg.dismissMessage(loadMessage);
	document.getElementById('choosefile').style.display = 'block';

	if((iamTheHost) && firstpass && (messages.length-1 > prefs.getInt("nbmessages"))){
		msg.createTimerMessage("You have new messages!!",3);
	}else{
		if (iCanListen && !firstpass){
			prefs.set("lastRamdom", wave.getState().get('added'));
			if(myRamdom != prefs.getString("lastRamdom")){
				if(iamTheHost){
					msg.createTimerMessage("You have new messages!",3);
				}else{
					msg.createTimerMessage("Someone else left a message!",3);				
				}
			}
		}
	
	}

	if(firstpass){
		gadgets.window.adjustHeight();
	}
	if(iamTheHost){
		prefs.set("nbmessages", messages.length-1);
		firstpass=false;
	}
}


function checkOpt(thebox){
	loGit("checkOpt");
	if(myID == theHost){
		if (thebox.checked) {
			prefs.set("priva", true); 
		}else{
			prefs.set("priva", false); 				
		}
		loGit(prefs.getBool("priva"));
	}
}

function setOpt(){
	var mfrm;
	if(myID == theHost){
		loGit("setOpt");
		mfrm = document.getElementsByTagName('form')[1];
		loGit(mfrm.priva.checked);
		mfrm.priva.checked = prefs.getBool("priva");
	}
}

function rifflyFinishedRecording (riffly_id, riffly_type) {

	iframeWin.postMessage('[addrec]~~om~~'+prefs.getString("zfile")+'~~om~~' + myID + '~~om~~' + riffly_id + '~~om~~', 'http://www.charlau.com');	
	rifflyShowRecorder('recorder_container', 'audio', 'rifflyFinishedRecording');
	document.getElementById('recorder_container').firstChild.style.display="none";
}

function showPlayer (player_container_id, riffly_id, riffly_type) {

	var player_container = document.getElementById(player_container_id);
	msg.createTimerMessage("Loading recorded message", 2);

	if (riffly_type == 'video') {
		player_container.innerHTML = '<embed src="http://riffly.com/p/' + riffly_id + 
		'" width="400" height="320" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true"></embed>';
	} else if (riffly_type == 'audio') {

			gadgets.flash.embedFlash("http://riffly.com/p/" + riffly_id , player_container, {
				swf_version: 8,
				id: "riffyplayerx",
				width: "190",
				height: "20",
				allowfullscreen: "false",
				allowscriptaccess: "never"
			});
			
			player_container.style.display = 'block';

//		player_container.innerHTML = '<embed src="http://riffly.com/p/' + riffly_id +
//		'" width="190" height="20" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true"></embed>';
	}
}

function toPlayTab(tabId) {
	IamRecording = false;
	document.toplay.riffly_id2.selectedIndex = 0;
	document.getElementById('player_container').innerHTML = '';
}

function toRecTab(tabId) {
	IamRecording = true;
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
