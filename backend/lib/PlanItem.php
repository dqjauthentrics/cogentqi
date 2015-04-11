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
			//$module = $planRecord->Module;
			$module = $this->api->db->Module()->where('id=?', $planRecord["moduleId"])->fetch();
			$resourceId = !empty($module) ? $module["resourceId"] : NULL;
			//$resource = !empty($module) ? $module->Resource : NULL;
			$resource = !empty($module) ? $this->api->db->Resource()->where('id=?', $resourceId)->fetch() : NULL;
			$resourceName = !empty($resource) ? $resource["name"] : NULL;
			$associative = [
				'm'  => $planRecord["moduleId"],
				's'  => $planRecord["status"],
				'dt' => $this->dateTime($planRecord["statusStamp"]),
				'n'  => $resourceName,
				'r'  => $resourceId
			];
		}
		return $associative;
	}

}
