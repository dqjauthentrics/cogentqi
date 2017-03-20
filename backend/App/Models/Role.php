<?php
namespace App\Models;

class Role extends AppModel {
	const GUEST = 'G';
	const PROFESSIONAL = 'P';
	const MANAGER = 'M';
	const ADMINISTRATOR = 'A';
	const SYSADMIN = 'S';

	public static $ROLES = [self::GUEST, self::PROFESSIONAL, self::MANAGER, self::ADMINISTRATOR, self::SYSADMIN];

	/**
	 *
	 * @var string
	 */
	public $id;

	/**
	 *
	 * @var string
	 */
	public $name;

	/**
	 *
	 * @var string
	 */
	public $app_role_id;

	/**
	 *
	 * @var string
	 */
	public $description;

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'App\Models\Instrument', 'role_id', ['alias' => 'Instruments']);
		$this->hasMany('id', 'App\Models\InstrumentScheduleOperation', 'role_id', ['alias' => 'InstrumentScheduleOperations']);
		$this->hasMany('id', 'App\Models\Member', 'role_id', ['alias' => 'Members']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'role';
	}

}