<?php
namespace App;
require_once "../vendor/notorm/NotORM.php";
require_once "../vendor/slim/slim/Slim/Slim.php";

use \Slim\Slim;


\Slim\Slim::registerAutoloader();

/**
 * Class AltIdsStructure
 * @package App
 *
 *          This class handles exceptions to the NotORM key mapping conventions.  Camel humped names don't work that well with the sprintf based formatting
 *          of table and column names, so we have to make sure we set the case right here, in addition to handling the other columns that do not directly
 *          mirror their table names.
 */
class AltIdsStructure extends \NotORM_Structure_Convention {

	function getReferencedTable($name, $table) {
		//echo "RT: $name/$table\n";
		switch ($name) {
			case "creator_id":
			case "creator":
			case "assessor":
			case "assessor_id":
				return "member";
		}
		return parent::getReferencedTable($name, $table);
	}

	function getReferencingTable($name, $table) {
		//echo "RingT: $name/$table\n";
		return $this->prefix . $name;
	}

	function getReferencedColumn($name, $table) {
		//echo "RC: $name/$table\n";
		return parent::getReferencedColumn($name, $table);
	}
}

/**
 * Class Api
 * @package App
 *
 *          The main API, or app, class.
 */
class Api extends \Slim\Slim {
	const DB_NAME_BASE = "cogentqi_v1_";
	const DB_USERNAME = "cogentqiapp";
	const DB_PASSWORD = "cogentqi42app";
	const STATUS_OKAY = TRUE;
	const STATUS_ERROR = FALSE;

	public $db = NULL;
	public $pdo = NULL;

	private $user = NULL;

	public $debug = 0;

	/**
	 * Overrides Slim constructor to add pdo and db objects.
	 *
	 * @param string $installationInfix
	 * @param array  $options
	 */
	function __construct($installationInfix, $options) {
		$this->pdo = new \PDO($this->getServerConnectionString($installationInfix), self::DB_USERNAME, self::DB_PASSWORD);
		$className = $this->baseClassName();
		if (TRUE || $className !== "Member") {
			$structure = new AltIdsStructure($primary = 'id', $foreign = '%s_id', $table = '%s', $prefix = '');
		}
		else {
			$structure = new \NotORM_Structure_Discovery($this->pdo, $cache = NULL, $foreign = '%s_id');
		}
		$this->db = new \NotORM($this->pdo, $structure);
		parent::__construct($options);
	}

	public function setUser($user) {
		$this->user = $user;
	}

	public function user() {
		return $this->user;
	}

	/**
	 * @return string
	 */
	public function baseClassName() {
		$path = explode('\\', get_class($this));
		return array_pop($path);
	}

	/**
	 * @return string mixed
	 */
	public static function getInstallationInfixFromHostName() {
		$parts = explode(".", @$_SERVER["SERVER_NAME"]);
		return @$parts[0];
	}

	/**
	 * @param string $installationInfix
	 *
	 * @return string
	 */
	public function getServerConnectionString($installationInfix) {
		return "mysql:dbname=" . self::DB_NAME_BASE . $this->getInstallationInfixFromHostName() . ";host=localhost";
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
		echo @json_encode($data);
	}

	/**
	 * @param \Exception $exception
	 */
	public function sendError($exception) {
		$reason = str_replace("\n", " ", $exception->getMessage());
		header("HTTP/1.0 500 " . $reason);
		exit();
	}
}