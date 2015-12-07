<?php
namespace Cogent\Models;

/**
 * Class InstrumentSchedule
 * @package Cogent\Models
 * @method Instrument getInstrument()
 * @method Assessment[] getAssessments()
 * @method InstrumentScheduleOperation[] getOperations()
 */
class InstrumentSchedule extends CogentModel {
	const STATUS_ACTIVE = 'A';
	const STATUS_INACITVE = 'I';

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $instrument_id;

	/**
	 *
	 * @var string
	 */
	public $starts;

	/**
	 *
	 * @var string
	 */
	public $ends;

	/**
	 *
	 * @var string
	 */
	public $locked_on;

	/**
	 *
	 * @var integer
	 */
	public $nag_window_start;

	/**
	 *
	 * @var integer
	 */
	public $nag_window_end;

	/**
	 *
	 * @var integer
	 */
	public $is_shared;

	/**
	 *
	 * @var string
	 */
	public $status_id;

	/**
	 *
	 * @var string
	 */
	public $name;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return InstrumentSchedule[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return InstrumentSchedule
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Cogent\Models\Assessment', 'instrument_schedule_id', ['alias' => 'Assessments']);
		$this->hasMany('id', 'Cogent\Models\InstrumentScheduleOperation', 'instrument_schedule_id', ['alias' => 'Operations']);
		$this->belongsTo('instrument_id', 'Cogent\Models\Instrument', 'id', ['alias' => 'Instrument']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'instrument_schedule';
	}

	/**
	 * @param string $roleId
	 * @param string $operation
	 *
	 * @return mixed
	 */
	public static function latest($roleId, $operation) {
		$where = "id IN (SELECT instrument_schedule_id FROM instrument_schedule_operation WHERE role_id=:rid: AND operation_id=:oid:)";
		$scheduleItem = InstrumentSchedule::query()
			->where($where, ['rid' => $roleId, 'oid' => $operation])
			->orderBy('starts DESC')
			->limit(1)
			->execute();
		return $scheduleItem;
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = ['operations' => TRUE]) {
		$map = parent::map();
		$map["iName"] = $this->getInstrument()->name;
		$map["status"] = $this->status_id == self::STATUS_ACTIVE ? 'Active' : 'Inactive';
		if (!empty($options['operations'])) {
			$ops = InstrumentScheduleOperation::query()->where('instrument_schedule_id=:id:', ['id' => $this->id]);
			$map["ops"] = [];
			if (!empty($ops)) {
				foreach ($ops as $op) {
					$role = $op->role_id;
					if (empty($map["ops"][$role])) {
						$map["ops"][$role] = '';
					}
					$map["ops"][$role] .= $op->operation_id;
				}
			}
		}
		return $map;
	}
}
