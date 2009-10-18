
	var msg;
	var loadMessage;
	var wooYayIntervalId = 0;
	var prefs = new gadgets.Prefs();
	var debugMode = prefs.getBool("debugMode");
	var theBasePath;
	var myID;
	var theHost;
	var iCanListen = false;
	var tabs;
	var iframeWin;
	var myRamdom="";
	var firstStatus = true;
	
	var gagheight;
	var Connected = false;
	var iframeSrc = "";
	var iamTheHost = false;
	
	function init(){
		msg = new gadgets.MiniMessage();
		loadMessage = msg.createStaticMessage("loading gadget");
		gagheight = "210";
		if (prefs.getString("zfile") == "") {
			prefs.set("zfile", randomString(15)+".txt"); 
		}
		loGit(prefs.getString("zfile"));
		wooYayIntervalId = setInterval("getReady()", 300);
	}

	function getReady() {
		
		if (wave && wave.isInWaveContainer()) {
			clearInterval(wooYayIntervalId);
			myID = wave.getViewer().getId();
			theHost = wave.getHost().getId();
			
			if(myID == theHost){
				iamTheHost = true;
				document.getElementById("playdiv").style.display="block";
				document.getElementById("mprivates").style.display="block";
				setOpt();
			}

			var therecordpanel = '<div id="rectab" style="font-family:courier, arial, sans-serif; font-size:10px; margin-top:3px; margin-right:10px; float:right;">Recording courtesy of <a href="http://riffly.com/" target="_blank">riffly</a></div><div id="recorder_container" style="float:left; width:100%; display:block; margin-left:10px;"></div>';
			
			tabs = new gadgets.TabSet("voicy"); 
			tabs.alignTabs("left", 10);
//			tabs.addTab("Record a greeting", {
//				contentContainer: document.getElementById("rectab"),
//				index: 1
//			});
			if(iamTheHost || !(prefs.getBool("priva"))){			
				iCanListen = true;
				tabs.addTab("Play messages", {
					contentContainer: document.getElementById("playdiv"),
					callback: toggleTab,
					index: 0
				});
			}else{
				document.getElementById("playdiv").innerHTML="";
//				document.getElementById("byline").style.display="block";
				therecordpanel += '<div id="byline" style="font-family:courier, arial, sans-serif; font-size:10px; float:left; width:100%; margin-top:16px; margin-bottom:0; margin-left:10px; padding:0; line-height:14px;">http://wave-gadgets.googlecode.com/svn/trunk/voicy/manifest.xml<br />Gadget by <a href="http://charlau.posterous.com/" target="_blank">charlau</a></div>';
			}
			var therectab = tabs.addTab('Record');
			document.getElementById(therectab).innerHTML = therecordpanel;

//			document.getElementById("rectab").style.display="block";
			rifflyShowRecorder('recorder_container', 'audio', 'rifflyFinishedRecording');
			document.getElementById('recorder_container').firstChild.style.display="none";
			setIframe();
			wave.setStateCallback(stateUpdated);
		}
	}

	function stateUpdated() {
		if (iCanListen){
			if(myRamdom != wave.getState().get('added') && !firstStatus){
				if(iamTheHost){
					msg.createDismissibleMessage("You have new messages!");
				}else{
					msg.createDismissibleMessage("Someone else left a message!");				
				}
			}
			iframeWin.postMessage('[getlist]~~om~~', 'http://www.charlau.com');
		}
	}

	function receiver(e) {
		Connected=true;
		msg.dismissMessage(loadMessage);
		if(e.origin == 'http://www.charlau.com') {
			var messages = e.data.split("~~om~~");
			if(iCanListen){
				switch (messages[0]){
				case "[ping]":
					iframeWin.postMessage('[getlist]~~om~~', 'http://www.charlau.com');
					break;
				case "[addok]":
					myRamdom = randomString(10);
					wave.getState().submitDelta({'added': myRamdom});
	//				iframeWin.postMessage('[getlist]~~om~~', 'http://www.charlau.com');
					loadMessage = msg.createStaticMessage("loading playlist");
					break;
				case "[list]":
					loGit(messages[1]);
					loadMessage = msg.createStaticMessage("loading playlist");
					generateList(messages);
					break;
				default:
				}
			}	
		}else{
			if(messages[0]=="[addok]") {
				msg.createTimerMessage("Message received!", 3);
				myRamdom = randomString(10);
				wave.getState().submitDelta({'added': myRamdom});
			}
		}
	}

	function setIframe(){
		iframeSrc="http://www.charlau.com/gwave/voicy.php?fl="+ prefs.getString("zfile");
		var html='<iframe id="mainIframe" src="" height="0" frameborder="0" scrolling="no"></iframe>';
		document.getElementById('content_div').innerHTML = html;
		document.getElementById("mainIframe").src = iframeSrc;

		gadgets.window.adjustHeight();
		iframeWin = document.getElementsByTagName('iframe')[0].contentWindow;
		window.addEventListener('message', receiver, false);
	}

	function generateList(messages) {
		var opt;
		var particip;
		document.getElementById('player_container').innerHTML='';
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
		msg.dismissMessage(loadMessage);
		tabs.setSelectedTab(0);
		if((myID==theHost) && (messages.length-1 > prefs.getInt("nbmessages"))){
			prefs.set("nbmessages", messages.length-1);
			if(myRamdom=="") {
				myRamdom=="sdf";
				firstStatus = false;
//				msg.createDismissibleMessage("You have new messages!");
			}
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

		iframeWin.postMessage('[addrec]~~om~~' + myID + '|||' + riffly_id, 'http://www.charlau.com');		
		if(!(iCanListen)){
			document.getElementById("recorder_container").innerHTML="";
			rifflyShowRecorder('recorder_container', 'audio', 'rifflyFinishedRecording');
			document.getElementById('recorder_container').firstChild.style.display="none";
		}
	}

	function showPlayer (player_container_id, riffly_id, riffly_type) {
		var player_container = document.getElementById(player_container_id);
		
		player_container.style.display = 'block';

		if (riffly_type == 'video') {
			player_container.innerHTML = '<embed src="http://riffly.com/p/' + riffly_id + 
			'" width="400" height="320" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true"></embed>';
		} else if (riffly_type == 'audio') {
			player_container.innerHTML = '<embed src="http://riffly.com/p/' + riffly_id +
			'" width="190" height="20" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true"></embed>';
		}
	}

	function toggleTab(tabId) {
		document.toplay.riffly_id2.selectedIndex = 0;
		document.getElementById('player_container').innerHTML = '';
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
