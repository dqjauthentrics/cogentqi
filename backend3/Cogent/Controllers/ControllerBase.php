<?php
namespace Cogent\Controllers;

use Cogent\Models\CogentModel;
use Phalcon\Mvc\Controller;

class ControllerBase extends Controller {
	public $transactionModel = NULL;
	public $startAction = NULL;

	public function beforeExecuteRoute($dispatcher) {
		$this->startAction = microtime(TRUE);
	}

	public function executionTime() {
		$endAction = microtime(TRUE);
		return !empty($this->startAction) && !empty($endAction) ? $endAction - $this->startAction : 0;
	}

	/**
	 * @param $model
	 *
	 * @return bool
	 */
	public function beginTransaction($model) {
		$this->transactionModel = $model;
		return $this->getWriteConnection($model)->begin();
	}

	/**
	 * @param $model
	 *
	 * @return \Phalcon\Db\AdapterInterface
	 */
	public function getWriteConnection($model) {
		return $this->modelsManager->getWriteConnection($model);
	}

	/**
	 *
	 */
	public function commitTransaction() {
		if (!empty($this->transactionModel)) {
			$this->getWriteConnection($this->transactionModel)->commit();
		}
	}

	/**
	 *
	 */
	public function rollbackTransaction() {
		if (!empty($this->transactionModel)) {
			$this->getWriteConnection($this->transactionModel)->rollback();
		}
	}

	/**
	 * @param null $recordName
	 *
	 * @return mixed
	 */
	public function getInputData($recordName = NULL) {
		$data = json_decode($this->getInput(), TRUE);
		if (!empty($recordName) && !empty($data)) {
			$data = $data[$recordName];
		}
		return $data;
	}

	/**
	 * @return string
	 */
	public function getInput() {
		return file_get_contents('php://input');
	}

	/**
	 * @return mixed
	 */
	public function currentUser() {
		$auth = $this->session->get('auth');
		$user = CogentModel::genericUnmap($auth);
		return (object)$user;
	}

	/**
	 * @return bool
	 */
	public function isLoggedIn() {
		return !empty($this->session->get('auth'));
	}

	/**
	 * @param \Phalcon\Mvc\Model\ResultsetInterface $records
	 *
	 * @return array
	 */
	public function mapRecords($records, $options = FALSE) {
		$data = [];
		if (!empty($records)) {
			/** @var CogentModel $record */
			foreach ($records as $record) {
				if ($options !== FALSE) {
					$data[] = $record->map($options);
				}
				else {
					$data[] = $record->map();
				}
			}
		}
		return $data;
	}
}
