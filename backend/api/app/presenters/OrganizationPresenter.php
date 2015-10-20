<?php
namespace App\Presenters;

use Nette,
	ResourcesModule\BasePresenter,
	App\Model\Member,
	App\Model\Outcome,
	App\Model\Assessment,
	App\Components\AjaxException;

class OrganizationPresenter extends BasePresenter {

	/**
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionReadMembers($id, $mode = self::MODE_LISTING) {
		if ($this->user->isAllowed('Member', 'members')) {
			if ($mode == self::MODE_RECURSIVE) {
				$org = $this->database->table('organization')->where('id=?', $id);
				if (empty($org) || empty($org->treeIds)) {
					throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
				}
				$members = $this->database->table('member')->where("organization_id IN (?)", $org->treeIds)->fetchAll();
			}
			else {
				$members = $this->database->table('member')->where("organization_id = ?", $id)->fetchAll();
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
			$organizations = $this->database->table('organization')->where("parent_id = ?", $id)->fetchAll();
			if (empty($organizations)) {
				throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
			}
			$jsonRecs = [];
			foreach ($organizations as $organization) {
				$jsonRecs[] = $this->database->map($organization);
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
	public function actionReadOutcomes($id, $mode = self::MODE_LISTING) {
		if ($this->user->isAllowed('Organization', 'dependents')) {
			$subSubSelect = "(SELECT id FROM organization WHERE parent_id = ?)";
			$subSelect = "(SELECT outcome_id FROM organization_outcome WHERE organization_id IN $subSubSelect)";
			$where = "id IN $subSelect";
			$outcomes = $this->database->table('outcome')->where($where, $id)->fetchAll();
			if (empty($outcomes)) {
				throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
			}
			$jsonRecs = [];
			foreach ($outcomes as $outcome) {
				$jsonRec = Outcome::map($this->database, $outcome, self::MODE_LISTING, $id);
				$jsonRecs[] = $jsonRec;
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
