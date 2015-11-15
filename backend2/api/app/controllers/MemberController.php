<?php

class MemberController extends \Phalcon\Mvc\Controller {

	public function indexAction() {
		$members = Member::find();
		foreach ($members as $member) {
			echo $member->email.'<br/>';
		}
	}

}

