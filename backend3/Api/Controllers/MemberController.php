<?php
namespace Api\Controllers;

use Api\Components\AppResult;
use Api\Models\Member;

class MemberController extends ApiControllerBase {

	/**
	 * List all members.
	 */
	public function indexAction() {
		$data = [];
		$result = new AppResult();
		if ($this->isLoggedIn()) {
			$members = Member::query()
				->where("last_name LIKE :n:")
				->bind(["n" => "%B%"])
				->orderBy("last_name")
				->execute();
			/** @var Member $member */
			foreach ($members as $member) {
				$data[] = $member->last_name . ":" . $member->email;
			}
			$result->status = AppResult::STATUS_OKAY;
		}
		else {
			$data = "Not authenticated.";
		}
		$result->send($data);
	}
}
