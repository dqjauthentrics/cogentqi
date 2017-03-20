<?php
namespace App\Models;

/**
 * Class QuestionGroup
 * @package App\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple|Question[] getQuestions($parameters = [])
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple|Question[] $questions
 */
class QuestionGroup extends AppModel {

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
	public $name;

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
	public $description;

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'App\Models\Question', 'question_group_id', ['alias' => 'Questions']);
		$this->belongsTo('instrument_id', 'App\Models\Instrument', 'id', ['alias' => 'Instrument']);
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
