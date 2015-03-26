<?php
namespace App;
$parts = explode("/", $_SERVER["REQUEST_URI"]);
$object = @ucfirst($parts[2]);
if (strstr($object, "XDEBUG")) {
	$object = NULL;
}
$objectNS = !empty($object) ? "App\\" . $object : NULL;
$objPath = !empty($object) ? "../lib/$object.php" : NULL;

require_once "../lib/Api.php";
require_once "../lib/Model.php";
require_once "../lib/Authentication.php";
if (!empty($objPath)) {
	if (!@file_exists($objPath)) {
		echo "Invalid invocation ($objPath)";
		exit();
	}
}
//if (strlen($objPath) > 0) {
require_once $objPath;
//}

$dsn = "mysql:dbname=cogentqi_v1_target;host=localhost";
$username = "cogentqiapp";
$password = "cogentqi42app";

$api = new Api($dsn, $username, $password, ["MODE" => "development", "TEMPLATES.PATH" => "./templates"]);
$auth = new Authentication($api);
$user = $auth->check();
if (!empty($user)) {
	$api->get("/", function () use ($api) {
		$api->sendResult("Welcome to the API.");
	});
	$api->get("/test", function () use ($api) {
		$api->sendResult("TEST");
	});

	if (strlen($objectNS) > 0) {
		new $objectNS($api);
	}
}
$api->run();