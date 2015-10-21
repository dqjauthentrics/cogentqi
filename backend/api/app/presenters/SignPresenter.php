<?php

namespace App\Presenters;

use App\Components\AjaxResult;
use
	Nette,
	ResourcesModule\BasePresenter,
	App\Components\AjaxException;

class SignPresenter extends BasePresenter {

	/**
	 * @param string $username
	 * @param string $password
	 *
	 * @return \App\Components\AjaxResult
	 */
	private function signIn($username, $password) {
		$result = new AjaxResult();
		try {
			$user = $this->getUser();
			if ($user->loggedIn) {
				$this->getUser()->logout();
			}
			$user->login($username, $password);
			$result->status = AjaxResult::STATUS_OKAY;
			$result->data = $this->user->identity->data;
		}
		catch (\Exception $exception) {
			$result->data = $exception->getMessage();
		}
		return $result;
	}

	/**
	 */
	public function actionCreate() {
		$result = new AjaxResult();
		try {
			$result = $this->signIn($_POST["username"], $_POST["password"]);
		}
		catch (\Exception $exception) {
			$result->data = $exception->getMessage();
		}
		$this->sendResult($result);
	}

	/**
	 * @param string $username
	 * @param string $password
	 */
	public function actionDebug($username, $password) {
		$result = new AjaxResult();
		try {
			$result = $this->signIn($username, $password);
		}
		catch (\Exception $exception) {
			$result->data = $exception->getMessage();
		}
		$this->sendResult($result);
	}

	public function actionOut() {
		$this->getUser()->logout();
		$this->sendResult(["msg" => "logged out"]);
	}

	/**
	 *
	 */
	public function actionDelete() {
		$this->getUser()->logout();
		$this->sendResult(["msg" => "logged out"]);
	}
}
