<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext,
	ResourcesModule\BasePresenter;

class InstrumentSchedule extends BaseModel {
	const STATUS_ACTIVE = 'A';
	const STATUS_INACITVE = 'I';

	/**
	 * @param string    $roleId
	 * @param string    $operation
	 * @param DbContext $database
	 *
	 * @return mixed
	 */
	public static function latest($database, $roleId, $operation) {
		$where = "id IN (SELECT instrument_schedule_id FROM instrument_schedule_operation WHERE role_id=? AND operation_id=?)";
		$scheduleItem = $database->table('instrument_schedule')->where($where, $roleId, $operation)->order('starts DESC')->limit(1)->fetch();
		return $scheduleItem;
	}

	/**
	 * @param DbContext $database
	 * @param IRow      $dbRecord
	 * @param int       $mode
	 *
	 * @return array
	 */
	public static function map($database, $dbRecord, $mode = BasePresenter::MODE_LISTING) {
		$map = $database->map($dbRecord);
		$key = $dbRecord["status_id"];
		$map["iName"] = @$dbRecord->ref('instrument')["name"];
		$map["status"] = $key == self::STATUS_ACTIVE ? 'Active' : 'Inactive';
		if ($mode != BasePresenter::MODE_LISTING) {
			$ops = $database->table('instrument_schedule_operation')->where('instrument_schedule_id=?', $dbRecord["id"]);
			$map["ops"] = [];
			if (!empty($ops)) {
				foreach ($ops as $op) {
					$role = $op["role_id"];
					if (empty($map["ops"][$role])) {
						$map["ops"][$role] = '';
					}
					$map["ops"][$role] .= $op["operation_id"];
				}
			}
		}
		return $map;
	}
}
