<?php
namespace Cogent\Controllers;

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller {

	public function currentUser() {
		return $this->session->get('auth');
	}

	public function isLoggedIn() {
		return !empty($this->session->get('auth'));
	}

}
