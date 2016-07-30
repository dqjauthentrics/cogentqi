<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Member;

class SessionController extends \Cogent\Controllers\ControllerBase {

	/**
	 * @param Member $member
	 */
	private function _setSession($member) {
		$memberRec = $member->map();
		$memberRec['org'] = $member->organization->name;
		$this->session->set('auth', $memberRec);
	}

	/**
	 * Authenticate and log a user into the application.
	 */
	public function loginAction() {
		$result = new Result($this);
		if ($this->request->isPost()) {
			$username = $this->request->getPost('username');
			$password = $this->request->getPost('password');
			if (empty($username)) { //@todo Greg? This is how it works for Angular 2.  I do not understand how to get it to work as a 'regular' PHP post.
				$postData = json_decode(file_get_contents("php://input"));
				$username = $postData->username;
				$password = $postData->password;
			}
		}
		else {
			$username = @$_REQUEST["username"];
			$password = @$_REQUEST["password"];
		}
		$member = Member::findFirst([
				'conditions' => "(email = :username: OR username = :username:) AND password = :password:",
				'bind'       => ['username' => $username, 'password' => md5($password)]
			]
		);
		if ($member != FALSE) {
			$this->_setSession($member);
			$data = $this->session->get('auth');
			$result->setNormal($data);
		}
		else {
			$result->setError(404, 'u=' . @$username);
		}
		$result->send();
		exit();
	}

	/**
	 * Finishes the active session redirecting to the index
	 **/
	public function logoutAction() {
		$result = new Result($this);
		$this->session->remove('auth');
		$result->sendNormal("OK");
	}
}