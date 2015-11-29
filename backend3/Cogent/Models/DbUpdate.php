<?php

class DbUpdate extends Cogent\Models\CogentModel {

	/**
	 *
	 * @var string
	 */
	public $script_name;

	/**
	 *
	 * @var string
	 */
	public $runOn;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return DbUpdate[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return DbUpdate
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->setSource("'_db_update'");
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return '_db_update';
	}

}
