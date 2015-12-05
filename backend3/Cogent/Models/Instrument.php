<?php
namespace Cogent\Models;

class Instrument extends CogentModel {

	/**
	 *
	 * @var integer
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
	public $role_id;

	/**
	 *
	 * @var string
	 */
	public $usage_id;

	/**
	 *
	 * @var string
	 */
	public $description;

	/**
	 *
	 * @var string
	 */
	public $summary;

	/**
	 *
	 * @var integer
	 */
	public $is_uniform;

	/**
	 *
	 * @var integer
	 */
	public $question_type_id;

	/**
	 *
	 * @var integer
	 */
	public $max_range;

	/**
	 *
	 * @var integer
	 */
	public $min_range;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Instrument[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Instrument
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Assessment', 'instrument_id', ['alias' => 'Assessment']);
		$this->hasMany('id', 'InstrumentSchedule', 'instrument_id', ['alias' => 'InstrumentSchedule']);
		$this->hasMany('id', 'InstrumentSchedule', 'instrument_id', ['alias' => 'InstrumentSchedule']);
		$this->hasMany('id', 'QuestionGroup', 'instrument_id', ['alias' => 'QuestionGroup']);
		$this->belongsTo('role_id', 'AppRole', 'id', ['alias' => 'AppRole']);
		$this->belongsTo('usage_id', 'AlgorithmUsage', 'id', ['alias' => 'AlgorithmUsage']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'instrument';
	}

}
