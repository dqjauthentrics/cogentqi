<?php
namespace Api\Controllers;

use Api\Components\ApiResult;
use Api\Models\Member;
use Phalcon\Mvc\Model\Resultset;

class MemberController extends ApiControllerBase {

	/**
	 * List all members.
	 */
	public function indexAction() {
		$data = [];
		$result = new ApiResult();
		if ($this->isLoggedIn()) {
			/**
			 * @var \Phalcon\Mvc\Model\Criteria
			 */
			$members = Member::query()->where("last_name LIKE :n:")->bind(["n" => "%B%"])->orderBy("last_name")->execute();
			/** @var Member $member */
			foreach ($members as $member) {
				$data[] = $member->last_name . ":" . $member->email;
			}
			$result->status = ApiResult::STATUS_OKAY;
		}
		else {
			$data = "Not authenticated.";
		}
		$result->send($data);
	}
}
