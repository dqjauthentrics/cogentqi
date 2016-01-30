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

	const MESSAGES = [
		self::CODE_NORMAL          => 'Okay',
		self::CODE_INVALID_REQUEST => 'Invalid request.',
		self::CODE_NOT_FOUND       => 'Not found.',
		self::CODE_NOT_ALLOWED     => 'Permission denied.',
		self::CODE_EXCEPTION       => 'Error.',
	];

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
	 * @var int $duration
	 */
	public $duration = 0;

	/**
	 * @var \Cogent\Controllers\ControllerBase $controller
	 */
	public $controller = NULL;

	/**
	 * AjaxResult constructor.
	 *
	 * @param \Cogent\Controllers\ControllerBase $controller
	 * @param int                                $status
	 * @param string|null                        $message
	 * @param int                                $code
	 */
	function __construct($controller = NULL, $status = self::STATUS_ERROR, $message = NULL, $code = self::CODE_NORMAL, $data = NULL) {
		$this->status = $status;
		$this->message = $message;
		$this->code = $code;
		$this->data = $data;
		$this->controller = $controller;
	}

	/**
	 * @param \Exception $exception
	 * @param mixed      $data
	 */
	public function setException($exception, $data = FALSE) {
		$this->status = self::STATUS_ERROR;
		$this->code = 500;
		$this->message = $exception->getMessage();
		if ($data !== FALSE) {
			$this->data = $data;
		}
	}

	/**
	 * @param mixed $data
	 */
	public function sendNormal($data = FALSE) {
		$this->setNormal($data);
		$this->send();
		exit();
	}

	/**
	 * @param mixed $data
	 */
	public function setNormal($data = FALSE, $msg = FALSE) {
		$this->status = Result::STATUS_OKAY;
		if ($data !== FALSE) {
			$this->data = $data;
		}
		if ($msg !== FALSE) {
			$this->message = $msg;
		}
	}

	/**
	 */
	public function send() {
		echo json_encode($this->package($this->data), JSON_NUMERIC_CHECK);
		//exit(0);
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
		if (!empty($this->controller)) {
			$this->duration = (double)number_format($this->controller->executionTime(), 5);
		}
		return [
			'status'   => $this->status,
			'code'     => $this->code,
			'duration' => $this->duration,
			'message'  => $this->message,
			'data'     => $this->data
		];
	}

	/**
	 * @param int $code
	 */
	public function sendError($code = self::CODE_INVALID_REQUEST, $message = FALSE) {
		$this->setError($code, $message);
		$this->send();
	}

	/**
	 * @param int $code
	 */
	public function setError($code = self::CODE_INVALID_REQUEST, $message = FALSE) {
		$this->status = Result::STATUS_ERROR;
		$this->code = $code;
		if ($message !== FALSE) {
			$this->message = $message;
		}
		else {
			// This silliness is so that a phpStorm bug show an error
			$tmp = self::MESSAGES;
			$this->message = $tmp[$code];
		}
	}
}