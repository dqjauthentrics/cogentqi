<?php
namespace Api\Controllers;

use Api\Models\Member;
use Phalcon\Mvc\Model\Resultset;

class SessionController extends ApiControllerBase {

	/**
	 * @param Member $member
	 */
	private function _setSession($member) {
		$memberRec = $member->map();
		var_dump($memberRec);
		$this->session->set('auth', $memberRec);
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
				'bind'      => ['username' => $username, 'password' => md5($password)],
				'hydration' => Resultset::HYDRATE_RECORDS
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

	/**
	 * Finishes the active session redirecting to the index
	 *
	 * @return mixed
	 */
	public function logoutAction() {
		$this->session->remove('auth');
		echo "OK";
		exit();
	}
}