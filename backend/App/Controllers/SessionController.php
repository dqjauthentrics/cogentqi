<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\Member;

class SessionController extends \App\Controllers\ControllerBase {

	/**
	 * @param Member $member
	 */
	private function _setSession($member) {
		$memberRec = $member->map();
		$memberRec['organizationName'] = $member->organization->name;
		$memberRec['nChildOrgs'] = $member->getSingleValue('SELECT COUNT(id) FROM organization WHERE parent_id='.$member->organization_id);
		$memberRec['nMembers'] = $member->getSingleValue('SELECT COUNT(id) FROM member WHERE organization_id='.$member->organization_id);
		unset($memberRec['password']);
		$this->session->set('auth', $memberRec);
	}

	/**
	 * Authenticate and log a user into the application.
	 */
	public function loginAction() {
		$result = new Result($this);
		$postData = json_decode(file_get_contents("php://input"));
		$username = $postData->username;
		$password = $postData->password;
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