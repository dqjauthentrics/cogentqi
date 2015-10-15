<?php
namespace App\Presenters;

use Nette,
	App\Model\Member,
	ResourcesModule,
	App\Components\AjaxException;

class MemberPresenter extends ResourcesModule\BasePresenter {

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

}