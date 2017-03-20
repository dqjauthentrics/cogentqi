<?php
namespace App\Models;

/**
 * Class QuestionType
 * @package App\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple getChoices()
 *
 * @property \Phalcon\Mvc\Model\Resultset\Simple $choices
 */
class QuestionType extends AppModel {

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
	public $description;

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
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'App\Models\QuestionChoice', 'question_type_id', ['alias' => 'Choices']);
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
