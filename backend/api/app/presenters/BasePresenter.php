<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace ResourcesModule;

use Nette,
	Nette\Application\Responses\JsonResponse,
	Drahak\Restful\IResource,
	Drahak\Restful\Application\UI\ResourcePresenter,
	App\Components\AjaxException,
	App\Components\DbContext,
	App\Model;

/**
 * Base presenter for all application presenters.
 */
class BasePresenter extends ResourcePresenter {
	const MODE_LISTING = 0;
	const MODE_RECORD = 1;
	const MODE_RELATED = 2;
	const MODE_RECURSIVE = 3;

	const EXECUTE = "X";
	const CREATE = "C";
	const READ = "R";
	const UPDATE = "U";
	const DELETE = "D";

	/**
	 * @var bool
	 */
	public $debug = FALSE;

	/** @var DbContext */
	protected $database = NULL;

	/** @var \PDO */
	protected $pdo = NULL;

	/** @var string $tableName The name of the associated table for this model. */
	public $tableName = NULL;

	/**
	 * @var array $typeMap Needed for Restful
	 */
	protected $typeMap = ['json' => IResource::JSON, 'xml' => IResource::XML];

	/**
	 * BasePresenter constructor.
	 *
	 * @param DbContext $database
	 */
	public function __construct(DbContext $database) {
		parent::__construct();
		$this->database = $database;
		$this->pdo = $this->database->getConnection()->pdo;
	}

	/**
	 * Override parent function to use JSON, always, as a default.
	 *
	 * @param string $format
	 *
	 * @return \Nette\Application\IResponse|void
	 */
	public function sendResource($format = IResource::JSON) {
		parent::sendResource($format);
	}

	/**
	 * @return string
	 */
	public function tableName() {
		return DbContext::tableName(str_replace("Presenter", "", $this->baseClassName()));
	}

	/**
	 * @param int $id
	 *
	 * @return Nette\Database\Table\IRow|array
	 */
	public function retrieve($id, $doMapping = FALSE) {
		$tableName = $this->tableName();
		if (!empty($id)) {
			$result = $this->database->table($tableName)->get($id);
			if ($doMapping && !empty($result)) {
				$result = $this->database->map($result);
			}
		}
		else {
			$result = $this->database->table($tableName)->fetchAll();
			if ($doMapping && !empty($result)) {
				$jsonRecords = [];
				foreach ($result as $record) {
					$jsonRecords[] = $this->database->map($record);
				}
				$result = $jsonRecords;
			}
		}
		return $result;
	}

	/**
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionRead($id, $mode = self::MODE_LISTING) {
		$this->resource = $this->retrieve($id, TRUE);
		if (empty($this->resource)) {
			throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
		}
		//$this->sendResource();
		$this->sendResult($this->resource);
	}

	/**
	 * @param int $id
	 */
	public function actionDelete($id) {
		$result = 0;
		$data = @$this->getInput()->getData();
		if (!empty($data["id"])) {
			$id = $data["id"];
			if (!empty($id)) {
				/** @var Nette\Database\Table\ActiveRow $resource */
				$resource = $this->database->table($this->tableName())->get($id);
				if (!empty($resource)) {
					$resource->delete();
					$result = 1;
				}
			}
		}
		$this->sendResult($result);
	}

	/**
	 * @param $element
	 *
	 * @throws AjaxException
	 * @throws \Nette\Application\ForbiddenRequestException
	 */
	public function checkRequirements($element) {
		if (get_class($this) !== "App\Presenters\SignPresenter" && !$this->user->isAllowed($this->presenter->name, $this->action)) {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
		parent::checkRequirements($element);
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
	 * Generates CORS compliant headers and wraps result with status.
	 *
	 * @param mixed $data
	 */
	public function sendResult($data) {
		header("Access-Control-Allow-Origin: *");
		header('Access-Control-Allow-Credentials: true');
		header('Access-Control-Max-Age: 30');
		header("Content-Type", "application/json");
		if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
			if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
				header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
			}
			if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
				header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
			}
			exit(0);
		}
		echo json_encode($data);
		exit();
	}

	/**
	 * @param string $mysqlDateTime
	 *
	 * @return bool|null|string
	 */
	public static function dateTime($mysqlDateTime) {
		if (!empty($mysqlDateTime)) {
			return date("c", strtotime($mysqlDateTime));
		}
		return NULL;
	}

	/**
	 * Returns the current date/time in a format suitable for storing in the DB, in GMT.
	 *
	 * @return string
	 */
	public static function dbDateTime() {
		return gmdate("Y-m-d H:i:s");
	}

}
