<?php
namespace Api\Controllers;

class ErrorController extends ControllerBase {

	public function show404Action() {
		echo "404";
		exit();
	}

	public function show401Action() {
		echo "401";
		exit();
	}

	public function show500Action() {
		echo "500";
		exit();
	}
}