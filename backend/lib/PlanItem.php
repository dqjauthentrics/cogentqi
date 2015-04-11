<?php
namespace App;

class PlanItem extends Model {

	public function initializeRoutes() {
		parent::initializeRoutes();

		$this->api->get("/" . $this->urlName() . "/member/:memberId", function ($memberId = NULL) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->{$this->tableName}()->where("memberId=?", $memberId)->order('statusStamp DESC');
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
				'm'  => $planRecord["learningModuleId"],
				's'  => $planRecord["status"],
				'dt' => $this->dateTime($planRecord["statusStamp"]),
				'n'  => $planRecord->learningmodule->resource["name"],
				'r'  => $planRecord->learningmodule["resourceId"]
			];
		}
		return $associative;
	}

}
