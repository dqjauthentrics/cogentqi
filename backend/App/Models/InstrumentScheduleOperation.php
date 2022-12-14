<?php
namespace App\Models;

/**
 * Class InstrumentScheduleOperation
 * @package App\Models
 *
 * @method InstrumentSchedule getSchedule()
 * @method Operation getOperation()
 * @method Role getRole()
 *
 * @method InstrumentSchedule $schedule
 * @method Operation $operation
 * @method Role $role
 *
 */
class InstrumentScheduleOperation extends AppModel {
	const OP_CREATE = 'C';
	const OP_READ = 'R';
	const OP_UPDATE = 'X';
	const OP_DELETE = 'D';
	const OP_EXEXUTE = 'X';

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $instrument_schedule_id;

	/**
	 *
	 * @var string
	 */
	public $role_id;

	/**
	 *
	 * @var string
	 */
	public $operation_id;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return InstrumentScheduleOperation[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return InstrumentScheduleOperation
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('instrument_schedule_id', '\App\Models\InstrumentSchedule', 'id', ['alias' => 'Schedule']);
		$this->belongsTo('role_id', '\App\Models\Role', 'id', ['alias' => 'Role']);
		$this->belongsTo('operation_id', '\App\Models\Operation', 'id', ['alias' => 'Operation']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'instrument_schedule_operation';
	}

}
