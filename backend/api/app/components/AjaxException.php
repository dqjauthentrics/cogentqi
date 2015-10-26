<?php
namespace App\Components;

use Tracy\Debugger;

/**
 * Define a custom exception class to respond with JSON output.
 */
class AjaxException extends \Exception {
	const ERROR_NOT_FOUND = ['code' => 404, 'message' => "Not found."];
	const ERROR_NOT_ALLOWED = ['code' => 403, 'message' => "Not allowed."];
	const ERROR_FATAL = ['code' => 500, 'message' => "Database error."];
	const ERROR_INVALID_LOGIN = ['code' => 404, 'message' => "Invalid login credentials"];

	/**
	 * @param \Exception|array $code
	 * @param null             $message
	 */
	public function __construct($code, $message = NULL) {
		if (is_object($code)) {
			$result = new AjaxResult(AjaxResult::STATUS_ERROR, $code->getMessage(), 500);
		}
		else {
			if (empty($message)) {
				$message = @$code['message'];
			}
			$codeNumber = (is_int($code) ? $code : is_array($code) ? $code["code"] : 500);
			parent::__construct($message, $codeNumber, NULL);
			if ($codeNumber == 500) {
				Debugger::log($this);
			}
			$result = new AjaxResult(AjaxResult::STATUS_ERROR, $message, $code['code']);
		}
		$result->send();
	}
}