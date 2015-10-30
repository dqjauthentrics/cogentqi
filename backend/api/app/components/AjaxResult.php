<?php
namespace App\Components;

use Nette\Application\Responses\JsonResponse;

class AjaxResult {
	const STATUS_OKAY = 1;
	const STATUS_ERROR = 0;

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
	public $code = 0;

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
	function __construct($status = self::STATUS_ERROR, $message = NULL, $code = 0, $data = NULL) {
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
	 * @param mixed|null $data
	 */
	public function send($data = NULL) {
		echo json_encode($this->package($data));
		exit(0);
	}

}