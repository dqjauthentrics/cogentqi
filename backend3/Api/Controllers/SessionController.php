<?php
namespace Api\Controllers;
use Api\Models\Member;

class SessionController extends ApiControllerBase {

	/**
	 * @param $member
	 */
	private function _setSession($member) {
		$this->session->set('auth', ['id' => $member->id]);
	}

	/**
	 * Authenticate and log a user into the application.
	 */
	public function loginAction() {
		if ($this->request->isPost()) {
			$username = $this->request->getPost('username');
			$password = $this->request->getPost('password');
		}
		else {
			$username = @$_GET["username"];
			$password = @$_GET["password"];
		}
		$member = Member::findFirst([
				"(email = :username: OR username = :username:) AND password = :password:",
				'bind' => ['username' => $username, 'password' => md5($password)]
			]
		);
		if ($member != FALSE) {
			$this->_setSession($member);
			$auth = $this->session->get('auth');
			var_dump($auth);
		}
		else {
			echo "Member not found ($username/$password).";
		}
	}
}