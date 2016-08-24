<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\Role;

class SettingController extends ControllerBase {
	/**
	 */
	public function indexAction() {
		$result = new Result();
		$user = @$_SESSION["user"];
		$roleId = empty($user) ? Role::PROFESSIONAL : @$user["roleId"];

		$settings = [
			['id' => 1, 'n' => 'Enable Email Notifications for Me', 'v' => 0],
			['id' => 2, 'n' => 'Share My Development Badges on Facebook', 'v' => 1],
			['id' => 3, 'n' => 'Notify Me When Development Resources are Added or Updated', 'v' => 1],
		];
		switch ($roleId) {
			case Role::MANAGER:
				$settings = [
					['id' => 1, 'n' => 'Enable Email Notifications for Me', 'v' => 0],
				];
				break;
			case ROLE::ADMINISTRATOR:
				$settings = [
					['id' => 1, 'n' => 'Enable Email Notifications for Me', 'v' => 0],
					['id' => 1, 'n' => 'Notify Me When Store Hit Danger Thresholds', 'v' => 0],
				];
				break;
		}
		$result->sendNormal($settings);
	}
}