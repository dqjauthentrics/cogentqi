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
			$module = $planRecord->LearningModule;
			$resourceId = !empty($module) ? $module["resourceId"] : NULL;
			$resource = !empty($module) ? $module->Resource : NULL;
			$resourceName = !empty($resource) ? $resource["name"] : NULL;
			$associative = [
				'm'  => $planRecord["learningModuleId"],
				's'  => $planRecord["status"],
				'dt' => $this->dateTime($planRecord["statusStamp"]),
				'n'  => $resourceName,
				'r'  => $resourceId
			];
		}
		return $associative;
	}

}
