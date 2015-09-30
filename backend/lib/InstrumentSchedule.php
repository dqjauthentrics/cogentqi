<?php
/**
 * Created by PhpStorm.
 * User: dqj
 * Date: 3/21/15
 * Time: 11:12 PM
 */
namespace App;
require_once("Instrument.php");
require_once("InstrumentScheduleOperation.php");
use \App\Instrument;
use \App\InstrumentScheduleOperation;

class InstrumentSchedule extends Model {
	const STATUS = ["A" => "Active", "I" => "Inactive"];

	public function map($dbRecord) {
		$db = $this->api->db;
		$instSched = new InstrumentScheduleOperation($this->api);
		$associative = parent::map($dbRecord);
		$key = $dbRecord["status_id"];
		$associative["iName"] = @$dbRecord->instrument["name"];
		$associative["status"] = @self::STATUS[$key];
		$ops = $db->instrument_schedule_operation()->where('instrument_schedule_id=?', $dbRecord["id"]);
		$associative["ops"] = [];
		if (!empty($ops)) {
			foreach ($ops as $op) {
				$role = $op["role_id"];
				if (empty($associative["ops"][$role])) {
					$associative["ops"][$role] = '';
				}
				$associative["ops"][$role] .= $op["operation_id"];
			}
		}
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