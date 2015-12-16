<?php
namespace Cogent\Models;

/**
 * Class QuestionGroup
 * @package Cogent\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple|Question[] getQuestions($parameters = [])
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple|Question[] $questions
 */
class QuestionGroup extends CogentModel {

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
	public $tag;

	/**
	 *
	 * @var string
	 */
	public $number;

	/**
	 *
	 * @var integer
	 */
	public $sort_order;

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
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return QuestionGroup[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return QuestionGroup
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Cogent\Models\Question', 'question_group_id', ['alias' => 'Questions']);
		$this->belongsTo('instrument_id', 'Cogent\Models\Instrument', 'id', ['alias' => 'Instrument']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'question_group';
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = []) {
		$map = parent::map();
		$map['questions'] = [];
		foreach ($this->questions as $question) {
			$map['questions'][] = $question->map();
		}
		return $map;
	}
}
