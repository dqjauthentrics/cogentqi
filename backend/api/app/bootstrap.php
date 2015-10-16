<?php
require __DIR__ . '/../vendor/autoload.php';

$parts = @explode(".", @$_SERVER["SERVER_NAME"]);
$infix = @$parts[0];

$configurator = new Nette\Configurator;

//$configurator->setDebugMode('23.75.345.200'); // enable for your remote IP
//$configurator->enableDebugger(__DIR__ . '/../log');

$configurator->setTempDirectory(__DIR__ . '/../temp');

$configurator->createRobotLoader()->addDirectory(__DIR__)->register();

$configurator->addConfig(__DIR__ . '/config/config.neon');
$configurator->addConfig(__DIR__ . "/config/config.$infix.neon");

Drahak\Restful\DI\RestfulExtension::install($configurator);
$container = $configurator->createContainer();

return $container;
