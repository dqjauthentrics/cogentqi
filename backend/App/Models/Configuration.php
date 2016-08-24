<?php
namespace Cogent\Models;

class Configuration extends CogentModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $assessment_weight;

	/**
	 *
	 * @var integer
	 */
	public $outcome_weight;

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'configuration';
	}

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Configuration[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Configuration
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

}
