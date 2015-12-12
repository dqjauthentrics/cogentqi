<?php
$f = @$_REQUEST["f"];
if (substr($f, 0, 1) == '/') {
	$f = substr($f, 1);
}
$path = dirname(dirname(dirname(__DIR__))) . '/frontend/www/' . $f;
//echo "PATH:$path<br/>";
echo (@file_exists($path)) ? 1 : 0;
