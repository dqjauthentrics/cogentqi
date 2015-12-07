<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\OrganizationOutcome;
use Cogent\Models\Outcome;
use Cogent\Models\OutcomeAlignment;

class OutcomeController extends ControllerBase {

	/**
	 * @parma OrganizationOutcome[] $orgOutLevels
	 *
	 * @param int $orgId
	 * @param int $outcomeId
	 *
	 * @return int
	 */
	private function findLevel($orgOutLevelRecs, $orgId, $outcomeId) {
		/** @var OrganizationOutcome $orgOutLevelRec */
		foreach ($orgOutLevelRecs as $orgOutLevelRec) {
			if ($orgOutLevelRec->organization_id == $orgId && $orgOutLevelRec->outcome_id == $outcomeId) {
				return $orgOutLevelRec->level;
			}
		}
		return 0;
	}

	/**
	 * Return a list.
	 */
	public function indexAction() {
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
	public function getAction($id, $organizationId) {
		$outcome = new Outcome();
		$outcome = $outcome->get($id, FALSE);
		/** @var Outcome $outcome */
		$outcome = $outcome->map(['singleOrgId' => $organizationId]);
		$result = new Result($this);
		$result->sendNormal($outcome);
	}

	/**
	 * @param int $organizationId
	 */
	public function byOrganizationAction($organizationId) {
		$result = new Result($this);
		$outcomeModel = new Outcome();
		$outcomeRecs = $outcomeModel->get(NULL, FALSE, 'sort_order');
		$organizationId = (int)$organizationId;
		$childIds = $outcomeModel->getReadConnection()->query('SELECT retrieveOrgDescendantIds(' . $organizationId . ') AS ids')->fetch();
		$childIds = $childIds[0];

		$queryBuilder = new \Phalcon\Mvc\Model\Query\Builder([
			'models'  => ['Cogent\Models\Organization'],
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
					$outcomes[] = $outcomeRec->map();
				}
				if (empty($orgLevels[$orgId])) {
					$orgLevels[$orgId] = ['id' => $orgId, 'n' => $organizationRec["name"], 'lv' => []];
				}
				$orgLevels[$orgId]['lv'][] = $hasLevels ? (int)$this->findLevel($orgOutLevelRecs, $orgId, $outcomeRec->id) : 0;
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
			if (!empty($data["outcomeId"]) && !empty($data["instrumentId"]) && !empty($data["alignments"])) {
				$outcomeId = $data["outcomeId"];
				$instrumentId = $data["instrumentId"];
				$formAlignments = $data["alignments"];
				if (!empty($formAlignments)) {
					/** @var OutcomeAlignment[] $alignments */
					$alignments = OutcomeAlignment::query()->where('outcome_id=:id:',['id' => $outcomeId])->execute();
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
}