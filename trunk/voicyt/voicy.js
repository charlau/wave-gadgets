var msg;
var loadMessage;
var prefs = new gadgets.Prefs();
var debugMode = false;
var myID;
var theHost;
var myRamdom = "";
var iCanListen = false;
var tabs;
var iamTheHost = false;
var IamRecording = false;
var particiPready = false;
var iframeWin;
var waitingForCharlau = true;
var runPerd;
var waitwave;
var isbugged = true;
var xmess;
var spMessage = "";
//var spMessage = "Sorry, sometimes the gadget is not always loading. Please bear with the beta!";
var gadd='<div style="float:right; clear:none;"><script type="text/javascript"><!--	google_ad_client ="pub-5574306595268675"; /* gwave */ google_ad_slot = "7991926088"; google_ad_width = 234; google_ad_height = 60; //--> </script><script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script></div>';

function init(){
	msg = new gadgets.MiniMessage();
	if (isbugged) {
//		msg.createDismissibleMessage(spMessage);
		waitwave = msg.createStaticMessage("loading gadget");
		runPerd = setInterval( waitingWave, 500 );
	}else{
		loadMessage = msg.createStaticMessage("loading gadget");
		if (wave && wave.isInWaveContainer()) {
			wave.setStateCallback(stateUpdated);
			wave.setParticipantCallback(participantIsReady);
		}
	}
}

function init2Old(){

	var oldzfile = prefs.getString("zfile");

	if ( oldzfile == null || oldzfile.length == 0 || oldzfile == false) {
		if (!getST("zfile")){
			setST("zfile", randomString(15)+".txt");
		}
	}else{
//		transfer from prefs to state
		setST("zfile", oldzfile);
		prefs.set("zfile", ""); 
	}

//	transfer from prefs to state
	if (prefs.getBool("priva") == true) {
		setST("priva", true);
	}else{
		if (!getST("priva")){
			setST("priva", false);
		}
	}
	
	setST("usingStates", true);
}

