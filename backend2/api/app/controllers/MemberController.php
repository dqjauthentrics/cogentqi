<?php

class MemberController extends \Phalcon\Mvc\Controller {

	public function indexAction() {
		$members = Member::query()
			->where("last_name LIKE :n:")
			->bind(["n" => "B%"])
			->orderBy("last_name")
			->execute();
		foreach ($members as $member) {
			echo $member->last_name . ":" . $member->email . '<br/>';
		}
	}

}

