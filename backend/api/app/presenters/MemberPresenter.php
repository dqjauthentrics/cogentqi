<?php
namespace App\Presenters;

use
	Nette,
	App\Model\Member,
	App\Components\AjaxException;

class MemberPresenter extends BasePresenter {

	/**
	 * @param int $id
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function renderGet($id) {
		/** @var Member $member */
		$member = $this->database->table('member')->get($id);
		if (empty($member)) {
			throw new AjaxException($this, AjaxException::ERROR_NOT_FOUND);
		}
		$jsonRec = $this->database->map($member);
		$this->sendResult($jsonRec);
	}

	/**
	 * @param int $id
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function renderDependents($id) {
		if ($this->user->isAllowed('Member', 'dependents')) {
			/** @var Member $member */
			$members = $this->database->table('member')
				->where("id IN (SELECT subordinate_id FROM relationship WHERE superior_id=?)", $id)
				->fetchAll();
			if (empty($members)) {
				throw new AjaxException($this, AjaxException::ERROR_NOT_FOUND);
			}
			$jsonRecs = [];
			foreach ($members as $member) {
				$jsonRecs[] = $this->database->map($member);
			}
			$this->sendResult($jsonRecs);
		}
		else {
			throw new AjaxException($this, AjaxException::ERROR_NOT_ALLOWED);
		}
	}
}