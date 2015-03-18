<?php
require_once "../vendor/notorm/NotORM.php";
require_once "../vendor/slim/slim/Slim/Slim.php";

use \Slim\Slim;

\Slim\Slim::registerAutoloader();

class Api extends \Slim\Slim {
	public $db = NULL;
	public $pdo = NULL;

	function __construct($dsn, $username, $password, $options) {
		$this->pdo = new PDO($dsn, $username, $password);
		$this->db = new NotORM($this->pdo);

		parent::__construct($options);
	}

	/**
	 * @param            $data
	 */
	public function sendResult($data) {
		$this->response()->header("Content-Type", "application/json");
		echo json_encode($data);
		exit();
	}
}