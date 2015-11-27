<?php
defined('APP_PATH') || define('APP_PATH', realpath('.'));

return new \Phalcon\Config([
	'database'    => [
		'adapter'  => 'Mysql',
		'host'     => 'localhost',
		'username' => 'cogentqiapp',
		'password' => 'cogentqi42app',
		'dbname'   => 'cogentqi_v1_healthcare',
		'charset'  => 'utf8',
	],
	'application' => [
		'appDir'         => APP_PATH,
		'controllersDir' => APP_PATH . '/controllers/',
		'modelsDir'      => APP_PATH . '/models/',
		'componentsDir'  => APP_PATH . '/components/',
		'viewsDir'       => APP_PATH . '/views/',
		'pluginsDir'     => APP_PATH . '/plugins/',
		'cacheDir'       => APP_PATH . '/cache/',
		'baseUri'        => '/api3/',
	]
]);
