<?php
namespace ResourcesModule;

use Drahak\Restful\IResource;
use Drahak\Restful\Application\UI\ResourcePresenter;

use Nette,
	Nette\Application\Responses\JsonResponse,
	App\Components\AjaxException,
	App\Components\DbContext,
	App\Model;


/**
 * Base presenter for all application presenters.
 */
class BasePresenter extends ResourcePresenter {

	/** @var DbContext */
	protected $database = NULL;

	/** @var string $tableName The name of the associated table for this model. */
	public $tableName = NULL;

	/**
	 * @var array $typeMap Needed for Restful
	 */
	protected $typeMap = [
		'json' => IResource::JSON,
		'xml'  => IResource::XML
	];

	/**
	 *
	 */
	public function actionContent() {
		$this->resource->title = 'REST API';
		$this->resource->subtitle = $this->name;
		$this->sendResource();
	}

	/**
	 *
	 */
	public function actionDetail($id) {
		$this->resource = ['detail' => $this->name];
		$this->sendResource();
	}

	public function tableName() {
		return DbContext::tableName(str_replace("Presenter", "", $this->baseClassName()));
	}

	/**
	 * @param int $id
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionRead($id) {
		$this->resource = NULL;
		$tableName = $this->tableName();
		if (!empty($id)) {
			$record = $this->database->table($tableName)->get($id);
			if (!empty($record)) {
				$this->resource = $this->database->map($record);
			}
		}
		else {
			$members = $this->database->table($tableName)->fetchAll();
			if (!empty($members)) {
				$records = [];
				foreach ($members as $member) {
					$records[] = $this->database->map($member);
				}
				$this->resource = $records;
			}
		}
		if (empty($this->resource)) {
			throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
		}
		$this->sendResource($this->typeMap['json']);
	}

	/**
	 * BasePresenter constructor.
	 *
	 * @param DbContext $database
	 */
	public function __construct(DbContext $database) {
		parent::__construct();
		$this->database = $database;
	}

	/**
	 * @param $element
	 *
	 * @throws AjaxException
	 * @throws \Nette\Application\ForbiddenRequestException
	 */
	public function checkRequirements($element) {
		if (!$this->user->isAllowed($this->presenter->name, $this->action)) {
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
		header('Access-Control-Max-Age: 86400');    // cache for 1 day
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
		$this->sendResponse(new JsonResponse($data));
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
}
