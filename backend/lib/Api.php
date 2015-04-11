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
			case "creatorId":
			case "byMemberId":
				return "Member";
			case "learningModuleId":
				return "LearningModule";
		}
		$name[0] = strtolower($name[0]);
		$table[0] = strtoupper($table[0]);
		return parent::getReferencedTable($name, $table);
	}

	function getReferencedColumn($name, $table) {
		//echo "RC: $name/$table\n";
		if ($table == "PlanItem" && $name == "LearningModule") {
			return "learningModuleId";
		}
		$name[0] = strtolower($name[0]);
		$table[0] = strtoupper($table[0]);
		return sprintf($this->foreign, $this->getColumnFromTable($name), substr($table, strlen($this->prefix)));
	}

}

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
		$className = $this->baseClassName();
		if (TRUE || $className !== "Member") {
			$structure = new AltIdsStructure($primary = 'id', $foreign = '%sId', $table = '%s', $prefix = '');
		}
		else {
			$structure = new \NotORM_Structure_Discovery($this->pdo, $cache = NULL, $foreign = '%sId');
		}
		$this->db = new \NotORM($this->pdo, $structure);
		parent::__construct($options);
	}

	public function baseClassName() {
		$path = explode('\\', get_class($this));
		return array_pop($path);
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