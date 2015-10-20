<?php

namespace App\Presenters;

use App\Components\AjaxResult;
use
	Nette,
	ResourcesModule\BasePresenter,
	App\Components\AjaxException;

class SignPresenter extends BasePresenter {

	/**
	 */
	public function actionCreate() {
		$result = new AjaxResult();
		try {
			$user = $this->getUser();
			if ($user->loggedIn) {
				$this->getUser()->logout();
			}
			if (!empty($_POST)) {
				$username = $_POST["username"];
				$password = $_POST["password"];
				$user->login($username, $password);
				$result->status = AjaxResult::STATUS_OKAY;
				$result->data = $this->user->identity->data;
			}
		}
		catch (\Exception $exception) {
			$result->data = $exception->getMessage();
		}
		$this->sendResult($result);
	}

	/**
	 *
	 */
	public function actionDelete() {
		$this->getUser()->logout();
		$this->sendResult(["msg" => "logged out"]);
	}
}
