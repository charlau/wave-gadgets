var msg;
var loadMessage;
var prefs = new gadgets.Prefs();
var debugMode = true;
var firstpass = true;
var myID;
var theHost;
var myRamdom = "";
var iCanListen = false;
var tabs;
var iamTheHost = false;
var nbmessages;
var IamRecording = false;
var particiPready = false;
var iframeWin;
var waitingForCharlau = true;
var runPerd;
var waitwave;
var getlistdone = false;
var isbugged = true;
var xmess;
var spMessage = "";
//var spMessage = "Sorry, sometimes the gadget is not always loading. Please bear with the beta!";

function init(){
	msg = new gadgets.MiniMessage();
	if (isbugged) {
		msg.createDismissibleMessage(spMessage);
		waitwave = msg.createStaticMessage("waiting for wave");
		runPerd = setInterval( waitingWave, 500 );
	}else{
		loadMessage = msg.createStaticMessage("loading gadget");
		if (wave && wave.isInWaveContainer()) {
			wave.setStateCallback(stateUpdated);
			wave.setParticipantCallback(participantIsReady);
		}
	}
}

function init2(){
	loGit(prefs.getString("zfile"));
//	var xdumm=randomString(15)+".txt";
//	wave.getState().submitDelta({'zfile': xdumm});
	loGit(prefs.getString("zfile").length);
	if (prefs.getString("zfile").length > 15) {
		setST("zfile", prefs.getString("zfile"));
		prefs.set("zfile", ""); 
	}else{
		if (getST("zfile") == ""){
			setST("zfile", randomString(15)+".txt");
		}
	}
	loGit(getST("zfile"));
	if (prefs.getBool("priva") == true) {
		setST("priva", "true");
	}else{
		if (getST("priva") == ""){
			setST("priva", "false");
		}
	}
}


// used only if isbugged=true in times when waves tend to disapear...
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
			loGit("waitingWave error:" + err);
	}
}

// if updated, most likelly because a message was recorded
function stateUpdated() {	
	if (iCanListen && !waitingForCharlau && !getlistdone){
		getlistdone = true;
		iframeWin.postMessage('[getlist]~~om~~'+getST("zfile")+'~~om~~~~om~~~~om~~', 'http://www.charlau.com');
	}
}

// so far, used only on the first participant ready.
function participantIsReady() {		
	if(!particiPready && wave.getViewer()){
		myID = wave.getViewer().getId();
		theHost = wave.getHost().getId();
		getReady();
		document.getElementById('mainIframe').src = "http://www.charlau.com/gwave/voicy/comm-google-charlau.html";
		iframeWin = document.getElementById('mainIframe').contentWindow;
		window.addEventListener('message', receiver, false);
		particiPready = true;
		runPerd = setInterval( pingCharlau, 500 );
	}
}

function getST(item) {
	var valtoret = "";
	try{
		valtoret = wave.getState().get(item);
		} catch(err) {
			loGit("getST error: " + item + "  " + err);
	}	
	return valtoret;
}

function setST(item, itemval) {
	loGit("setST: " + item +"  "+itemval);
	try{
		wave.getState().submitValue(item, itemval);
		} catch(err) {
			loGit("setST error: " + item + "  " + itemval + err);
	}
}

// keep pinging charlau until we get a response (the setinterval will be cancelled in fnc receiver() when we get pinged from him
function pingCharlau() {
	iframeWin.postMessage('[ping]~~om~~', 'http://www.charlau.com');
}

function getReady() {
	init2();
	loGit("zfile (getReady):"+getST("zfile"));
	if(myID == theHost){
		iamTheHost = true;
		document.getElementById("playdiv").style.display="block";
		document.getElementById("mprivates").style.display="block";
		setOpt();
	}else{
		document.getElementById("HostOpt").style.marginTop="105px";
	}
	var theNote;
	var therecordpanel2 = "";
	tabs = new gadgets.TabSet("voicy"); 
	tabs.alignTabs("left", 10);
	if(iamTheHost || !(prefs.getBool("priva") || getST("priva")==true)){			
		iCanListen = true;
		tabs.addTab("Play messages", {
			contentContainer: document.getElementById("playdiv"),
			callback: toPlayTab,
			index: 0
		});
		theNote = "Note: this recording is not anonymous - your name will appear on the list with your message";
	}else{
		theNote = "Note: your id will appear with your message only for the owner of the wave";
		IamRecording = true;
		document.getElementById("playdiv").innerHTML="";
		therecordpanel2 = '<div id="byline" style="font-family:courier, arial, sans-serif; font-size:10px; float:left; width:100%; margin-top:10px; margin-bottom:1px; margin-left:10px; padding:0; line-height:14px;">http://wave-gadgets.googlecode.com/svn/trunk/voicy/manifest.xml<br />Gadget by <a href="http://charlau.posterous.com/" target="_blank">charlau</a></div>';
	}

	var therectab = tabs.addTab("Leave a message", {
		callback: toRecTab,
		index: 1
	});

	var therecordpanel = '<div id="rectab" style="font-family:courier, arial, sans-serif; font-size:10px; margin-left:8px; margin-top:3px; margin-right:10px; margin-bottom:10px; float:right;">Recording courtesy of <a href="http://riffly.com/" target="_blank">riffly</a></div><div style="font-family:verdana, arial, sans-serif; font-style:italic; padding-top:3px; padding-left:10px; padding-right:10px;">' + theNote + '</div><div id="recorder_container" style="float:left; width:100%; display:block; margin-left:10px; height:160px;"></div>' + therecordpanel2;

	document.getElementById(therectab).innerHTML = therecordpanel;

	rifflyShowRecorder('recorder_container', 'audio', 'rifflyFinishedRecording');
	document.getElementById('recorder_container').firstChild.style.display="none";
	
	gadgets.window.adjustHeight();

}

