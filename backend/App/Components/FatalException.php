<?php
namespace Cogent\Components;

class FatalException {
	public static function shutdownHandler() {
		$lasterror = error_get_last();
		switch ($lasterror['type']) {
			case E_ERROR:
			case E_CORE_ERROR:
			case E_COMPILE_ERROR:
			case E_USER_ERROR:
			case E_RECOVERABLE_ERROR:
			case E_CORE_WARNING:
			case E_COMPILE_WARNING:
			case E_PARSE:
				$error = "[SHUTDOWN] lvl:" . $lasterror['type'] . " | msg:" . $lasterror['message'] . " | file:" . $lasterror['file'] . " | ln:" . $lasterror['line'];
				$result = new Result();
				$result->message = $error;
				break;
		}
	}

}