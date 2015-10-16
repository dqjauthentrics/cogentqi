<?php
namespace App\Presenters;

use ResourcesModule\BasePresenter;

class SettingPresenter extends BasePresenter {

	public function actionRead($id) {
		$user = @$_SESSION["user"];
		$roleId = empty($user) ? 'T' : @$user["roleId"];

		$settings = [
			['id' => 1, 'n' => 'Enable Email Notifications for Me', 'v' => 0],
			['id' => 2, 'n' => 'Share My Development Badges on Facebook', 'v' => 1],
			['id' => 3, 'n' => 'Notify Me When Development Resources are Added or Updated', 'v' => 1],
		];
		switch ($roleId) {
			case 'M':
				$settings = [
					['id' => 1, 'n' => 'Enable Email Notifications for Me', 'v' => 0],
				];
				break;
			case 'A':
				$settings = [
					['id' => 1, 'n' => 'Enable Email Notifications for Me', 'v' => 0],
					['id' => 1, 'n' => 'Notify Me When Store Hit Danger Thresholds', 'v' => 0],
				];
				break;
		}
		$this->sendResult($settings);
	}
}