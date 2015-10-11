<?php
namespace App\Presenters;

use Nette,
	App\Model\Member,
	ResourcesModule,
	App\Components\AjaxException;

class MemberPresenter extends ResourcesModule\BasePresenter {

	/**
	 * @param int $id
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function renderGet($id) {
		$member = $this->database->table('member')->get($id);
		if (empty($member)) {
			throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
		}
		$jsonRec = $this->database->map($member);
		$this->sendResult($jsonRec);
	}

	/**
	 * @param string $type
	 * @param int    $id
	 * @param int    $recursive
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function renderDependents($type, $id, $recursive = 0) {
		if ($this->user->isAllowed('Member', 'dependents')) {
			if ($type == 'organization') {
				if ($recursive) {
					$org = $this->database->table('organization')->where('id=?', $id);
					if (empty($org) || empty($org->treeIds)) {
						throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
					}
					$members = $this->database->table('member')->where("organization_id IN (?)", $org->treeIds);
				}
				else {
					// @todo Recursive member search for dependent member.
					$members = $this->database->table('member')->where("organization_id = ?", $id);
				}
			}
			else {
				$members = $this->database->table('member')->where("id IN (SELECT subordinate_id FROM relationship WHERE superior_id=?)", $id);
			}
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