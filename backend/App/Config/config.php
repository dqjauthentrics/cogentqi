<?php
defined('APP_PATH') || define('APP_PATH', dirname(dirname(__DIR__)));
require_once APP_PATH . '/App/Components/ConfigSettings.php';

$settings = new App\Components\ConfigSettings();

$infix = $settings->getInfixFromServer(); // may be null from command line calls (e.g., phalcon tools)
if (!empty($infix)) {
	$settings->loadSite(__DIR__ . "/site/config.$infix.php");
	$frontendSiteDir = dirname(APP_PATH) . "/frontend/www/site/$infix";
	$settings->writeJson("$frontendSiteDir/config.js");
}

return new \Phalcon\Config($settings->config);
