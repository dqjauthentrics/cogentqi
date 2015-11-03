<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Presenters;

use Nette,
	Drahak\Restful\IResource,
	ResourcesModule\BasePresenter,
	App\Components\AjaxResult,
	App\Model\Member,
	App\Model\Assessment,
	App\Model\MemberNote,
	App\Model\PlanItem,
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
				$members = $this->database->table('member')->where('active_end IS NULL')->fetchAll();
				if (empty($members)) {
					throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
				}
				$jsonRec = [];
				foreach ($members as $member) {
					$jsonRec[] = Member::map($this->database, $member, $mode);
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
	 * Save a member profile record.
	 */
	public function actionUpdate() {
		$data = @$this->getInput()->getData();
		if (!empty($data["member"])) {
			$memberForm = $data["member"];
			if (!empty($memberForm) && is_array($memberForm)) {
				/** @var \Nette\Database\Table\ActiveRow $member */
				$member = $this->database->table('member')->get($memberForm["id"]);
				if (!empty($member)) {
					$data = $this->database->unmap($memberForm, 'member');
					if ($member->update($data)) {
						$this->sendResult(1);
					}
				}
			}
		}
		$this->sendResult(0);
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
	public function actionReadDereactivate($id, $mode = self::MODE_LISTING) {
		$result = new AjaxResult();
		if ($this->user->isAllowed('Member', 'deactivate')) {
			$member = $this->database->table('member')->where("id=?", $id)->fetch();
			if (!empty($member)) {
				$memberUpdate = ["active_end" => !empty($member["active_end"]) ? NULL : $this->database->dateTme()];
				if ($member->update($memberUpdate)) {
					$result->status = AjaxResult::STATUS_OKAY;
					$result->code = 200;
				}
				$result->data = Member::map($this->database, $member, self::MODE_RELATED);
			}
			$this->sendResult($result);
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
				$jsonRecs[] = PlanItem::map($this->database, $planItem);
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
	public function actionReadNotes($id, $mode = self::MODE_LISTING) {
		if ($this->user->isAllowed('Member', 'notes')) {
			$notes = $this->database->table('member_note')->where("member_id = ?", $id)->order('last_modified DESC')->fetchAll();
			if (empty($notes)) {
				throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
			}
			$jsonRecs = [];
			foreach ($notes as $note) {
				$jsonRecs[] = MemberNote::map($this->database, $note);
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
		if ($this->user->isAllowed('Member', 'assessments')) {
			$assessments = $this->database->table('assessment')->where("member_id = ?", $id)->fetchAll();
			if (empty($assessments)) {
				throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
			}
			$jsonRecs = [];
			foreach ($assessments as $assessment) {
				$jsonRecs[] = Assessment::map($this->database, $assessment, $mode);
			}
			$this->sendResult($jsonRecs);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
	}

}