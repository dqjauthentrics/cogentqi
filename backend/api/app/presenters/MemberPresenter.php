<?php
namespace App\Presenters;

use Nette,
	ResourcesModule\BasePresenter,
	App\Model\Member,
	ResourcesModule,
	Nette\Database\Table\IRow,
	App\Components\AjaxException;

class MemberPresenter extends BasePresenter {

	/**
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionRead($id, $mode = self::MODE_LISTING) {
		if ($this->user->isAllowed('Member', 'read')) {
			if (!empty($id)) {
				/** @var IRow $member */
				$member = $this->database->table('member')->get($id);
				if (empty($member)) {
					throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
				}
				$jsonRec = Member::map($this->database, $member, $mode);
			}
			else {
				$members = $this->database->table('member')->fetchAll();
				if (empty($members)) {
					throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
				}
				$jsonRec = [];
				foreach ($members as $member) {
					$jsonRec = Member::map($this->database, $member, $mode);
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
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionReadDependents($id, $mode = self::MODE_LISTING) {
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
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionReadPlanItems($id, $mode = self::MODE_LISTING) {
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