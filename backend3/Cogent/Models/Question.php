<?php
namespace Cogent\Models;

class Question extends CogentModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $question_group_id;

	/**
	 *
	 * @var integer
	 */
	public $question_type_id;

	/**
	 *
	 * @var integer
	 */
	public $sort_order;

	/**
	 *
	 * @var string
	 */
	public $number;

	/**
	 *
	 * @var string
	 */
	public $name;

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
	 *
	 * @var integer
	 */
	public $importance;

	/**
	 *
	 * @var string
	 */
	public $outcome_threshold;

	/**
	 *
	 * @var string
	 */
	public $event_threshold;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Question[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Question
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'AssessmentResponse', 'question_id', ['alias' => 'AssessmentResponse']);
		$this->hasMany('id', 'OutcomeAlignment', 'question_id', ['alias' => 'OutcomeAlignment']);
		$this->hasMany('id', 'ResourceAlignment', 'question_id', ['alias' => 'ResourceAlignment']);
		$this->belongsTo('question_group_id', 'QuestionGroup', 'id', ['alias' => 'QuestionGroup']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'question';
	}

}
