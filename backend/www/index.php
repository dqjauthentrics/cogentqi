<?php
namespace App;
require_once "../lib/Api.php";

$dsn = "mysql:dbname=cogentqi_v1_target;host=localhost";
$username = "cogentqiapp";
$password = "cogentqi42app";

$api = new Api($dsn, $username, $password, ["MODE" => "development", "TEMPLATES.PATH" => "./templates"]);
$api->get("/", function () use ($api) {
	$api->sendResult("Welcome to the API.");
});
$api->get("/test", function () use ($api) {
	$api->sendResult("TEST");
});
$api->run();
