<?php
namespace App;

class PlanItem extends Model {

	public function initializeRoutes() {
		parent::initializeRoutes();

		$this->api->get("/" . $this->urlName() . "/member/:memberId", function ($memberId = NULL) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->{$this->tableName}()->where("member_id=?", $memberId)->order('status_stamp DESC');
			foreach ($dbRecords as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});
	}

	public function map($planRecord) {
		$associative = NULL;
		if (!empty($planRecord)) {
			$associative = [
				'm'  => $planRecord["learning_module_id"],
				's'  => $planRecord["status"],
				'dt' => $this->dateTime($planRecord["status_stamp"]),
				'n'  => $planRecord->learning_module->resource["name"],
				'r'  => $planRecord->learning_module["resource_id"]
			];
		}
		return $associative;
	}

}
