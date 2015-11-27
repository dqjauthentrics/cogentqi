<?php
namespace Api\Models;

class Role extends ApiModel {
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
	public $summary;

	/**
	 *
	 * @var string
	 */
	public $description;

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		//$this->hasMany('id', 'Instrument', 'role_id', ['alias' => 'Instrument']);
		//$this->hasMany('id', 'InstrumentScheduleOperation', 'role_id', ['alias' => 'InstrumentScheduleOperation']);
		$this->hasMany('id', 'Member', 'role_id', ['alias' => 'Member']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'role';
	}

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Role[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Role
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

}
