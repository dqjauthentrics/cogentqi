<?php
namespace App;
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
	 * Overrides Slim constructor to add pdo and db objects.
	 *
	 * @param string $dsn
	 * @param string $username
	 * @param string $password
	 * @param array  $options
	 */
	function __construct($dsn, $username, $password, $options) {
		$this->pdo = new \PDO($dsn, $username, $password);
		$this->db = new \NotORM($this->pdo);
		parent::__construct($options);
	}

	/**
	 * Generates CORS compliant headers and wraps result with status.
	 *
	 * @param $data
	 */
	public function sendResult($data, $status = self::STATUS_OKAY) {
		header("Access-Control-Allow-Origin: *");
		header('Access-Control-Allow-Credentials: true');
		header('Access-Control-Max-Age: 86400');    // cache for 1 day
		$this->response()->header("Content-Type", "application/json");
		if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
			if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
				header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
			}
			if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
				header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
			}
			exit(0);
		}
		echo @json_encode(['status' => $status, 'result' => $data]);
	}
}