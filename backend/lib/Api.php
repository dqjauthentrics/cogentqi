<?php
require_once "../vendor/notorm/NotORM.php";
require_once "../vendor/slim/slim/Slim/Slim.php";

use \Slim\Slim;

\Slim\Slim::registerAutoloader();

class Api extends \Slim\Slim {
	const STATUS_OKAY = TRUE;
	const STATUS_ERROR = FALSE;

	public $db = NULL;
	public $pdo = NULL;

	/**
	 * @param string $dsn
	 * @param string $username
	 * @param string $password
	 * @param array  $options
	 */
	function __construct($dsn, $username, $password, $options) {
		$this->pdo = new PDO($dsn, $username, $password);
		$this->db = new NotORM($this->pdo);
		parent::__construct($options);
	}

	/**
	 * @param $data
	 */
	public function sendResult($data, $status = self::STATUS_OKAY) {
		$this->response()->header("Content-Type", "application/json");
		echo json_encode(['status' => $status, 'result' => $data]);
		exit();
	}
}