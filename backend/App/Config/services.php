<?php
/**
 * Services are globally registered in this file
 *
 * @var \Phalcon\Mvc\Application $config
 */

use App\Plugins;
use Phalcon\Di\FactoryDefault;
use Phalcon\Events\Manager as EventsManager;
use Phalcon\Mvc\Dispatcher;
use Phalcon\Mvc\Url as UrlResolver;
use Phalcon\Mvc\View;
use Phalcon\Mvc\View\Engine\Volt as VoltEngine;
use Phalcon\Session\Adapter\Files as SessionAdapter;

//require_once dirname(__DIR__).'/plugins/SecurityPlugin.php';

/**
 * The FactoryDefault Dependency Injector automatically register the right services providing a full stack framework
 */
$di = new FactoryDefault();

$di->set('dispatcher', function () use ($di) {
	$dispatcher = new Dispatcher();
	$dispatcher->setDefaultNamespace("\App\Controllers");

	$eventsManager = new EventsManager;

	/**
	 * Check if the user is allowed to access certain action using the SecurityPlugin
	 */
	//$eventsManager->attach('dispatch:beforeDispatch', new App\Plugins\SecurityPlugin);

	/**
	 * Handle exceptions and not-found exceptions using NotFoundPlugin
	 */
	//$eventsManager->attach('dispatch:beforeException', new \App\Plugins\NotFoundPlugin);
	//$dispatcher->setEventsManager($eventsManager);
	return $dispatcher;
});

/**
 * The URL component is used to generate all kind of urls in the application
 */
$di->setShared('url', function () use ($config) {
	$url = new UrlResolver();
	$url->setBaseUri($config->application->baseUri);
	return $url;
});

/**
 * Setting up the view component
 */
$di->setShared('view', function () use ($config) {
	$view = new View();
	$view->setViewsDir($config->application->viewsDir);
	$view->registerEngines([
		'.volt' => function ($view, $di) use ($config) {
			$volt = new VoltEngine($view, $di);
			$volt->setOptions([
				'compiledPath'      => $config->application->cacheDir,
				'compiledSeparator' => '_'
			]);
			return $volt;
		},
		'.php'  => 'Phalcon\Mvc\View\Engine\Php'
	]);
	return $view;
});

/**
 * Database connection is created based in the parameters defined in the configuration file
 */
$di->setShared('db', function () use ($config) {
	$dbConfig = $config->database->toArray();
	$adapter = $dbConfig['adapter'];
	unset($dbConfig['adapter']);
	$class = 'Phalcon\Db\Adapter\Pdo\\' . $adapter;
	return new $class($dbConfig);
});

/**
 * If the configuration specify the use of metadata adapter use it or use memory otherwise
 */
/** dqj
 * $di->setShared('modelsMetadata', function () {
 * return new MetaDataAdapter();
 * });
 ***/

/**
 * Start the session the first time some component request the session service
 */
$di->setShared('session', function () {
	$session = new SessionAdapter();
	$session->start();
	return $session;
});
