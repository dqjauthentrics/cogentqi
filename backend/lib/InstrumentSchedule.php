<?php
/**
 * Created by PhpStorm.
 * User: dqj
 * Date: 3/21/15
 * Time: 11:12 PM
 */

namespace App;

class InstrumentSchedule extends Model {
	const STATUS = ["A" => "Active", "I" => "Inactive"];

	public function map($dbRecord) {
		$associative = parent::map($dbRecord);
		$key = $dbRecord["status_id"];
		$associative["status"] = @self::STATUS[$key];
		return $associative;
	}

	public function latest($roleId, $operation) {
		$db = $this->api->db;
		$where = "id IN (SELECT instrument_schedule_id FROM instrument_schedule_operation WHERE role_id=? AND operation_id=?)";
		/** @var  $result */
		$result = $db->instrument_schedule()->where($where, $roleId, $operation)->order('starts DESC')->limit(1);
		$scheduleItem = $result->fetch();
		return $scheduleItem;
	}
}