function init2(){

	if (!getST("zfile")){
		setST("zfile", randomString(15)+".txt");
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


function stateUpdated() {	
	document.getElementById('player_container').innerHTML='';
	if (iCanListen && !waitingForCharlau){
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
	var valtoret;
	try{
		valtoret = wave.getState().get(item);
		} catch(err) {
			loGit("getST error: " + item + " --> " + err);
	}
	if ( valtoret == null || valtoret.length == 0 || valtoret == "false" )
		{
			valtoret = false;
		}
	if ( valtoret == "true" )
		{
			valtoret = true;
		}

	return valtoret;
}

function setST(item, itemval) {

	var itemvalx = itemval.toString();

	try{
		wave.getState().submitValue(item, itemvalx);
		} catch(err) {
			loGit("setST error: " + item + ", " + itemvalx + " " + typeof(itemvalx) + " --> "+ err);
	}
}

// keep pinging charlau until we get a response (the setinterval will be cancelled in fnc receiver() when we get pinged from him
function pingCharlau() {
	iframeWin.postMessage('[ping]~~om~~', 'http://www.charlau.com');
}

function getReady() {
	if (getST("usingStates")) {
		init2();
	}else{
		init2Old();
	}

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
	if(iamTheHost || !(prefs.getBool("priva") || getST("priva"))){			
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
		therecordpanel2 = '<div id="byline" style="font-family: Courier, \'Courier New\', arial, sans-serif; font-size:10px; float:left; width:100%; margin-top:10px; margin-bottom:1px; margin-left:10px; padding:0; line-height:14px;"><a href="https://wave.google.com/wave/?#minimized:search,restored:wave:googlewave.com!w%252BhsKZwB2sI" target="_blank">feedback wave</a><br />Gadget by <a href="http://charlau.posterous.com/" target="_blank">charlau</a>'+gadd+'</div>';
	}

	var therectab = tabs.addTab("Leave a message", {
		callback: toRecTab,
		index: 1
	});

	var therecordpanel = '<div id="rectab" style="font-family:courier, arial, sans-serif; font-size:10px; margin-left:8px; margin-top:3px; margin-right:10px; margin-bottom:10px; float:right;"> </div><div style="font-family:verdana, arial, sans-serif; font-style:italic; padding-top:3px; padding-left:10px; padding-right:10px;">' + theNote + '</div><div id="recorder_container" style="float:left; display:block; margin-left:10px; height:160px;"></div>' + therecordpanel2;

	document.getElementById(therectab).innerHTML = therecordpanel;

	rifflyShowRecorder('recorder_container', 'audio', 'rifflyFinishedRecording');
//	document.getElementById('recorder_container').firstChild.style.display="none";
	
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
				waitingForCharlau = false;
				msg.dismissMessage(loadMessage);
				loadMessage = msg.createStaticMessage("loading message list");
				iframeWin.postMessage('[getlist]~~om~~'+getST("zfile")+'~~om~~~~om~~~~om~~', 'http://www.charlau.com');
				break;
			case "[addrec]":
				myRamdom = randomString(10);
				wave.getState().submitDelta({'added': myRamdom});
				msg.createTimerMessage("Message sent!", 2);
				break;
			case "[getlist]":
				if(messages[1]=='BAD') { // file does not exist - no messages yet
					msg.dismissMessage(loadMessage);
					msg.createTimerMessage("No messages yet...<br />why don't you add one? :)",3);
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
				msg.createTimerMessage("Message sent!!", 2);
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
	var newmess;
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
		document.toplay.riffly_id2.options[x]=new Option(particip, opt[1], false, false);
	}

	if(!IamRecording){
		tabs.setSelectedTab(0);
	}

	msg.dismissMessage(loadMessage);
	document.getElementById('choosefile').style.display = 'block';

	if (!getST("nbmessages")) {
		setST("nbmessages", (messages.length-2).toString());
	}else{
		newmess= (messages.length-2) - parseInt(getST("nbmessages"));
		if((iamTheHost) && (newmess > 0)){
			msg.createDismissibleMessage("You have " + newmess.toString() + " new message(s)");
			setST("nbmessages", (messages.length-2).toString());
		}
	}
	document.getElementById('xxmessages').innerHTML = "&nbsp;" + (messages.length-2).toString() + "&nbsp;";
}

// trigger: user clicks on the checkbox for privacy
function checkOpt(thebox){
	if(myID == theHost){
		if (thebox.checked) {
			setST("priva", true);
		}else{
			setST("priva", false);
		}
	}
}

function setOpt(){
	var mfrm;
	if(myID == theHost){
		mfrm = document.getElementsByTagName('form')[1];
		if (!getST("usingStates")) {
			setST("priva", prefs.getBool("priva"));
			setST("usingStates", true);
		}
		mfrm.priva.checked = (getST("priva")) ;		
	}
}

// triggered by Riffly's swf
function rifflyFinishedRecording (riffly_id, riffly_type) {

	iframeWin.postMessage('[addrec]~~om~~'+getST("zfile")+'~~om~~' + myID + '~~om~~' + riffly_id + '~~om~~', 'http://www.charlau.com');	
	if(iCanListen) {
		IamRecording = false;
	}else{
		rifflyShowRecorder('recorder_container', 'audio', 'rifflyFinishedRecording');
//		document.getElementById('recorder_container').firstChild.style.display="none";
	}
}

// triggered by the "onchange" event of the select list of recordings
function showPlayer (player_container_id, riffly_id, riffly_type) {

	var player_container = document.getElementById(player_container_id);

	if (!waitingForCharlau) {
		msg.createTimerMessage("Loading recorded message", 2);
		if (riffly_type == 'video') {

		} else if (riffly_type == 'audio') {
				
				document.getElementById('player_container').innerHTML='<embed id="riffyplayerx" src="http://riffly.com/p/' + riffly_id + '" width="190" height="20" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="false"></embed>';
				
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

/* Riffly.com Web API */

function rifflyShowRecorder (recorder_window_id, recorder_type, callback) {
	var recorder_window = document.getElementById(recorder_window_id);
	recorder_window.style.display = 'block';

	if (recorder_type == 'audio') {
		recorder_window.innerHTML = '<embed id="riffly_recorder_object" src="http://riffly.com/static/flash/rifflyrecorder.swf" quality="high" bgcolor="#ffffff" name="riffly_recorder_object" allowscriptaccess="always" scale="noscale" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" align="middle" width="320" height="138" flashvars="callback=' + encodeURIComponent(callback) + '&mode=audio&url=' + encodeURIComponent(location.href) + '&post_title=' + encodeURIComponent(document.title) + '"></embed>';
	} else {
		recorder_window.innerHTML = '<embed id="riffly_recorder_object" src="http://riffly.com/static/flash/rifflyrecorder.swf" quality="high" bgcolor="#ffffff" name="riffly_recorder_object" allowscriptaccess="always" scale="noscale" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" align="middle" width="320" height="260" flashvars="callback=' + encodeURIComponent(callback) + '&mode=video&url=' + encodeURIComponent(location.href) + '&post_title=' + encodeURIComponent(document.title) + '"></embed>';
	}

}


gadgets.util.registerOnLoadHandler(init);    
