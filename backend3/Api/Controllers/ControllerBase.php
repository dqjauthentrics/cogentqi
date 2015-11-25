<?php
namespace Api\Controllers;

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller {

	public function currentUser() {
		$auth = $this->session->get('auth');
		return $auth;
	}

	public function isLoggedIn() {
		$auth = $this->session->get('auth');
		var_dump($auth);
		return !empty($this->session->get('auth'));
	}

}
