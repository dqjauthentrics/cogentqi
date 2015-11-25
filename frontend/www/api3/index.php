<?php
use Phalcon\Loader;
use Phalcon\Mvc\Application;

error_reporting(E_ALL);
define('APP_PATH', dirname(dirname(dirname(__DIR__))) . '/backend3/api');

try {
	$config = include APP_PATH . "/config/config.php";
	$loader = new Loader();

	$loader->registerNamespaces([
		'Api\Components'  => $config->application->componentsDir,
		'Api\Models'      => $config->application->modelsDir,
		'Api\Controllers' => $config->application->controllersDir,
	]);
	$loader->registerDirs([
			$config->application->controllersDir,
			$config->application->componentsDir,
			$config->application->modelsDir
		], TRUE
	);
	$loader->register();

	include APP_PATH . "/config/services.php";
	$application = new Application($di);
	echo $application->handle()->getContent();
}
catch (\Exception $e) {
	echo '<pre>';
	echo get_class($e), ": ", $e->getMessage(), "\n";
	echo " File=", $e->getFile(), "\n";
	echo " Line=", $e->getLine(), "\n";
	echo $e->getTraceAsString();
	echo '</pre>';
}
