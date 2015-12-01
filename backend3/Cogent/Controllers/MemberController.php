<?php
namespace Cogent\Controllers;

use Phalcon\Mvc\Model\Resultset;
use Cogent\Components\Result;
use Cogent\Models\Member;

class MemberController extends ControllerBase {

	/**
	 * List all members.
	 */
	public function indexAction() {
		$result = new Result();
		$data = [];
		$members = Member::query()->where("last_name LIKE :n:")->bind(["n" => "%B%"])->orderBy("last_name")->execute();
		/** @var Member $member */
		foreach ($members as $member) {
			//$data[] = $member->last_name . ":" . $member->email;
			$data[] = $member->map();
		}
		$result->sendNormal($data);
	}
}