//receives messages from charlau.com
function receiver(e) {
	Connected=true;
	if(e.origin == 'http://www.charlau.com') {
		clearInterval(runPerd);
		var messages = e.data.split("~~om~~");
		if(iCanListen){
			switch (messages[0]){
			case "[ping]":
				loGit("[ping]");
				msg.dismissMessage(loadMessage);
				loadMessage = msg.createStaticMessage("loading message list");
				iframeWin.postMessage('[getlist]~~om~~'+getST("zfile")+'~~om~~~~om~~~~om~~', 'http://www.charlau.com');
				break;
			case "[addrec]":
				loGit("[addrec]");
				myRamdom = randomString(10);
				wave.getState().submitDelta({'added': myRamdom});
				msg.createTimerMessage("Message sent!", 3);
				loGit("zfile (addrec):"+getST("zfile"));
				break;
			case "[getlist]":
				loGit("[getlist]");
				if(messages[1]=='BAD') { // file does not exist - no messages yet
					msg.dismissMessage(loadMessage);
					msg.createTimerMessage("No messages yet... why don't you add one? :)",4);
				}else{
					generateList(messages);
				}
				break;
			default:
			}
		}else{
			switch (messages[0]){
			case "[ping]":
				waitingForCharlau = false;
				msg.dismissMessage(loadMessage);
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

// splits received message ([getlist]) and builds drop-down select list
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

	if(firstpass){
		waitingForCharlau = false;
		firstpass = false;
	}

	if((iamTheHost) && (messages.length-1 > parseInt(getST("nbmessages")))){
		msg.createDismissibleMessage("You have new messages!");
		xmess = messages.length-1;
		setST("nbmessages", xmess.toString());
	}
	
}

// trigger: user clicks on the checkbox for privacy
function checkOpt(thebox){
	if(myID == theHost){
		if (thebox.checked) {
			prefs.set("priva", true); 
			setST("priva", "true");
		}else{
			prefs.set("priva", false); 				
			setST("priva", "false");
		}
		loGit(getST("priva"));
	}
}

function setOpt(){
	var mfrm;
	if(myID == theHost){
		mfrm = document.getElementsByTagName('form')[1];
		if (getST("priva") == "") {
			mfrm.priva.checked = prefs.getBool("priva");
			setST("priva", prefs.getBool("priva").toString());
		}else{
			mfrm.priva.checked = (getST("priva") === 'true') ;		
		}
	}
}

// triggered by Riffly's swf
function rifflyFinishedRecording (riffly_id, riffly_type) {

	iframeWin.postMessage('[addrec]~~om~~'+getST("zfile")+'~~om~~' + myID + '~~om~~' + riffly_id + '~~om~~', 'http://www.charlau.com');	
	if(iCanListen) {
		IamRecording = false;
	}else{
		rifflyShowRecorder('recorder_container', 'audio', 'rifflyFinishedRecording');
		document.getElementById('recorder_container').firstChild.style.display="none";
	}
}

// triggered by the "onchange" event of the select list of recordings
function showPlayer (player_container_id, riffly_id, riffly_type) {

	var player_container = document.getElementById(player_container_id);

	if (!waitingForCharlau) {
		msg.createTimerMessage("Loading recorded message", 2);
		if (riffly_type == 'video') {

			gadgets.flash.embedFlash("http://riffly.com/p/" + riffly_id , player_container, {
				swf_version: 8,
				id: "riffyplayerx",
				width: "400",
				height: "320",
				allowfullscreen: "true",
				allowscriptaccess: "never"
			});
			
			player_container.style.display = 'block';	

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
		}
	}
}

// When user clicks on the player tab
function toPlayTab(tabId) {
	IamRecording = false;
	document.toplay.riffly_id2.selectedIndex = 0;
	document.getElementById('player_container').innerHTML = '';
}

// When user clicks on the recorder tab
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
		msg.createDismissibleMessage("*** " + tolog + " ***");
	}
}

gadgets.util.registerOnLoadHandler(init);    
