<?php
/**
 * Created by PhpStorm.
 * User: dqj
 * Date: 3/21/15
 * Time: 11:12 PM
 */

namespace App;

class InstrumentSchedule extends Model {

	public function latest($roleId, $operation) {
		$db = $this->api->db;
		$where = "id IN (SELECT instrument_schedule_id FROM instrument_schedule_operation WHERE role_id=? AND operation_id=?)";
		$result = $db->instrument_schedule()->where($where, $roleId, $operation)->order('starts DESC')->limit(1);
		$scheduleItem = $result->fetch();
		return $scheduleItem;
	}
}