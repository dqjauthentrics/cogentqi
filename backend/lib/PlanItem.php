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
			$module = $planRecord->module;
			//$module = $this->api->db->Module()->where('id=?', $planRecord["moduleId"])->fetch();
			$resourceId = !empty($module) ? $module["resource_id"] : NULL;
			$resource = !empty($module) ? $module->resource : NULL;
			//$resource = !empty($module) ? $this->api->db->Resource()->where('id=?', $resourceId)->fetch() : NULL;
			$resourceName = !empty($resource) ? $resource["name"] : NULL;
			$associative = [
				'm'  => $planRecord["module_id"],
				's'  => $planRecord["status"],
				'dt' => $this->dateTime($planRecord["status_stamp"]),
				'n'  => $resourceName,
				'r'  => $resourceId
			];
		}
		return $associative;
	}

}
