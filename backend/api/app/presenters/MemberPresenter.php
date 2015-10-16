<?php
namespace App\Presenters;

use Nette,
	ResourcesModule\BasePresenter,
	App\Model\Member,
	ResourcesModule,
	App\Components\AjaxException;

class MemberPresenter extends BasePresenter {

	/**
	public function actionRead($id) {
		if ($this->user->isAllowed('Organization', 'dependents')) {
			$members = $this->database->table('member')->where("parent_id = ?", $id);
			if (empty($organizations)) {
				throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
			}
			$jsonRecs = [];
			foreach ($organizations->fetchAll() as $organization) {
				$jsonRecs[] = $this->database->map($organization);
			}
			$this->sendResult($jsonRecs);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
	}
	 **/

	/**
	 * @param int $id
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionReadDependents($id) {
		if ($this->user->isAllowed('Member', 'dependents')) {
			$members = $this->database->table('member')->where("id IN (SELECT subordinate_id FROM relationship WHERE superior_id=?)", $id);
			if (empty($members)) {
				throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
			}
			$jsonRecs = [];
			foreach ($members->fetchAll() as $member) {
				$jsonRecs[] = $this->database->map($member);
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
	public function actionReadPlanItems($id, $recursive = 0) {
		if ($this->user->isAllowed('Member', 'planItems')) {
			$planItems = $this->database->table('plan_item')->where("member_id = ?", $id)->fetchAll();
			if (empty($planItems)) {
				throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
			}
			$jsonRecs = [];
			foreach ($planItems as $planItem) {
				$jsonRecs[] = $this->database->map($planItem);
			}
			$this->sendResult($jsonRecs);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
	}

}