<?php
require dirname(__DIR__) . '/vendor/autoload.php';
$server = @$_SERVER["SERVER_NAME"];
$parts = @explode(".", $server);
$infix = @$parts[0];
Nette\Environment::setProductionMode(strstr($server, '.com') !== FALSE);
$isAjax = strpos($_SERVER["HTTP_ACCEPT"], "application/json") !== FALSE;

//!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';

$configurator = new Nette\Configurator;
if (!$isAjax) {
	$configurator->setDebugMode(!Nette\Environment::isProduction());
	$configurator->enableDebugger(dirname(__DIR__) . '/log');
}
$configurator->setTempDirectory(dirname(__DIR__) . '/temp');
$configurator->createRobotLoader()->addDirectory(__DIR__)->register();
$configurator->addConfig(__DIR__ . '/config/config.neon');
$configurator->addConfig(__DIR__ . "/config/config.$infix.neon");

Drahak\Restful\DI\RestfulExtension::install($configurator);
$container = $configurator->createContainer();

return $container;
