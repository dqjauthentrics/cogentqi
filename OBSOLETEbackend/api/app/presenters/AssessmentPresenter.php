<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Presenters;

use App\Components\AjaxException;
use App\Components\AjaxResult;
use App\Model;
use App\Model\Assessment;
use App\Model\Matrix;
use App\Model\Recommendation;
use ResourcesModule\BasePresenter;

class AssessmentPresenter extends BasePresenter {

	/**
	 * @param int $id
	 *
	 * @return \Nette\Database\Table\IRow|array
	 */
	public function retrieve($id, $doMapping = FALSE) {
		$tableName = $this->tableName();
		if (!empty($id)) {
			$result = $this->database->table($tableName)->get($id);
			if ($doMapping && !empty($result)) {
				$result = $this->database->map($result);
			}
		}
		else {
			$result = $this->database->table($tableName)->order('last_modified DESC')->fetchAll();
			if ($doMapping && !empty($result)) {
				$jsonRecords = [];
				foreach ($result as $record) {
					$jsonRecords[] = $this->database->map($record);
				}
				$result = $jsonRecords;
			}
		}
		return $result;
	}

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
		$transacted = FALSE;
		try {
			if (!empty($formAssessment)) {
				$this->database->beginTransaction();
				$transacted = TRUE;
				$dbAssessment = $this->database->table('assessment')->where('id=?', $formAssessment["id"])->fetch();
				if (!empty($dbAssessment)) {
					$saveDateTime = $this->dbDateTime();
					$simpleRec = [
						"member_id"         => $formAssessment["member"]["id"],
						"score"             => $formAssessment["sc"],
						"rank"              => $formAssessment["rk"],
						"last_saved"        => $saveDateTime,
						"last_modified"     => $saveDateTime,
						"assessor_comments" => $formAssessment["ac"],
						"member_comments"   => $formAssessment["mc"],
						"edit_status"       => $formAssessment["es"],
						"view_status"       => $formAssessment["vs"]
					];
					$dbAssessment->update($simpleRec);
					$formSections = $formAssessment['instrument']['sections'];
					if (!empty($formSections)) {
						foreach ($formSections as $formSection) {
							$formQuestions = $formSection['questions'];
							if (!empty($formQuestions)) {
								foreach ($formQuestions as $formQuestion) {
									$response = $formQuestion["rsp"];
									$dbResponse = $this->database->table('assessment_response')->where('id=' . $response['id']);
									if (!empty($dbResponse)) {
										$responseUpdater = [
											"response_index"    => (int)$response["rdx"],
											"response"          => !empty($response["rp"]) ? $response["rp"] : NULL,
											"assessor_comments" => $response["ac"],
											"member_comments"   => $response["mc"]
										];
										$dbResponse->update($responseUpdater);
									}
								}
							}
						}
					}
				}
				Recommendation::createRecommendationsForAssessment($this->database, $dbAssessment->id);
				$this->database->commit();
				$result->data = "The assessment was saved.";
				$result->status = AjaxResult::STATUS_OKAY;
			}
			else {
				$result->data = "Invalid assessment record.";
			}
		}
		catch (\Exception $exception) {
			if ($transacted) {
				$this->database->rollBack();
			}
			//throw new AjaxException(AjaxException::ERROR_FATAL, $exception->getMessage());
			$result->data = $exception;
		}
		return $result;
	}

	/**
	 * @param int $memberId
	 * @param int $assessorId
	 */
	public function actionCreate($memberId, $assessorId) {
		$data = json_decode(file_get_contents('php://input'), TRUE);
		$formAssessment = $data['assessment'];
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