<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<title>Record and Play audio greetings in google wave</title>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta name="keywords" content="" />
<meta name="description" content="" />

 <script type="text/javascript">
 
	var parentWin = window.parent;
	var listCount = 0;
	var thesource = "";
	
	window.onload = function(){ 
            window.addEventListener("message", function(e){ 
				if (e.origin == 'https://0-wave-opensocial.googleusercontent.com') {
					thesource = e.origin;
					var messages = e.data.split("~~om~~");
					switch (messages[0]){
					case "[ping]":
						clearInterval(xy);
						parentWin.postMessage("[ping]~~om~~"+e.origin+"~~om~~"+e.source+"~~om~~",e.origin);
						document.getElementById('smessage').value = "ping-charlot";
						dodo();
						break;
					default:
					}
				}
			}, false);			 
		} 
		
	function dodo{
		document.getElementById('pid').value = recArr[0];
		document.getElementById('riffly_id').value = recArr[1];
		document.forms['recorded'].submit();	
	}

	function pinggoogle(){
		
		parentWin.postMessage("[ping]~~om~~1~~om~~2~~om~~",'https://0-wave-opensocial.googleusercontent.com');
		
		}
		var xy = setInterval("pinggoogle()", 1000);


  </script>

</head>

<body>
<div id="smessage">AAA</div>
<form name="recorded" id="recorded" method="post" action="<?php echo $_SERVER['SCRIPT_NAME']; ?>">
<input name="riffly_id" id="riffly_id" type="hidden">
<input name="fl" id="fl" type="hidden" value="<?php echo $_REQUEST['fl'] ?>">
<input name="pid" id="pid" type="hidden">
<input name="getlist" id="getlist" type="hidden">
</form>
</body>
</html>