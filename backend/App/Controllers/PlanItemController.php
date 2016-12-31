<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\PlanItem;

class PlanItemController extends ControllerBase {

	/**
	 * Return a list.
	 */
	public function indexAction() {
		$planItem = new PlanItem();
		$data = $planItem->get();
		$result = new Result($this);
		$result->sendNormal($data);
	}

	/**
	 * Return a single record.
	 *
	 * @param string $id
	 */
	public function getAction($id) {
		$result = new Result($this);
		$planItem = new PlanItem();
		$planItem = $planItem->get($id, FALSE);
		$planItem = $planItem->map();
		$result->sendNormal($planItem);
	}

	/**
	 * @param int $memberId
	 */
	public function forMemberAction($memberId) {
		$result = new Result($this);
		$data = $this->mapRecords(PlanItem::query()->where('member_id = :id:', ["id" => $memberId])->orderBy("status_stamp")->execute());
		$result->sendNormal($data);
	}

	/**
	 * @param int $organizationId
	 */
	public function yearAction($organizationId, $status = PlanItem::STATUS_COMPLETED) {
		$planItemModel = new PlanItem();
		$result = $planItemModel->getYear($organizationId, $status);
		$result->sendNormal();
	}
}