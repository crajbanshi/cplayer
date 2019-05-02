<?php
define("SERVER_URL", 'http://192.168.11.170/cplayer/');
function is_image($path)
{
	$a = getimagesize($path);
	$image_type = $a[2];
	
	if(in_array($image_type , array(IMAGETYPE_GIF , IMAGETYPE_JPEG ,IMAGETYPE_PNG , IMAGETYPE_BMP)))
	{
		return true;
	}
	return false;
}

function getImage($dirName){
	$a = scandir($dirName);
	$img = '';
	foreach($a as $fileName ){	
		if( $fileName !="." && $fileName !=".." && is_image( $dirName ."/". $fileName ) ){
			$img = $dirName ."/". $fileName ;
		}
	}
	
	return $img;
}

function getFileList($dirName){
	$lst = [];
	$a = scandir($dirName);
	$img = '';
	
	foreach($a as $fileName ){		
		if(is_dir( $dirName ."/". $fileName ) && $fileName !="." && $fileName !=".." ){
			$lst[] = ['album' => $fileName,
				 'list' =>	getFileList(  $dirName ."/". $fileName )];
		}else if($fileName !="." && $fileName !=".."){
			$path = $dirName ."/". $fileName;
			if(empty($img) ){
				$img = getImage( $dirName);
			}
			if(is_image( $dirName ."/". $fileName )){
				continue;
			}
			$lst[] = [
			'src'=> SERVER_URL . $dirName ."/". $fileName,
			'img' => SERVER_URL . $img,
			'title' => $fileName
			];
		}
	}
	
	return  ($lst );	
}


$baseDir = "upload";

$list = [];

if(is_dir( $baseDir ) ){	
	$list = getFileList( $baseDir );
}

header('Access-Control-Allow-Origin:  * ' );
      header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
      header('Access-Control-Max-Age: 1000');
      header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

echo json_encode($list);