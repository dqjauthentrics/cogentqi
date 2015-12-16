<?php
namespace Cogent\Models;

/**
 * Class QuestionType
 * @package Cogent\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple getChoices()
 *
 * @property \Phalcon\Mvc\Model\Resultset\Simple $choices
 */
class QuestionType extends CogentModel {

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
	public $summary;

	/**
	 *
	 * @var string
	 */
	public $min_range;

	/**
	 *
	 * @var string
	 */
	public $max_range;

	/**
	 *
	 * @var string
	 */
	public $entry_type;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return QuestionType[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return QuestionType
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Cogent\Models\QuestionChoice', 'question_type_id', ['alias' => 'Choices']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'question_type';
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = []) {
		$map = parent::map();
		$map['choices'] = [];
		$choices = $this->getChoices();
		if (!empty($choices)) {
			/** @var QuestionChoice $choice */
			foreach ($choices as $choice) {
				$map['choices'][] = $choice->map();
			}
		}
		return $map;
	}
}
