<?php
require_once "../lib/Api.php";

$dsn = "mysql:dbname=cogentqi;host=localhost";
$username = "cogentqiapp";
$password = "cogentqi42app";

$api = new Api($dsn, $username, $password, ["MODE" => "development", "TEMPLATES.PATH" => "./templates"]);

$api->get("/", function () use ($api) {
	$api->sendResult("Welcome to the API.");
});

$api->get("/books", function () use ($api) {
	$books = [];
	foreach ($api->db->books() as $book) {
		$books[] = [
			"id"      => $book["id"],
			"title"   => $book["title"],
			"author"  => $book["author"],
			"summary" => $book["summary"]
		];
	}
	$api->sendResult($books);
});


$api->get("/book/:id", function ($id) use ($api) {
	$book = $api->db->books()->where("id", $id);
	if ($data = $book->fetch()) {
		$api->sendResult([
			"id"      => $data["id"],
			"title"   => $data["title"],
			"author"  => $data["author"],
			"summary" => $data["summary"]
		]);
	}
	else {
		$api->sendResult("Book ID $id does not exist", Api::STATUS_ERROR);
	}
});

$api->post("/book", function () use ($api) {
	$book = $api->request()->post();
	$result = $api->db->books->insert($book);
	$api->sendResult(["id" => $result["id"]]);
});

$api->put("/book/:id", function ($id) use ($api) {
	$book = $api->db->books()->where("id", $id);
	if ($book->fetch()) {
		$post = $api->request()->put();
		$result = $book->update($post);
		$api->sendResult("Book updated.", (bool)$result);
	}
	else {
		$api->sendResult("Book id $id does not exist", Api::STATUS_ERROR);
	}
});

$api->delete("/book/:id", function ($id) use ($api) {
	$book = $api->db->books()->where("id", $id);
	if ($book->fetch()) {
		$result = $book->delete();
		$api->sendResult("Book deleted.");
	}
	else {
		$api->sendResult("Book id $id does not exist.", Api::STATUS_ERROR);
	}
});

$api->run();
