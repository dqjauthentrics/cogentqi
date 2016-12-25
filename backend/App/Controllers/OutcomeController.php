<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\OrganizationOutcome;
use App\Models\Outcome;
use App\Models\OutcomeAlignment;

class OutcomeController extends ControllerBase {

	/**
	 * Finds and returns a level record in the list of database records for the given organization and outcome, returning an array pair in the form:
	 *   [outcomeId, level]
	 *
	 * NB: If no record is found, a pair will still be returned with a level of 0.
	 *
	 * @parma OrganizationOutcome[] $orgOutLevels
	 *
	 * @param int $orgId
	 * @param int $outcomeId
	 *
	 * @return int[]
	 */
	private function findLevel($orgOutLevelRecs, $orgId, $outcomeId) {
		/** @var OrganizationOutcome $orgOutLevelRec */
		foreach ($orgOutLevelRecs as $orgOutLevelRec) {
			if ($orgOutLevelRec->organization_id == $orgId && $orgOutLevelRec->outcome_id == $outcomeId) {
				return [(int)$outcomeId, $orgOutLevelRec->level];
			}
		}
		return [(int)$outcomeId, 0];
	}

	/**
	 * Return a list.
	 */
	public function listAction() {
		$outcome = new Outcome();
		$data = $outcome->get();
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
	 * Returns a list of outcomes with current organization levels and optional alignments.  Levels are an array for each organization, with
	 * each element in the form [outcomeId, level].
	 *
	 * @param int $organizationId
	 * @param int $includeAlignments
	 */
	public function byOrganizationAction($organizationId, $includeAlignments = 0) {
		$result = new Result($this);
		$outcomeModel = new Outcome();
		$outcomeRecs = $outcomeModel->get(NULL, FALSE, 'sort_order');
		$organizationId = (int)$organizationId;
		$childIds = $outcomeModel->getReadConnection()->query('SELECT retrieveOrgDescendantIds(' . $organizationId . ') AS ids')->fetch();
		$childIds = $childIds[0];

		$queryBuilder = new \Phalcon\Mvc\Model\Query\Builder([
			'models'  => ['App\Models\Organization'],
			'columns' => ['id', 'name', 'retrieveOrgDescendantIds(id) AS child_ids'],
		]);
		$organizationRecs = $queryBuilder->where("id IN ($childIds)")->orderBy('id<>' . $organizationId . ',parent_id,name')->getQuery()->execute();
		$orgOutLevelRecs = OrganizationOutcome::query()->where("organization_id IN ($childIds)")->orderBy('organization_id,evaluated DESC')->execute();

		$orgLevels = [];
		$outcomes = [];
		$firstPass = TRUE;
		$hasLevels = $orgOutLevelRecs !== FALSE;
		foreach ($organizationRecs as $organizationRec) {
			$orgId = (int)$organizationRec["id"];
			/** @var Outcome $outcomeRec */
			foreach ($outcomeRecs as $outcomeRec) {
				if ($firstPass) {
					$outcomes[] = $outcomeRec->map(['alignments' => $includeAlignments]);
				}
				if (empty($orgLevels[$orgId])) {
					$orgLevels[$orgId] = ['id' => $orgId, 'n' => $organizationRec["name"], 'lv' => []];
				}
				$orgLevels[$orgId]['lv'][] = $hasLevels ? $this->findLevel($orgOutLevelRecs, $orgId, $outcomeRec->id) : 0;
			}
			$firstPass = FALSE;
		}
		$levels = [];
		foreach ($orgLevels as $orgId => $orgLevel) { // change from associative to indexed array
			$levels[] = $orgLevel;
		}
		$result->sendNormal(['outcomes' => $outcomes, 'orgLevels' => $levels]);
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
				if (!$outcomeRecord->update(['name' => $formOutcome['n'], 'number' => $formOutcome['nmb'], 'summary' => $formOutcome['sm']])) {
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
	 * @param int   $outcomeId
	 * @param array $levels
	 *
	 * @return int
	 */
	private function findFormLevel($outcomeId, $levels) {
		if (!empty($levels)) {
			foreach ($levels as $level) {
				if ($level[0] == $outcomeId) {
					return $level[1];
				}
			}
		}
		return 0;
	}

	/**
	 * Save given levels for given outcome record and organization.
	 *
	 * NB: This assumes that the levels provided in the form are in the same order as the sort_order column in the database.
	 */
	public function saveLevelsAction() {
		$result = new Result($this);
		$model = new OrganizationOutcome();
		$this->beginTransaction($model);
		try {
			$user = $this->currentUser();
			$formData = $this->getInputData('orgLevels');
			if (!empty($formData['id']) && !empty($formData['lv'])) {
				$outcomes = Outcome::find(['order' => 'sort_order']);
				$idx = 0;
				foreach ($outcomes as $outcome) {
					$dbRecord = OrganizationOutcome::findFirst([
						'conditions' => 'outcome_id=:out: AND organization_id=:oid:',
						'bind'       => ['out' => $outcome->id, 'oid' => (int)$formData['id']],
						'order'      => 'evaluated DESC',
					]);
					$updater = [
						'organization_id' => (int)$formData['id'],
						'outcome_id'      => $outcome->id,
						'evaluator_id'    => $user->id,
						'evaluated'       => $outcome->dbDateTime(),
						'level'           => $this->findFormLevel($outcome->id, $formData['lv'])
					];
					if (!empty($dbRecord)) {
						$updateResult = $dbRecord->update($updater);
					}
					else {
						$dbRecord = new OrganizationOutcome();
						$updateResult = $dbRecord->save($updater);
					}
					if (!$updateResult) {
						throw new \Exception($dbRecord->errorMessagesAsString());
					}
					$idx++;
				}
				$result->setNormal();
				$this->commitTransaction();
			}
		}
		catch (\Exception $exception) {
			$this->rollbackTransaction();
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