<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;

class IndexController extends ControllerBase {

	public function indexAction() {
	}

	/**
	 */
	public function existsAction() {
		$result = new Result();
		$exists = 0;
		try {
			$filePath = $_GET['filePath'];
			if (substr($filePath, 0, 1) == '/') {
				$filePath = substr($filePath, 1);
			}
			$path = dirname(dirname(dirname(__DIR__))) . '/frontend/www/' . $filePath;
			echo "PATH:$path<br/>";
			$exists = (@file_exists($path)) ? 1 : 0;
		}
		catch (\Exception $exception) {
			$result->setError($exception);
		}
		$result->sendNormal($exists);
	}
}
