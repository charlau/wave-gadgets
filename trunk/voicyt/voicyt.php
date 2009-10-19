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
						clearInterval(wooYayIntervalId);
						alert("ping");
						parentWin.postMessage("[ping]~~om~~"+e.origin+"~~om~~"+e.source+"~~om~~",e.origin);
						break;
					default:
					}
				}
			}, false);			 
		} 

	function pinggoogle(){
		
		parentWin.postMessage("[ping]~~om~~1~~om~~2~~om~~",'https://0-wave-opensocial.googleusercontent.com');
		
		}
		var xy = setInterval("pinggoogle()", 1000);

  </script>

</head>

<body>
</body>
</html>