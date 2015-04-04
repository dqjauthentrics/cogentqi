<?php
namespace App;
$parts = explode("/", $_SERVER["REQUEST_URI"]);
$object = @$parts[2];
if (strlen($object) > 0) {
	$object[0] = strtoupper($object[0]);
}
if (strstr($object, "XDEBUG") || $object == "Test") {
	$object = NULL;
}
$objectNS = !empty($object) ? "App\\" . $object : NULL;
$objPath = !empty($object) ? "../lib/$object.php" : NULL;

require_once "../lib/Api.php";
require_once "../lib/Model.php";
require_once "../lib/Authentication.php";
if (!empty($objPath)) {
	if (@file_exists($objPath)) {
		require_once $objPath;
	}
	else {
		header("HTTP/1.0 400 Invalid object ($object).");
		exit();
	}
}
$dsn = "mysql:dbname=cogentqi_v1_target;host=localhost";
$username = "cogentqiapp";
$password = "cogentqi42app";

$api = new Api($dsn, $username, $password, ["MODE" => "development", "TEMPLATES.PATH" => "./templates"]);
$api->get("/", function () use ($api) {
	$api->sendResult("CogentQI API.");
});
$api->get("/test", function () use ($api) {
	$api->sendResult("OK");
});

if (!empty($objectNS)) {
	$auth = new Authentication($api);
	$user = $auth->check();
	if (!empty($user) || $object = "Authentication") {
		new $objectNS($api);
	}
	else {
		try {
			header("HTTP/1.0 403 Unauthenticated");
			exit();
		}
		catch (\Exception $exception) {

		}
	}
}
$api->run();
