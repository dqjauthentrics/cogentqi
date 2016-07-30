<?php
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

define('APP_PATH', dirname(dirname(dirname(__DIR__))) . '/backend3/');

/**
set_error_handler(function ($errno, $errstr, $errfile, $errline) {
	if ($errno == E_USER_ERROR) {
		echo "ERR:" . $errstr;
		$result = new Cogent\Components\Result();
		$result->message = $errstr;
		$result->send();
		exit(1);
	}
	else {
		return TRUE;
	}
});
**/

try {
	$config = include APP_PATH . "Cogent/Config/config.php";

	/**
	 * Set up autoloading of classes.
	 * @var Application $config
	 */
	$loader = new Loader();
	$loader->registerNamespaces([
		'Cogent\Controllers' => APP_PATH . '/Cogent/Controllers/',
		'Cogent\Models'      => APP_PATH . '/Cogent/Models/',
		'Cogent\Components'  => APP_PATH . '/Cogent/Components/',
		'Cogent'             => APP_PATH . '/',
	]);
	$loader->registerDirs([APP_PATH . '/Cogent/Models/']); // needed for getting related objects, for some reason

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
	include APP_PATH . "Cogent/Config/services.php";

	/**
	 * Run the page.
	 */
	$application = new Application($di);
	echo $application->handle()->getContent();
}
catch (\Exception $e) {
	?>
	<table>
		<tr>
			<th>Exception</th>
			<td><?= $e->getMessage() ?></td>
		</tr>
		<tr>
			<th>Class</th>
			<td><?= get_class($e) ?></td>
		</tr>
		<tr>
			<th>File</th>
			<td><?= $e->getFile() ?></td>
		</tr>
		<tr>
			<th>Line</th>
			<td><?= $e->getLine() ?></td>
		</tr>
		<tr>
			<th>Trace</th>
			<td>
				<pre><?= $e->getTraceAsString() ?></pre>
			</td>
		</tr>
	</table>
	<style>
		table {
			margin: 1em auto;
			border-collapse: collapse;
			max-width: 100%;
		}

		th, td {
			border: 1px solid #AAA;
			padding: 0.5em;
			vertical-align: top;
			margin: 0;
			white-space: normal;
		}

		th {
			font-weight: normal;
			text-align: right;
		}

		td {
			font-weight: bold;
		}
	</style>
	<?php
}
