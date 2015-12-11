<?php
namespace Cogent\Controllers;

use Phalcon\Mvc\Model\Resultset;
use Cogent\Components\Result;
use Cogent\Models\Member;

class SessionController extends \Cogent\Controllers\ControllerBase {

	/**
	 * @param Member $member
	 */
	private function _setSession($member) {
		$memberRec = $member->map();
		$this->session->set('auth', $memberRec);
	}

	/**
	 * Authenticate and log a user into the application.
	 */
	public function loginAction() {
		$result = new Result($this);
		$data = '';
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
			$result->setNormal($this->session->get('auth'));
		}
		else {
			$result->setError(404);
		}
		$result->send();
		exit();
	}

	/**
	 * Finishes the active session redirecting to the index
	 *
	 * @return mixed
	 */
	public function logoutAction() {
		$result = new Result($this);
		$this->session->remove('auth');
		$result->sendNormal("OK");
	}
}