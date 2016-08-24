<?php
namespace App\Controllers;

use App\Components\Matrix;
use App\Components\Result;
use App\Models\Assessment;
use App\Models\Organization;
use App\Models\Recommendation;
use App\Models\Role;

class AssessmentController extends ControllerBase {
	public $debug = FALSE;

	/**
	 * @param int $organizationId
	 */
	public function indexAction($organizationId = NULL) {
		$this->byOrganizationAction($organizationId);
		/**
		 * if (empty($organizationId)) {
		 * $result = new Result($this);
		 * $data = $this->mapRecords(Assessment::query()->orderBy("last_saved")->execute(), []);
		 * $result->sendNormal($data);
		 * }
		 * else {
		 * $this->byOrganizationAction($organizationId);
		 * }
		 **/
	}

	/**
	 * @param int $id
	 */
	public function getAction($id) {
		$result = new Result($this);
		$data = [];
		$assessment = Assessment::findFirst($id);
		if (!empty($assessment)) {
			$data = $assessment->map(['instrument' => TRUE, 'schedule' => FALSE, 'responses' => TRUE, 'verbose' => TRUE]);
		}
		else {
			$result->setError(Result::CODE_NOT_FOUND);
		}
		$result->sendNormal($data);
	}

	/**
	 * @todo Replace getAction() call above when moved to I2/A2.
	 */
	public function singleAction($id) {
		$this->getAction($id);
	}

	/**
	 * @param int $memberId
	 */
	public function byMemberAction($memberId) {
		$result = new Result($this);
		$data = $this->mapRecords(Assessment::query()->where('member_id = :id:', ["id" => $memberId])->orderBy("last_saved")->execute());
		$result->sendNormal($data);
	}

	/**
	 * @param int $assessorId
	 */
	public function byAssessorAction($assessorId) {
		$result = new Result($this);
		$data = $this->mapRecords(Assessment::query()->where('assessor_id = :id:', ["id" => $assessorId])->orderBy("last_saved")->execute());
		$result->sendNormal($data);
	}

	/**
	 * @param int $organizationId
	 */
	public function byOrganizationAction($organizationId) {
		$user = $this->currentUser();
		file_put_contents('/tmp/dqj.dbg', 'userId:'.$user->id.PHP_EOL);
		$result = new Result($this);
		$orgModel = new Organization();

		if ($user->app_role_id == Role::PROFESSIONAL) {
			$assessments = Assessment::query()->where('member_id=' . $user->id)->orderBy('last_saved DESC')->execute();
		}
		else {
			// This took 0.140 seconds. Two queries is slightly faster than one, and many times faster than a Phalcon join().
			$memberIds = $orgModel->getMemberIds($organizationId);
			$assessments = Assessment::query()->where('member_id IN (' . $memberIds . ')')->orderBy('last_saved DESC')->execute();

			// This took 4.6 seconds, vs 0.14 seconds for two queries above!
			//$assessments = Assessment::query()->join('App\Models\Member','organization_id=4')->orderBy('last_saved DESC')->execute();

			// This took 0.145 seconds.
			//$assessments = Assessment::query()->where('member_id IN (SELECT m.id FROM App\Models\Member AS m WHERE organization_id=4)')->orderBy('last_saved DESC')->execute();
		}
		if ($assessments === FALSE) {
			$result->setError(Result::CODE_EXCEPTION);
		}
		$data = $this->mapRecords($assessments);
		$result->sendNormal($data);
	}

	/**
	 * @param int $organizationId
	 * @param int $instrumentId
	 */
	public function matrixAction($organizationId, $instrumentId) {
		$result = new Result($this);
		$data = [];
		try {
			//$this->debug = TRUE;
			$organization = Organization::findFirst($organizationId);
			$matrix = new Matrix($this->modelsManager->getReadConnection($organization));
			list($mType, $headers, $rowRecords, $nSections) = $matrix->myMatrix($organizationId, $instrumentId);
			if ($this->debug) {
				$matrix->matrixTable($headers, $rowRecords);
				exit();
			}
			else {
				$data = ['org' => $organization, 'mType' => $mType, 'hdrs' => $headers, 'rows' => $rowRecords, 'nSections' => $nSections];
			}
		}
		catch (\Exception $exception) {
			$result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal($data);
	}

	/**
	 * @param int $memberId
	 * @param int $assessorId
	 */
	public function updateAction($memberId, $assessorId) {
		$result = new Result();
		try {
			$formAssessment = $this->getInputData('data');
			$assessmentModel = new Assessment();
			if (!empty($formAssessment)) {
				$result = $assessmentModel->saveExisting($this, $formAssessment);
			}
			else {
				$result = $assessmentModel->createNew($this, $assessorId, $memberId);
			}
		}
		catch (\Exception $exception) {
			$result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal();
	}

	/**
	 * @param int    $memberId
	 * @param int    $assessmentId
	 * @param string $newState
	 */
	public function lockAction($memberId, $assessmentId, $newState) {
		$result = new Result();
		$transacted = FALSE;
		try {
			$assessment = Assessment::findFirst($assessmentId);
			if (!empty($assessment)) {
				/** @tbd Save the person who locked/unlocked.
				 */
				if ($assessment->edit_status == Assessment::STATUS_ACTIVE && $newState == Assessment::STATUS_LOCKED) {
					$this->beginTransaction($assessment);
					$transacted = TRUE;
					Recommendation::createRecommendationsForMember($assessment->assessee);
				}
				$assessment->update(['edit_status' => $newState]);
				if ($transacted) {
					$this->commitTransaction();
				}
				$result->setNormal($assessment->map());
			}
			else {
				$result->setError(Result::CODE_NOT_FOUND);
			}
		}
		catch (\Exception $exception) {
			if ($transacted) {
				$this->rollbackTransaction();
			}
			$result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal();
	}

	/**
	 */
	public function deleteAction() {
		$result = new Result();
		$assessment = new Assessment();
		$this->beginTransaction($assessment);
		try {
			$data = $this->getInputData();
			$assessmentId = $data['assessmentId'];
			$assessment = Assessment::findFirst($assessmentId);
			if (!empty($assessment)) {
				$responses = $assessment->getResponses();
				if (!empty($responses)) {
					foreach ($responses as $response) {
						$response->delete();
					}
				}
				if ($assessment->delete()) {
					$result->setNormal($assessment, 'Record deleted.');
					$this->commitTransaction();
				}
				else {
					$result->setError(Result::CODE_EXCEPTION, $assessment->errorMessagesAsString());
				}
			}
			else {
				$result->setError(Result::CODE_NOT_FOUND);
			}
		}
		catch (\Exception $exception) {
			$this->rollbackTransaction();
			$result->setException($exception);
		}
		$result->sendNormal();
	}

	/**
	 * @param int $organizationId
	 * @param int $instrumentId
	 */
	public function organizationProgressByMonthAction($organizationId, $instrumentId) {
		$assessmentModel = new Assessment();
		$result = $assessmentModel->organizationProgressByMonth($organizationId, $instrumentId);
		$result->sendNormal();
	}

	/**
	 * @param int $memberId
	 */
	public function memberProgressByMonthAction($memberId) {
		$assessmentModel = new Assessment();
		$result = $assessmentModel->memberProgressByMonthAction($memberId);
		$result->sendNormal();
	}
}
