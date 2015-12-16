<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Member;
use Nette\Neon\Exception;
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
			$result->setException($exception);
		}
		$result->sendNormal($data);
	}

	/**
	 * @param null $id
	 */
	public function getAction($id = NULL) {
		$result = new Result($this);
		try {
			$data = [];
			$member = Member::findFirst($id);
			if (!empty($member)) {
				$data = $member->map();
				if (!empty($data)) {
					$result->setNormal($data);
				}
				else {
					$result->setError(Result::CODE_EXCEPTION, 'Unable to map data properly.');
				}
			}
			else {
				$result->setError(Result::CODE_NOT_FOUND);
			}
		}
		catch (\Exception $exception) {
			$result->setException($exception);
		}
		$result->sendNormal();
	}

	/**
	 * @param null $id
	 */
	public function getProfileAction($id = NULL) {
		$result = new Result($this);
		try {
			$member = Member::findFirst($id);
			if (!empty($member)) {
				$data = $member->map(['assessments' => TRUE, 'lastAssessment' => TRUE, 'badges' => TRUE, 'notes' => TRUE, 'events' => TRUE]);
				if (!empty($data)) {
					$result->setNormal($data);
				}
				else {
					$result->setError(Result::CODE_EXCEPTION, 'Unable to map data properly.');
				}
			}
			else {
				$result->setError(Result::CODE_NOT_FOUND);
			}
		}
		catch (\Exception $exception) {
			$result->setException($exception);
		}
		$result->sendNormal();
	}

	/**
	 * Save a member profile record.
	 */
	public function updateAction() {
		$result = new Result($this);
		$memberModel = new Member();
		$this->beginTransaction($memberModel);
		try {
			$memberForm = @$this->getInputData('member');
			$member = Member::findFirst($memberForm["id"]);
			if (!empty($member)) {
				$data = $member->unmap($memberForm);
				if (!$member->update($data)) {
					throw new \Exception($member->errorMessagesAsString());
				}
				$this->commitTransaction();
				$result->setNormal($member->map(['minimal' => TRUE]));
			}
		}
		catch (\Exception $exception) {
			$this->rollbackTransaction();
			$result->setException($exception);
		}
		$result->sendNormal();
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
		try {
			$member = Member::findFirst($memberId);
			if (!empty($member)) {
				$member->active_end = !empty($activate) ? NULL : $member->dbDateTime();
				if ($member->update()) {
					$result->setNormal($member->active_end);
				}
				else {
					throw new \Exception($member->errorMessagesAsString());
				}
			}
			else {
				$result->setError(Result::CODE_NOT_FOUND);
			}
		}
		catch (\Exception $exception) {
			$result->setException($exception);
		}
		$result->sendNormal();
	}

}
