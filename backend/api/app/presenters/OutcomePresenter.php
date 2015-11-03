<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Presenters;

use App\Components\AjaxResult;
use Nette,
	Drahak\Restful\IResource,
	ResourcesModule\BasePresenter,
	App\Model\Outcome,
	ResourcesModule,
	Nette\Database\Table\IRow,
	App\Components\AjaxException;

class OutcomePresenter extends BasePresenter {

	/**
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionRead($id, $mode = self::MODE_LISTING) {
		if ($this->user->isAllowed('Outcome', 'read')) {
			if (!empty($id)) {
				/** @var IRow $outcome */
				$outcome = $this->database->table('outcome')->get($id);
				if (empty($outcome)) {
					throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
				}
				$jsonRec = Outcome::map($this->database, $outcome, $mode);
			}
			else {
				$outcomes = $this->database->table('outcome')->fetchAll();
				if (empty($outcomes)) {
					throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
				}
				$jsonRec = [];
				foreach ($outcomes as $outcome) {
					$jsonRec[] = Outcome::map($this->database, $outcome, $mode);
				}
			}
			$this->sendResult($jsonRec);
			//$this->resource = $jsonRec;
			//$this->sendResource(IResource::XML);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
	}

	/**
	 * @param Nette\Database\Table\IRow[] $orgOutLevels
	 * @param int                         $orgId
	 * @param int                         $outcomeId
	 *
	 * @return int
	 */
	private function findLevel($orgOutLevelRecs, $orgId, $outcomeId) {
		foreach ($orgOutLevelRecs as $orgOutLevelRec) {
			if ($orgOutLevelRec["organization_id"] == $orgId && $orgOutLevelRec["outcome_id"] == $outcomeId) {
				return $orgOutLevelRec["level"];
			}
		}
		return 0;
	}

	public function actionReadOrganizations($id, $mode = self::MODE_LISTING) {
		$result = new AjaxResult();
		if ($this->user->isAllowed('Organization', 'outcomes')) {
			$outcomeRecs = $this->database->table('outcome')->order('sort_order')->fetchAll();
			$childIds = $this->database->query('SELECT retrieveOrgDescendantIds(?) AS ids', $id)->fetchField('ids');
			$organizationRecs = $this->database->table('organization')
				->select('id,name,retrieveOrgDescendantIds(id) AS child_ids')
				->where("id IN ($childIds)")
				->order('id<>?,parent_id,name', $id)
				->fetchAll();

			$orgOutLevelRecs = $this->database->table('organization_outcome')
				->select('organization_id, outcome_id, level')
				->where("organization_id IN ($childIds)")
				->order('organization_id,evaluated DESC')
				->fetchAll();

			$orgLevels = [];
			$outcomes = [];
			$firstPass = TRUE;
			$hasLevels = $orgOutLevelRecs !== FALSE;
			foreach ($organizationRecs as $organizationRec) {
				$orgId = $organizationRec["id"];
				foreach ($outcomeRecs as $outcomeRec) {
					if ($firstPass) {
						$outcomes[] = Outcome::map($this->database, $outcomeRec);
					}
					if (empty($orgLevels[$orgId])) {
						$orgLevels[$orgId] = ['id' => $orgId, 'n' => $organizationRec["name"], 'lv' => []];
					}
					$orgLevels[$orgId]['lv'][] = $hasLevels ? $this->findLevel($orgOutLevelRecs, $orgId, $outcomeRec["id"]) : 0;
				}
				$firstPass = FALSE;
			}
			$levels = [];
			foreach ($orgLevels as $orgId => $orgLevel) { // change from associative to indexed array
				$levels[] = $orgLevel;
			}
			$this->sendResult(['outcomes' => $outcomes, 'orgLevels' => $levels]);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}

	}

}