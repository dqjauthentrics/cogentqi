<?php

class Api {
	/**
	 * @param \Slim\Slim $app
	 * @param            $data
	 */
	public static function sendResult($app, $data) {
		$app->response()->header("Content-Type", "application/json");
		echo json_encode($data);
		exit();
	}
}