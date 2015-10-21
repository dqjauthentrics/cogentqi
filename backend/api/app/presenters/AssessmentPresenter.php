<?php
namespace App\Presenters;

use App\Components\AjaxResult,
	App\Components\DbContext,
	ResourcesModule\BasePresenter,
	App\Model,
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
				$this->resource[] = Assessment::map($this->database, $record);
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
	 * @param array $formAssessment
	 *
	 * @return \App\Components\AjaxResult
	 * @throws \App\Components\AjaxException
	 */
	private function save($formAssessment) {
		$result = new AjaxResult();
		try {
			if (!empty($formAssessment)) {
				$dbAssessment = $this->database->table('assessment')->where('id=?', $formAssessment["id"])->fetch();
				if (!empty($assessmentRecord)) {
					$simpleRec = [
						"score"             => $formAssessment["sc"],
						"rank"              => $formAssessment["rk"],
						"last_saved"        => $this->database->dbDateTme(),
						"assessor_comments" => $formAssessment["ac"],
						"member_comments"   => $formAssessment["mc"],
						"edit_status"       => $formAssessment["es"],
						"view_status"       => $formAssessment["vs"]
					];
					$dbAssessment->update($simpleRec);
					$formSections = $formAssessment['sections'];
					if (!empty($formSections)) {
						foreach ($formSections as $formSection) {
							$formQuestions = $formSection['questions'];
							if (!empty($formQuestions)) {
								foreach ($formQuestions as $formQuestion) {
									$dbResponse = $this->database->table('assessment_response');
									if (!empty($dbResponse)) {
										$response = $formQuestion["rsp"];
										$responseUpdater = [
											"response_index"    => (int)$response["ri"],
											"response"          => !empty($response["r"]) ? $response["r"] : NULL,
											"assessor_comments" => $response["ac"],
											"member_comments"   => $response["mc"]
										];
										if (!$dbResponse->update($responseUpdater)) {
											throw new \Exception("Error saving response.");
										}
									}
								}
							}
						}
					}
				}
				$result->data = "The assessment was saved.";
				$result->status = AjaxResult::STATUS_OKAY;
			}
			else {
				$result->data = "Invalid assessment record.";
			}
		}
		catch (\Exception $exception) {
			throw new AjaxException(AjaxException::ERROR_FATAL, $exception->getMessage());
		}
		return $result;
	}

	/**
	 * @param int $memberId
	 * @param int $assessorId
	 */
	public function actionCreate($memberId, $assessorId) {
		var_dump($_POST);
		$formAssessment = $this->request->getPost("assessment");
		var_dump($formAssessment);
		exit();
		if (!empty($formAssessment)) {
			$result = $this->save($formAssessment);
		}
		else {
			$result = [];
			$assessment = Assessment::create($this->database, $assessorId, $memberId);
			if (!empty($assessment)) {
				$result = Assessment::map($this->database, $assessment, BasePresenter::MODE_RELATED);
			}
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