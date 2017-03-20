<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\Outcome;
use App\Models\OutcomeAlignment;
use App\Models\OutcomeReport;

class OutcomeController extends ControllerBase {

	/**
	 * Return a list.
	 */
	public function listAction() {
		$outcome = new Outcome();
		$data = $outcome->get(null,true,'id','1=1',[],['minimal' => TRUE]);
		$result = new Result($this);
		$result->sendNormal($data);
	}

	/**
	 * Return a single record.
	 *
	 * @param int $id
	 * @param int $organizationId
	 */
	public function singleAction($id, $organizationId) {
		$outcome = new Outcome();
		$outcome = $outcome->get($id, FALSE);
		/** @var Outcome $outcome */
		$outcome = $outcome->map(['singleOrgId' => $organizationId]);
		$result = new Result($this);
		$result->sendNormal($outcome);
	}

	/**
	 * @param int                $outcomeId
	 * @param int                $questionId
	 * @param OutcomeAlignment[] $alignments
	 *
	 * @return OutcomeAlignment|null
	 */
	private function findAlignment($outcomeId, $questionId, $alignments) {
		if (!empty($alignments)) {
			foreach ($alignments as $alignment) {
				if ($alignment->question_id == $questionId && $alignment->outcome_id == $outcomeId) {
					return $alignment;
				}
			}
		}
		return NULL;
	}

	/**
	 * Save given alignments for given outcome record.
	 */
	public function saveAlignmentsAction() {
		$result = new Result($this);
		try {
			$data = $this->getInputData();
			if (!empty($data["outcome"])) {
				$formOutcome = $data["outcome"];
				$outcomeId = $formOutcome["id"];
				$outcomeRecord = Outcome::findFirst($outcomeId);
				/** @var Outcome $outcomeRecord */
				if (!$outcomeRecord->update(['name' => $formOutcome['n'], 'number' => $formOutcome['nmb'], 'description' => $formOutcome['sm']])) {
					throw new \Exception($outcomeRecord->errorMessagesAsString());
				}
				$formAlignments = $data["alignments"];
				if (!empty($formAlignments)) {
					/** @var OutcomeAlignment[] $alignments */
					$alignments = OutcomeAlignment::query()->where('outcome_id=:id:', ['id' => $outcomeId])->execute();
					foreach ($formAlignments as $questionId => $weight) {
						$dbRecord = $this->findAlignment($outcomeId, $questionId, $alignments);
						if (!empty($dbRecord)) {
							if (empty($weight)) {
								$dbRecord->delete();
							}
							else {
								$dbRecord->update(['weight' => $weight]);
							}
						}
						else {
							if (!empty($weight)) {
								$alignment = ['outcome_id' => $outcomeId, 'question_id' => $questionId, 'weight' => $weight];
								$dbRecord = new OutcomeAlignment();
								$dbRecord->save($alignment);
							}
						}
					}
				}
				$result->setNormal();
			}
		}
		catch (\Exception $exception) {
			$result->sendError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal();
	}

	/**
	 * @param OutcomeReport $report
	 * @param Outcome $outcome
	 * @param int $userId
	 * @param int $level
	 *
	 * @throws \Exception
	 */
	private function saveOutcomeLevel($report, $outcome, $userId, $level) {
		$this->beginTransaction($report);
		try {
			$this->beginTransaction($report);
			$updateResult = $report->save([
				'outcome_id'   => $outcome->id,
				'evaluator_id' => $userId,
				'evaluated'    => $outcome->dbDateTime(),
				'level'        => $level
			]);
			if (!$updateResult) {
				throw new \Exception($report->errorMessagesAsString());
			}
			$outcome->level = $level;
			if (!$outcome->save()) {
				throw new \Exception($report->errorMessagesAsString());
			}
		}
		catch (\Exception $exception) {
			$this->rollbackTransaction();
			throw new \Exception($exception);
		}
		$this->commitTransaction();
	}

	/**
	 * Save given levels for given outcome record and organization.
	 */
	public function saveLevelAction() {
		$result = new Result($this);
		try {
			$user = $this->currentUser();
			$formData = $this->getInputData('data');
			if (!empty($formData['id']) && !empty($formData['level'])) {
				$outcome = Outcome::findFirst($formData['id']);
				if ($outcome) {
					$report = new OutcomeReport();
					$this->saveOutcomeLevel($report, $outcome, $user->id, (int)$formData['level']);
				}
				$result->setNormal();
			}
		}
		catch (\Exception $exception) {
			$result->sendError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal();
	}

	/**
	 * @param int $organizationId
	 */
	public function trendsAction($organizationId) {
		$outcomeModel = new Outcome();
		$result = $outcomeModel->getTrends($organizationId);
		$result->sendNormal();
	}

}