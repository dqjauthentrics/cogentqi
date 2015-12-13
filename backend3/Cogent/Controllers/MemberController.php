<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Member;
use Phalcon\Mvc\Model\Resultset;

class MemberController extends ControllerBase {

	/**
	 * List all members.
	 *
	 * @param int $organizationId
	 * @param int $drilldown
	 * @param int $includeInactive
	 */
	public function indexAction($organizationId = NULL, $drilldown = 0, $includeInactive = 0) {
		$result = new Result($this);
		$data = [];
		try {
			$where = "(organization_id = :id:";
			if (!empty($organizationId) && !empty($drilldown)) {
				$member = new Member();
				$row = $member->getReadConnection()->query("SELECT retrieveOrgDescendantIds($organizationId) AS orgIds")->fetch();
				$orgIds = $row["orgIds"];
				if (!empty($orgIds)) {
					$where .= ' OR organization_id IN (' . $orgIds . ')';
				}
			}
			$where .= ')';
			if (!$includeInactive) {
				$where .= ' AND active_end IS NULL';
			}
			if (!empty($organizationId)) {
				$members = Member::query()->where($where)->bind(["id" => $organizationId])->orderBy("last_name,first_name")->execute();
			}
			else {
				$members = Member::query()->orderBy("last_name,first_name")->execute();
			}
			/** @var Member $member */
			foreach ($members as $member) {
				$data[] = $member->map();
			}
		}
		catch (\Exception $exception) {
			$result->message = $exception->getMessage();
		}
		$result->sendNormal($data);
	}

	/**
	 * @param null $id
	 */
	public function getAction($id = NULL) {
		$result = new Result($this);
		$data = [];
		$member = Member::findFirst($id);
		$data[] = $member->map();
		$result->sendNormal($data);
	}

	/**
	 * @param null $id
	 */
	public function getProfileAction($id = NULL) {
		$result = new Result($this);
		$member = Member::findFirst($id);
		$data = $member->map(['assessments' => TRUE, 'lastAssessment' => TRUE, 'badges' => TRUE, 'notes' => TRUE]);
		$result->sendNormal($data);
	}

	/**
	 * Save a member profile record.
	 */
	public function updateAction() {
		$result = new Result($this);
		$data = [];
		$connection = $this->getWriteConnection(new Member());
		$connection->begin();
		try {
			$memberForm = @$this->getInputData('member');
			$member = Member::findFirst($memberForm["id"]);
			if (!empty($member)) {
				$data = $member->unmap($memberForm);
				if (!$member->update($data)) {
					throw new \Exception("Unable to save member record.");
				}
				$connection->commit();
				$result->setNormal($memberForm);
			}
		}
		catch (\Exception $exception) {
			$connection->rollback();
			$result->message = $exception->getMessage();
		}
		$result->sendNormal($data);
	}

	/**
	 * @param int $parentMemberId
	 */
	public function getSubordinatesAction($parentMemberId) {
		$result = new Result($this);
		$members = Member::query()
			->leftJoin('Cogent\Models\Relationship', 'Cogent\Models\Member.id=subordinate_id')
			->where('Cogent\Models\Relationship.superior_id = :id:', ['id' => $parentMemberId])
			->execute();
		$data = [];
		/** @var Member $member */
		foreach ($members as $member) {
			$data[] = $member->map();
		}
		$result->sendNormal($data);
	}

	/**
	 * @param int $memberId
	 * @param int $activate
	 */
	public function dereactivateAction($memberId, $activate) {
		$result = new Result($this);
		$member = Member::findFirst(['id' => $memberId]);
		if (!empty($member)) {
			$member->active_end = !empty($activate) ? NULL : $member->dbDateTime();
			if ($member->update()) {
				$result->status = Result::STATUS_OKAY;
				$result->data = $member->map();
			}
		}
		$result->sendNormal();
	}

}