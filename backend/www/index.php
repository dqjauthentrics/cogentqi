<?php
require_once "../lib/Api.php";
require_once "../vendor/notorm/NotORM.php";
require_once "../vendor/slim/slim/Slim/Slim.php";

use \Slim\Slim;

\Slim\Slim::registerAutoloader();

$dsn = "mysql:dbname=cogentqi;host=localhost";
$username = "cogentqiapp";
$password = "cogentqi42app";

$pdo = new PDO($dsn, $username, $password);
$db = new NotORM($pdo);

$app = new Slim(["MODE" => "development", "TEMPLATES.PATH" => "./templates"]);

$app->get("/", function () use ($app, $db) {
	$books = [];
	foreach ($db->books() as $book) {
		$books[] = [
			"id"      => $book["id"],
			"title"   => $book["title"],
			"author"  => $book["author"],
			"summary" => $book["summary"]
		];
	}
	Api::sendResult($app, $books);
});

$app->get("/books", function () use ($app, $db) {
	echo "BOOKS";
	$books = [];
	foreach ($db->books() as $book) {
		$books[] = [
			"id"      => $book["id"],
			"title"   => $book["title"],
			"author"  => $book["author"],
			"summary" => $book["summary"]
		];
	}
	Api::sendResult($app, $books);
});


$app->get("/book/:id", function ($id) use ($app, $db) {
	$app->response()->header("Content-Type", "application/json");
	$book = $db->books()->where("id", $id);
	if ($data = $book->fetch()) {
		echo json_encode([
			"id"      => $data["id"],
			"title"   => $data["title"],
			"author"  => $data["author"],
			"summary" => $data["summary"]
		]);
	}
	else {
		Api::sendResult($app, ["status" => FALSE, "message" => "Book ID $id does not exist"]);
	}
});

$app->post("/book", function () use ($app, $db) {
	$app->response()->header("Content-Type", "application/json");
	$book = $app->request()->post();
	$result = $db->books->insert($book);
	Api::sendResult($app, ["id" => $result["id"]]);
});

$app->put("/book/:id", function ($id) use ($app, $db) {
	$app->response()->header("Content-Type", "application/json");
	$book = $db->books()->where("id", $id);
	if ($book->fetch()) {
		$post = $app->request()->put();
		$result = $book->update($post);
		Api::sendResult($app, ["status" => (bool)$result, "message" => "Book updated successfully"]);
	}
	else {
		Api::sendResult($app, ["status" => FALSE, "message" => "Book id $id does not exist"]);
	}
});

$app->delete("/book/:id", function ($id) use ($app, $db) {
	$app->response()->header("Content-Type", "application/json");
	$book = $db->books()->where("id", $id);
	if ($book->fetch()) {
		$result = $book->delete();
		Api::sendResult($app, ["status" => TRUE, "message" => "Book deleted successfully"]);
	}
	else {
		Api::sendResult($app, ["status" => FALSE, "message" => "Book id $id does not exist"]);
	}
});

$app->run();
