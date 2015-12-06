<?php
namespace Cogent\Controllers;

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller {
	public $transactionModel = NULL;

	public function getWriteConnection($model) {
		return $this->modelsManager->getWriteConnection($model);
	}

	public function beginTransaction($model) {
		$this->transactionModel = $model;
		return $this->getWriteConnection($model)->begin();
	}
	public function commitTransaction() {
		$this->getWriteConnection($this->transactionModel)->commit();
	}

	public function rollbackTransaction() {
		$this->getWriteConnection($this->transactionModel)->rollback();
	}

	public function getInput() {
		return file_get_contents('php://input');
	}

	public function getInputData($recordName = NULL) {
		$data = json_decode($this->getInput(), TRUE);
		if (!empty($recordName) && !empty($data)) {
			$data = $data[$recordName];
		}
		return $data;
	}

	public function currentUser() {
		return $this->session->get('auth');
	}

	public function isLoggedIn() {
		return !empty($this->session->get('auth'));
	}
}
