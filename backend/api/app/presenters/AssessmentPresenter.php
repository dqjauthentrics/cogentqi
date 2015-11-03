<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Presenters;

use App\Components\AjaxResult,
	ResourcesModule\BasePresenter,
	App\Model,
	App\Model\Recommendation,
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
		$organization = $this->database->map($this->database->table('organization')->get($organizationId));
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
											"response_index"    => (int)$response["rdx"],
											"response"          => !empty($response["rp"]) ? $response["rp"] : NULL,
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
		$formAssessment = $this->request->getPost("assessment");
		if (!empty($formAssessment)) {
			$result = $this->save($formAssessment);
		}
		else {
			$result = [];
			$assessment = Assessment::create($this->database, $assessorId, $memberId);
			if (!empty($assessment)) {
				$result = $assessment;
			}
		}
		$this->sendResult($result);
	}

	/**
	 * @param int $id
	 *
	 * @return \App\Components\AjaxResult
	 * @throws \App\Components\AjaxException
	 *
	 */
	public function actionDelete($id) {
		$result = new AjaxResult();
		$this->database->beginTransaction();
		try {
			$assessment = $this->database->table('assessment')->where('id=?', $id)->fetch();
			/**
			 * @var \Nette\Database\Table\Selection $assessment
			 * @var \Nette\Database\Table\Selection $response
			 */
			if (!empty($assessment)) {
				$responses = $this->database->table('assessment_response')->where('assessment_id = ?', $id)->fetchAll();
				if (!empty($responses)) {
					foreach ($responses as $response) {
						$response->delete();
					}
				}
				$assessment->delete();
				$this->database->commit();
				$result->status = AjaxResult::STATUS_OKAY;
				$result->message = "Assessment removed.";
				$result->data = $assessment;
			}
		}
		catch (\Exception $exception) {
			$this->database->rollBack();
			throw new AjaxException(AjaxException::ERROR_FATAL, $exception);
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

	/**
	 * @param int $id
	 */
	public function actionReadRecommendations($id) {
		$result = Recommendation::recommend($this->database, $id);
		$this->sendResult($result);
	}
}