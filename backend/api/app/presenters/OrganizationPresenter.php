<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Presenters;

use Nette,
	ResourcesModule\BasePresenter,
	Nette\Database\Table\IRow,
	App\Model\Member,
	App\Model\Organization,
	App\Model\Assessment,
	App\Components\AjaxException;

class OrganizationPresenter extends BasePresenter {

	/**
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionRead($id, $mode = self::MODE_LISTING) {
		if ($this->user->isAllowed('Member', 'read')) {
			if (!empty($id)) {
				/** @var IRow $organization */
				$organization = $this->database->table('organization')->get($id);
				if (empty($organization)) {
					throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
				}
				$jsonRec = Organization::map($this->database, $organization, $mode);
			}
			else {
				$organizations = $this->database->table('organization')->where('parent_id=?')->fetchAll();
				if (empty($organizations)) {
					throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
				}
				$jsonRec = [];
				foreach ($organizations as $organization) {
					$jsonRec[] = Organization::map($this->database, $organization, $mode);
				}
			}
			$this->sendResult($jsonRec);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
	}

	/**
	 * @param int $id
	 * @param int $mode
	 * @param int $inactive
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionReadMembers($id, $mode = self::MODE_LISTING, $inactive = 0) {
		if ($this->user->isAllowed('Member', 'members')) {
			$activeStatus = (!$inactive ? 'active_end IS NULL AND ' : '');
			if ($mode == self::MODE_RECURSIVE) {
				$org = $this->database->table('organization')->where('id=?', $id);
				if (empty($org) || empty($org->treeIds)) {
					throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
				}
				$members = $this->database->table('member')->where("$activeStatus organization_id IN (?)", $org->treeIds)->fetchAll();
			}
			else {
				$members = $this->database->table('member')->where("$activeStatus organization_id = ?", $id)->fetchAll();
			}
			if (empty($members)) {
				throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
			}
			$jsonRecs = [];
			foreach ($members as $member) {
				$memberMap = Member::map($this->database, $member, $mode);
				$jsonRecs[] = $memberMap;
			}
			$this->sendResult($jsonRecs);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
	}

	/**
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionReadDependents($id, $mode = self::MODE_LISTING) {
		if ($this->user->isAllowed('Organization', 'dependents')) {
			$jsonRecs = [];
			$parentOrg = $this->database->table('organization')->where("id=?", $id)->fetch();
			$organizations = $this->database->table('organization')->where("parent_id=?", $id)->fetchAll();
			if (!empty($organizations)) {
				array_unshift($organizations, $parentOrg);
				foreach ($organizations as $organization) {
					$jsonRecs[] = $this->database->map($organization);
				}
			}
			$this->sendResult($jsonRecs);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
	}

	/**
	 * Returns a simple array of values for outcome levels for the given organization, retrieving only the most recent.
	 *
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionReadOutcomes($id, $mode = self::MODE_LISTING) {
		if ($this->user->isAllowed('Organization', 'outcomes')) {
			$outcomes = $this->database->table('outcome')->select('id')->fetchAll();
			$levels = [];
			foreach ($outcomes as $outcome) {
				$orgOutLevel = $this->database->table('organization_outcome')
					->select("level")
					->where('organization_id=? AND outcome_id=?', $id, $outcome["id"])
					->order('evaluated DESC')->fetch();
				$levels[] = !empty($orgOutLevel) ? (int)$orgOutLevel["level"] : 0;
			}
			$this->sendResult($levels);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
	}

	/**
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionReadAssessments($id, $mode = self::MODE_LISTING) {
		if ($this->user->isAllowed('Organization', 'assessments')) {
			$assessments = $this->database->table('assessment')->where('member_id IN (SELECT id FROM member WHERE organization_id=?)', $id)->fetchAll();
			if (empty($assessments)) {
				throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
			}
			$jsonRecs = [];
			foreach ($assessments as $assessment) {
				$jsonRec = Assessment::map($this->database, $assessment, $mode);
				$jsonRecs[] = $jsonRec;
			}
			$this->sendResult($jsonRecs);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
	}


}
