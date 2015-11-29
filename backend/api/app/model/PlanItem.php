<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Model;

use App\Components\DbContext,
	App\Model\BaseModel,
	Nette\Database\Table\IRow;

class PlanItem extends BaseModel {

	const STATUS_RECOMMENDED = 'R';
	const STATUS_ENROLLED = 'E';
	const STATUS_WITHDRAWN = 'W';
	const STATUS_COMPLETED = 'C';

	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $planRecord
	 *
	 * @return array|null
	 */
	public static function map($database, $planRecord) {
		$map = NULL;
		if (!empty($planRecord)) {
			/** @var \Nette\Database\Table\IRow $module */
			$module = $planRecord->ref('module');
			$resourceId = !empty($module) ? $module["resource_id"] : NULL;
			$resource = !empty($module) ? $module->ref('resource') : NULL;
			$resourceName = !empty($resource) ? $resource["name"] : NULL;
			$map = [
				'm'  => $planRecord["module_id"],
				's'  => $planRecord["plan_item_status_id"],
				'dt' => $database->presentationDateTime($planRecord["status_stamp"]),
				'n'  => $resourceName,
				'r'  => $resourceId
			];
		}
		return $map;
	}
}