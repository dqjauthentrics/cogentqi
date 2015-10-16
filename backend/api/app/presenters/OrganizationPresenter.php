<?php
namespace App\Presenters;

use Nette,
	ResourcesModule\BasePresenter,
	App\Model\Member,
	App\Model\Outcome,
	App\Components\AjaxException;

class OrganizationPresenter extends BasePresenter {

	/**
	 * @param int $id
	 * @param int $recursive
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionReadMembers($id, $recursive = 0) {
		if ($this->user->isAllowed('Member', 'members')) {
			if ($recursive) {
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
				$memberMap = Member::map($this->database, $member);
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
	 * @param int $recursive
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionReadDependents($id, $recursive = 0) {
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
	 * @param int $recursive
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionReadOutcomes($id, $recursive = 0) {
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
				$jsonRec = Outcome::map($this->database, $outcome);
				$jsonRecs[] = $jsonRec;
			}
			$this->sendResult($jsonRecs);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
	}

}
