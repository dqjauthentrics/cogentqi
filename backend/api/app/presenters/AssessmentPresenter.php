<?php
namespace App\Presenters;

use ResourcesModule\BasePresenter,
	App\Model\Assessment,
	App\Model\Matrix,
	App\Components\AjaxException;

class AssessmentPresenter extends BasePresenter {

	/**
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionRead($id, $mode = self::MODE_LISTING) {
		$this->resource = [];
		$result = $this->retrieve($id);
		if (empty($result)) {
			throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
		}
		if (!empty($id)) {
			$this->resource = Assessment::map($this->database, $result, $mode);
		}
		else {
			foreach ($result as $record) {
				$this->resource[] = Assessment::map($this->database, $result);
			}
		}
		$this->sendResource();
	}

	/**
	 * @param int $organizationId
	 * @param int $instrumentId
	 */
	public function actionMatrix($organizationId, $instrumentId) {
		$organization = $this->database->table('organization')->get($organizationId);
		$matrix = new Matrix($this->database);
		list($mType, $headers, $rowRecords, $nSections) = $matrix->myMatrix($organizationId, $instrumentId);
		if ($this->debug) {
			$matrix->matrixTable($headers, $rowRecords);
			exit();
		}
		else {
			$this->sendResult([['org' => $organization, 'mType' => $mType, 'hdrs' => $headers, 'rows' => $rowRecords, 'nSections' => $nSections]]);
		}
	}

	/**
	 * @param int $memberId
	 * @param int $assessorId
	 */
	public function actionCreate($memberId, $assessorId) {
		$result = [];
		$assessment = Assessment::create($this->database, $assessorId, $memberId);
		if (!empty($assessment)) {
			$result = Assessment::map($this->database, $assessment, BasePresenter::MODE_RELATED);
		}
		$this->sendResult($result);
	}

	/**
	 * @param int $organizationId
	 * @param int $instrumentId
	 */
	public function actionProgressByMonth($organizationId, $instrumentId) {
		$graphData = Assessment::progressByMonthOrganization($this->pdo, $organizationId, $instrumentId);
		$this->sendResult($graphData);
	}

	/**
	 * @param int $memberId
	 */
	public function actionProgressByMonthIndividual($memberId) {
		$graphData = Assessment::progressByMonthIndividual($this->pdo, $memberId);
		$this->sendResult($graphData);
	}
}