<?php
namespace Cogent\Controllers;

use Cogent\Components\Matrix;
use Cogent\Components\Result;
use Cogent\Models\Assessment;
use Cogent\Models\AssessmentResponse;
use Cogent\Models\Organization;
use Phalcon\Mvc\Model\Resultset;

class AssessmentController extends ControllerBase {
	public $debug = TRUE;

	/**
	 * @param string $parentType
	 * @param        int
	 * $id
	 */
	public function indexAction($parentType, $id) {
		$result = new Result();
		$data = [];
		$where = "member_id = :id:";
		$assessments = [];
		if ($parentType == "member") {
			$assessments = Assessment::query()->where($where)->bind(["id" => $id])->orderBy("last_saved")->execute();
		}
		elseif ($parentType == "organization") {
			$assessments = Assessment::query()->join('Cogent\Models\Member', 'organization_id=:id:')->bind(["id" => $id])->execute();
		}
		/** @var Assessment $assessment */
		foreach ($assessments as $assessment) {
			$data[] = $assessment->map();
		}
		$result->sendNormal($data);
	}

	/**
	 * @param int $organizationId
	 * @param int $instrumentId
	 */
	public function matrixAction($organizationId, $instrumentId) {
		$result = new Result();
		$data = [];
		try {
			$organization = Organization::findFirst($organizationId);
			$matrix = new Matrix($this->modelsManager->getReadConnection($organization));
			list($mType, $headers, $rowRecords, $nSections) = $matrix->myMatrix($organizationId, $instrumentId);
			if ($this->debug) {
				$matrix->matrixTable($headers, $rowRecords);
				exit();
			}
			else {
				$data = [['org' => $organization, 'mType' => $mType, 'hdrs' => $headers, 'rows' => $rowRecords, 'nSections' => $nSections]];
			}
		}
		catch (\Exception $exception) {
			$result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal($data);
	}

	/**
	 * @param array $formAssessment
	 *
	 * @return \Cogent\Components\Result
	 */
	private function save($formAssessment) {
		$result = new Result();
		$transacted = FALSE;
		try {
			if (!empty($formAssessment)) {
				$assessment = Assessment::findFirst($formAssessment["id"]);
				if (!empty($dbAssessment)) {
				$this->beginTransaction($assessment);
				$transacted = TRUE;
					$saveDateTime = $assessment->dateTme();
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
					$assessment->update($simpleRec);
					$formSections = $formAssessment['instrument']['sections'];
					if (!empty($formSections)) {
						foreach ($formSections as $formSection) {
							$formQuestions = $formSection['questions'];
							if (!empty($formQuestions)) {
								foreach ($formQuestions as $formQuestion) {
									$formResponse = $formQuestion["rsp"];
									$response = AssessmentResponse::query()->where('id=' . $response['id']);
									/** @var AssessmentResponse $response */
									if (!empty($response)) {
										$responseUpdater = [
											"response_index"    => (int)$formResponse["rdx"],
											"response"          => !empty($formResponse["rp"]) ? $formResponse["rp"] : NULL,
											"assessor_comments" => $formResponse["ac"],
											"member_comments"   => $formResponse["mc"]
										];
										$response->update($responseUpdater);
									}
								}
							}
						}
					}
				}
				//Recommendation::createRecommendationsForAssessment($this->database, $dbAssessment->id);
				$this->commitTransaction();
				$result->setNormal();
			}
			else {
				$result->setError();
			}
		}
		catch (\Exception $exception) {
			if ($transacted) {
				$this->rollbackTransaction();
			}
			$result->setException($exception);
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
