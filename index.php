<?php
//define("SERVER_URL", 'http://192.168.11.170/cplayer/');

define("SERVER_URL", 'http://192.168.11.170:3000/'); 
define("SONGDIR", "../../../node\pw-streem\upload");

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
			$item = !empty(SONGDIR) ?  SERVER_URL . 'audio' . str_replace(SONGDIR, '', $dirName ) ."/". str_replace('mp3', 'ts', $fileName) : SERVER_URL . $dirName ."/". $fileName;
			$lst[] = [
			'src'=> $item,
			'img' => SERVER_URL . 'image' . str_replace(SONGDIR, '', $img ) ,
			'title' => $fileName
			];
		}
	}
	
	return  ($lst );	
}


$baseDir = SONGDIR ?? "upload";


$list = [];

if(is_dir( $baseDir ) ){	
	$list = getFileList( $baseDir );
}

header('Access-Control-Allow-Origin:  * ' );
      header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
      header('Access-Control-Max-Age: 1000');
      header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

echo json_encode($list);