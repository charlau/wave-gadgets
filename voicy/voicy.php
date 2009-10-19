<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<?php
   //File will be rewritten if already exists
   function write_file($filename,$newdata) {
          $f=fopen($filename,'w') or die("can't write file");
          fwrite($f,$newdata);
          fclose($f);  
   }

   function append_file($filename,$newdata) {
          $f=fopen($filename,'a') or die("can't open file");
          fwrite($f,"\n".$newdata);
          fclose($f);  
   }

   function read_file($filename) {
          $f=fopen($filename,'r') or die("can't read file");
          $data=fread($f,filesize($filename));
          fclose($f);
          return $data;
   }
   
   if (!$_REQUEST['fl']) { die; }
   if ($_REQUEST['fl']) { $thFile='voicylists/'.$_REQUEST['fl']; }
   if ($_REQUEST['pid']) { $thParticipant=$_REQUEST['pid']; }      
   if ($_POST['riffly_id']) { append_file($thFile,$thParticipant.'|||'.$_POST['riffly_id']); }
   if ($_POST['getlist']) {

	if (!file_exists($thFile)) { write_file($thFile,''); }
	
	$page = join("",file("$thFile"));
	$kw = explode("\n", $page);
	$nbclips = count($kw);
	$listTosend = "";
	for($i=0;$i<$nbclips;$i++){
		if ($kw[$i]) {
			$uId=explode("|||", $kw[$i]);
			$listTosend .= strval($uId[0]).'|||'.strval($uId[1]).'~~om~~';
		}
	}
}

?> 

<head>
<title>Record and Play audio greetings in google wave</title>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta name="keywords" content="" />
<meta name="description" content="" />

 <script type="text/javascript">
 
	var parentWin = window.parent;
	var listCount = 0;
	var thesource = "";
	var pingping;
	var addok = false;
	var dolist = false;
	
	window.onload = function(){ 
			if("<?php echo $_POST['riffly_id']; ?>"!=""){
				addok = true;
			}else{
				if("<?php echo $_POST['getlist']; ?>"!=""){
					dolist = true;
					}
			}

			pingping = setInterval("pinggoogle()", 500);
			parentWin.postMessage("[ping]~~om~~","https://0-wave-opensocial.googleusercontent.com");			

            window.addEventListener("message", function(e){ 
				if (e.origin == 'https://0-wave-opensocial.googleusercontent.com') {
					thesource = e.origin;
					var messages = e.data.split("~~om~~");
					switch (messages[0]){
					case "[ping]":
						clearInterval(pinggoogle);
						if(addok){parentWin.postMessage("[addok]~~om~~","https://0-wave-opensocial.googleusercontent.com");}
						if(dolist){
							getlist();
							parentWin.postMessage("[list]~~om~~<?php echo $listTosend; ?>","https://0-wave-opensocial.googleusercontent.com");
							}
						parentWin.postMessage("[ping]~~om~~",e.origin);
						break;
					case "[getlist]":
						getlist();
						break;
					case "[addrec]":
						addrec(messages[1]);
						break;
					default:
					}
				}
			}, false);
			 
		} 

	function pinggoogle(){		
		parentWin.postMessage("[ping]~~om~~",'https://0-wave-opensocial.googleusercontent.com');
		}

	function getlist(){
		document.getElementById('getlist').value = "yes";
		document.forms['recorded'].submit();
		}

	function addrec(recadd){
		var recArr=recadd.split('|||');
		document.getElementById('pid').value = recArr[0];
		document.getElementById('riffly_id').value = recArr[1];
		document.forms['recorded'].submit();
		}
  </script>

</head>

<body>
<form name="recorded" id="recorded" method="post" action="<?php echo $_SERVER['SCRIPT_NAME']; ?>">
<input name="riffly_id" id="riffly_id" type="hidden">
<input name="fl" id="fl" type="hidden" value="<?php echo $_REQUEST['fl'] ?>">
<input name="pid" id="pid" type="hidden">
<input name="getlist" id="getlist" type="hidden">
</form>
</body>
</html>