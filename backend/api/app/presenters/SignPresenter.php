<?php

namespace App\Presenters;

use
	Nette,
	ResourcesModule\BasePresenter,
	App\Components\AjaxException;

class SignPresenter extends BasePresenter {

	/**
	 * @param null $username
	 * @param null $password
	 */
	public function actionIn($username = NULL, $password = NULL) {
		$user = $this->getUser();
		if ($user->loggedIn) {
			$this->getUser()->logout();
		}
		if (!empty($_POST)) {
			$username = $_POST["username"];
			$password = $_POST["password"];
		}
		$user->login($username, $password);
		$this->sendResult($this->user->identity->data);
	}

	/**
	 *
	 */
	public function actionOut() {
		$this->getUser()->logout();
		$this->sendResult(["msg" => "logged out"]);
	}
}
