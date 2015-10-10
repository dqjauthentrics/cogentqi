<?php

namespace App\Presenters;

use Nette,
	Nette\Application\Responses\JsonResponse,
	App\Components\AjaxException,
	App\Model;


/**
 * Base presenter for all application presenters.
 */
class BasePresenter extends Nette\Application\UI\Presenter {
	const STATUS_OKAY = TRUE;
	const STATUS_ERROR = FALSE;

	/** @var Nette\Database\Context */
	protected $database = NULL;

	/** @var string $tableName The name of the associated table for this model. */
	public $tableName = NULL;

	/**
	 * @param \Nette\Database\Context $database
	 */
	public function __construct(\App\Components\DbContext $database) {
		parent::__construct();
		$this->database = $database;
	}

	/**
	 * @param $element
	 *
	 * @throws \App\Components\AjaxException
	 * @throws \Nette\Application\ForbiddenRequestException
	 */
	public function checkRequirements($element) {
		if (!$this->user->isAllowed($this->presenter->name, $this->action)) {
			throw new AjaxException($this, AjaxException::ERROR_NOT_ALLOWED);
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
	 * @param $data
	 */
	public function sendResult($data, $status = self::STATUS_OKAY) {
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
	 * @param \Exception $exception
	 */
	public function sendError($exception) {
		$reason = str_replace("\n", " ", $exception->getMessage());
		header("HTTP/1.0 500 " . $reason);
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
