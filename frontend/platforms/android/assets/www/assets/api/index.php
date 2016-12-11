<?php
define('APP_PATH', dirname(dirname(dirname(dirname(__DIR__)))) . '/backend/');
$server = @$_SERVER['SERVER_NAME'];
$isProduction = !empty($server) && strstr($server, '.com');

ini_set('html_errors', FALSE);
ini_set('error_log', APP_PATH . 'logs/php.log');
ini_set('display_errors', FALSE); // forces a 500 for AJAX returns because no output is sent
ini_set('display_startup_errors', FALSE);

if (isset($_SERVER['HTTP_ORIGIN'])) {
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Max-Age: 86400');    // cache for 1 day
	header('Access-Control-Allow-Headers: Content-Type');
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
	}
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
		header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
	}
	exit(0);
}
use Phalcon\Loader;
use Phalcon\Mvc\Application;

try {
	$config = include APP_PATH . "App/Config/config.php";

	/**
	 * Set up autoloading of classes.
	 * @var Application $config
	 */
	$loader = new Loader();
	$loader->registerNamespaces([
		'App\Controllers' => APP_PATH . '/App/Controllers/',
		'App\Models'      => APP_PATH . '/App/Models/',
		'App\Components'  => APP_PATH . '/App/Components/',
		'App'             => APP_PATH . '/',
	]);
	$loader->registerDirs([APP_PATH . '/App/Models/']); // needed for getting related objects, for some reason

	$eventsManager = new \Phalcon\Events\Manager();
	$eventsManager->attach('loader', function ($event, $loader) {
		if ($event->getType() == 'beforeCheckPath') {
			//echo "PATH:" . $loader->getCheckedPath() . '<hr/>';
		}
	});

	$loader->setEventsManager($eventsManager);

	$loader->register();

	/**
	 * Define services.
	 */
	include APP_PATH . "App/Config/services.php";

	/**
	 * Run the page.
	 */
	$application = new Application($di);
	echo $application->handle()->getContent();
}
catch (\Exception $e) {
	$result = new \App\Components\Result($this);
	$result->data = [
		'message' => $e->getMessage(),
		'class'   => get_class($e),
		'file'    => $e->getFile(),
		'line'    => $e->getLine(),
		'trace'   => $e->getTraceAsString()
	];
	$result->sendError(500);
}