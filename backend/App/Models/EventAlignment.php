<?php
namespace App\Models;

/**
 * Class EventAlignment
 * @package App\Models
 *
 * @method Event getEvent()
 * @method Question getQuestion()
 *
 * @property Event    $event
 * @property Question $question
 */
class EventAlignment extends AppModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $increment;

	/**
	 *
	 * @var integer
	 */
	public $event_id;

	/**
	 *
	 * @var integer
	 */
	public $question_id;

	/**
	 *
	 * @var integer
	 */
	public $weight;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return EventAlignment[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return EventAlignment
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('event_id', 'App\Models\Event', 'id', ['alias' => 'Event']);
		$this->belongsTo('question_id', 'App\Models\Question', 'id', ['alias' => 'Question']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'event_alignment';
	}

}
