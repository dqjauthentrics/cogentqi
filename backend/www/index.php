<?php
require_once "../lib/Api.php";

$dsn = "mysql:dbname=cogentqi;host=localhost";
$username = "cogentqiapp";
$password = "cogentqi42app";

$api = new Api($dsn, $username, $password, ["MODE" => "development", "TEMPLATES.PATH" => "./templates"]);

$api->get("/", function () use ($api) {
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

$api->get("/books", function () use ($api) {
	echo "BOOKS";
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
		echo json_encode([
			"id"      => $data["id"],
			"title"   => $data["title"],
			"author"  => $data["author"],
			"summary" => $data["summary"]
		]);
	}
	else {
		$api->sendResult(["status" => FALSE, "message" => "Book ID $id does not exist"]);
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
		$api->sendResult(["status" => (bool)$result, "message" => "Book updated successfully"]);
	}
	else {
		$api->sendResult(["status" => FALSE, "message" => "Book id $id does not exist"]);
	}
});

$api->delete("/book/:id", function ($id) use ($api) {
	$book = $api->db->books()->where("id", $id);
	if ($book->fetch()) {
		$result = $book->delete();
		$api->sendResult(["status" => TRUE, "message" => "Book deleted successfully"]);
	}
	else {
		$api->sendResult(["status" => FALSE, "message" => "Book id $id does not exist"]);
	}
});

$api->run();
