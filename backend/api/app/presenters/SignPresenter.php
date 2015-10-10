<?php

namespace App\Presenters;

use
	Nette,
	\App\Model\Member,
	\App\Components\AjaxException;

class SignPresenter extends BasePresenter {

	public function actionIn($username, $password) {
		$user = $this->getUser();
		if ($user->loggedIn) {
			$this->getUser()->logout();
		}
		$user->login($username, $password);
		$this->sendResult(@$_SESSION["user"]);
	}

	public function actionOut() {
		$this->getUser()->logout();
		$this->sendResult(["msg" => "logged out"]);
	}
}
