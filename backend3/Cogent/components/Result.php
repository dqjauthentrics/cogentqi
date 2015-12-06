<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace Cogent\Components;

class Result {
	const STATUS_OKAY = 1;
	const STATUS_ERROR = 0;

	const CODE_NORMAL = 200;
	const CODE_INVALID_REQUEST = 400;
	const CODE_NOT_FOUND = 404;
	const CODE_NOT_ALLOWED = 403;
	const CODE_EXCEPTION = 500;

	/**
	 * @var int $status
	 */
	public $status = 0;

	/**
	 * @var string $status
	 */
	public $message = "";

	/**
	 * @var int $status
	 */
	public $code = self::CODE_NORMAL;

	/**
	 * @var mixed $data
	 */
	public $data = NULL;

	/**
	 * AjaxResult constructor.
	 *
	 * @param int         $status
	 * @param string|null $message
	 * @param int         $code
	 */
	function __construct($status = self::STATUS_ERROR, $message = NULL, $code = self::CODE_NORMAL, $data = NULL) {
		$this->status = $status;
		$this->message = $message;
		$this->code = $code;
		$this->data = $data;
	}

	/**
	 * @param \Exception $exception
	 * @param mixed      $data
	 */
	public function setException($exception, $data = NULL) {
		$this->status = self::STATUS_ERROR;
		$this->code = 500;
		$this->message = $exception->getMessage();
		if (!empty($data)) {
			$this->data = $data;
		}
	}

	/**
	 * @param mixed|null $data
	 *
	 * @return array
	 */
	public function package($data = NULL) {
		if ($data !== NULL) {
			$this->data = $data;
		}
		return ['status' => $this->status, 'code' => $this->code, 'message' => $this->message, 'data' => $this->data];
	}

	/**
	 */
	public function send() {
		if ($this->code == self::CODE_NORMAL) {
			echo json_encode($this->package($this->data));
		}
		else {
			$response = new \Phalcon\Http\Response();
			$response->setStatusCode($this->code);
			$response->send();
		}
		exit(0);
	}

	/**
	 * @param mixed $data
	 */
	public function setNormal($data = FALSE) {
		$this->status = Result::STATUS_OKAY;
		if ($data !== FALSE) {
			$this->data = $data;
		}
	}

	/**
	 * @param int $code
	 */
	public function setError($code) {
		$this->status = Result::STATUS_ERROR;
		$this->code = $code;
	}

	/**
	 * @param mixed $data
	 */
	public function sendNormal($data = FALSE) {
		$this->setNormal($data);
		$this->send();
	}

	/**
	 * @param int $code
	 */
	public function sendError($code, $message = FALSE) {
		$this->setError($code);
		if ($message !== FALSE) {
			$this->message = $message;
		}
		$this->send();
	}
}