<?php
use Phalcon\Loader;
use Phalcon\Mvc\Application;

error_reporting(E_ALL);
define('APP_PATH', dirname(dirname(dirname(__DIR__))) . '/backend3/api');

try {
	$config = include APP_PATH . "/config/config.php";

	/**
	 * Set up autoloading of classes.
	 * @var Application $config
	 */
	$loader = new Loader();
	$loader->registerNamespaces([
		'Api\Components'  => $config->application->componentsDir,
		'Api\Models'      => $config->application->modelsDir,
		'Api\Controllers' => $config->application->controllersDir,
		'Api\Plugins'     => $config->application->pluginsDir,
	]);
	$loader->registerDirs([
		$config->application->pluginsDir,
		$config->application->componentsDir,
		$config->application->modelsDir,
		$config->application->controllersDir,
	], TRUE);
	$loader->register();

	/**
	 * Define services.
	 */
	include APP_PATH . "/config/services.php";

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
