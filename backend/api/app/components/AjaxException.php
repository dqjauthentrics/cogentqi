<?php
namespace App\Components;

use Tracy\Debugger;

/**
 * Define a custom exception class to respond with JSON output.
 */
class AjaxException extends \Exception {
	const ERROR_NOT_FOUND = ['code' => 404, 'message' => "Not found."];
	const ERROR_NOT_ALLOWED = ['code' => 403, 'message' => "Not allowed."];
	const ERROR_DATABASE = ['code' => 500, 'message' => "Database error."];
	const ERROR_INVALID_LOGIN = ['code' => 404, 'message' => "Invalid login credentials"];

	/**
	 * @param \App\Presenters\BasePresenter $presenter
	 * @param array                         $code
	 * @param null                          $message
	 */
	public function __construct($presenter, $code, $message = NULL) {
		if (empty($message)) {
			$message = $code['message'];
		}
		parent::__construct($message, $code['code'], NULL);
		if ($code['code'] == 500) {
			Debugger::log($this);
		}
		$presenter->sendResult(['code' => $code['code'], 'status' => 0, 'msg' => $message]);
	}
}