<?php
namespace Api\Controllers;

use Phalcon\Mvc\Controller;

class ApiControllerBase extends Controller {

	public function currentUser() {
		$auth = $this->session->get('auth');
		return $auth;
	}

	public function isLoggedIn() {
		return !empty($this->session->get('auth'));
	}

}
