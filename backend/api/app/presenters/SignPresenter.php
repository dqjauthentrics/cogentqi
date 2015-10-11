<?php

namespace App\Presenters;

use
	Nette,
	\App\Model\Member,
	ResourcesModule,
	\App\Components\AjaxException;

class SignPresenter extends ResourcesModule\BasePresenter {

	public function actionIn($username, $password) {
		$user = $this->getUser();
		if ($user->loggedIn) {
			$this->getUser()->logout();
		}
		$user->login($username, $password);
		$this->sendResult($this->user->identity->data);
	}

	public function actionOut() {
		$this->getUser()->logout();
		$this->sendResult(["msg" => "logged out"]);
	}
}
