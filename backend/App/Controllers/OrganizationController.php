<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\Member;
use App\Models\Organization;

class OrganizationController extends ControllerBase {
	const DRILL_NONE = 0;
	const DRILL_ALL = -1;
	const DRILL_ONE = 1;

	/**
	 * @param int $id
	 * @param int $drilldown
	 */
	public function listAction($id = NULL, $drilldown = self::DRILL_NONE) {
		$result = new Result($this);
		$data = [];
		try {
			if (!empty($id)) {
				$organization = Organization::findFirst($id);
				if ($drilldown == self::DRILL_ALL) {
					$treeIds = $organization->getDescendantIds($id);
					$children = Organization::query()->where("id IN (:treeIds:)", ['treeIds' => $treeIds])->execute();
				}
				else {
					$children = Organization::query()->where("parent_id=:id:", ['id' => $id])->execute();
				}
				$data = $this->mapRecords($children);
				array_unshift($data, $organization->map());
			}
			else {
				$organizations = Organization::query()->where('1=1')->orderBy('name')->execute();
				$data = $this->mapRecords($organizations);
			}
			$result->setNormal();
		}
		catch (\Exception $exception) {
			$result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal($data);
	}

	/**
	 * @param null $id
	 */
	public function singleAction($id = NULL) {
		$result = new Result($this);
		try {
			$user = $this->currentUser();
			$organization = Organization::findFirst($id);
			if (!empty($organization)) {
				$data = $organization->map();
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
	 * @param int $id
	 * @param int $includeInactive
	 * @param int $drilldown
	 */
	public function membersAction($id, $includeInactive = 0, $drilldown = self::DRILL_NONE) {
		$result = new Result($this);
		$activeStatus = (empty($includeInactive) ? 'active_end IS NULL AND ' : '');
		if ($drilldown == self::DRILL_ALL) {
			$organizationModel = new Organization();
			$treeIds = $organizationModel->getDescendantIds($id);
			$members = Member::query()
				->where("$activeStatus organization_id IN (:treeIds:)", ['treeIds' => $treeIds])
				->execute();
		}
		elseif ($drilldown == self::DRILL_ONE) {
			$organization = Organization::findFirst($id);
			$parentId = $organization->parent_id;
			$members = Member::query()
				->where("$activeStatus organization_id IN (:parent:,:id:)", ['parent' => $parentId, 'id' => $id])
				->execute();
		}
		else {
			$members = Member::query()->where("$activeStatus organization_id=:id:", ['id' => $id])->execute();
		}
		$data = [];
		foreach ($members as $member) {
			/** @var Member $member */
			$memberMap = $member->map();
			$data[] = $memberMap;
		}
		$result->sendNormal($data);
	}

}