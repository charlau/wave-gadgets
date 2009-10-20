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

	function prep_send($cmd, $fl, $pid, $riffly_id) {
		
		$fl='voicylists/'.$fl;
		
		if($cmd=='getlist') {
			if(!file_exists($fl)) {
				$my_response = "[getlist]~~om~~BAD~~om~~"; 
			}else{
				$page = join("",file("$fl"));
				$kw = explode("\n", $page);
				$nbclips = count($kw);
				$my_response = "[getlist]~~om~~";
				for($i=0;$i<$nbclips;$i++){
					if ($kw[$i]) {
						$uId=explode("|||", $kw[$i]);
						$my_response .= strval($uId[0]).'|||'.strval($uId[1]).'~~om~~';
					}
				}

			}
		}else{
			if($cmd=='addrec') {
				if(!file_exists($fl)) {
					write_file($fl,''); 
				}
				append_file($fl,$pid.'|||'.$riffly_id);
				$my_response = "[addrec]~~om~~ok~~om~~"; 				
			}
		}
		return $my_response;	
	}
   
	if (!$_GET['fl']) { die("bad param"); }

	if (($_GET['cmd']=='getlist') || ($_GET['cmd']=='addrec')) { 	
		echo prep_send($_GET['cmd'], $_GET['fl'], $_GET['pid'], $_GET['riffly_id']);
	}

?> 