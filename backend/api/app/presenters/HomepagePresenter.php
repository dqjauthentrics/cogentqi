<?php

namespace App\Presenters;

use Nette,
	ResourcesModule\BasePresenter;


class HomepagePresenter extends BasePresenter {

	public function renderDefault() {
		echo "Default";
		exit();
	}

	/**
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionRead($id, $mode = self::MODE_LISTING) {
		if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
			$result = ['hello'];
			$this->sendResult($result);
		}
		else {
			echo '<h1>Hello</h1>';
			$this->terminate();
		}
	}

}
