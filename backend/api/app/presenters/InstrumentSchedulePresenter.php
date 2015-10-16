<?php
namespace App\Presenters;

use ResourcesModule\BasePresenter, Nette\Database\Table\IRow;

class InstrumentSchedulePresenter extends BasePresenter {
	const STATUS_ACTIVE = 'A';
	const STATUS_INACITVE = 'I';

	/**
	 * @param int $id
	 * @param int $mode
	 */
	public function actionRead($id, $mode = self::MODE_LISTING) {
		$jsonRecords = [];
		$result = parent::retrieve($id);
		if (!empty($result)) {
			if (!empty($id)) {
				$jsonRecords = $this->map($result, $mode);
			}
			else {
				foreach ($result as $record) {
					$jsonRecords[] = $this->map($record);
				}
			}
		}
		$this->sendResult($jsonRecords);
	}

	/**
	 * @param IRow $dbRecord
	 * @param int  $mode
	 *
	 * @return array
	 */
	public function map($dbRecord, $mode = self::MODE_LISTING) {
		$db = $this->database;
		$map = $db->map($dbRecord);
		$key = $dbRecord["status_id"];
		$map["iName"] = @$dbRecord->ref('instrument')["name"];
		$map["status"] = $key == self::STATUS_ACTIVE ? 'Active' : 'Inactive';
		if ($mode != self::MODE_LISTING) {
			$ops = $db->table('instrument_schedule_operation')->where('instrument_schedule_id=?', $dbRecord["id"]);
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