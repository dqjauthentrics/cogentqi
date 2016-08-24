<?php
namespace App\Models;
/**
 * Class Event
 * @package App\Models
 * @method \Phalcon\Mvc\Model\Resultset\Simple|EventAlignment[] getAlignments()
 * @method \Phalcon\Mvc\Model\Resultset\Simple|Member[] getMembers()
 *
 * @property \Phalcon\Mvc\Model\Resultset\Simple|EventAlignment[] $alignments
 * @property \Phalcon\Mvc\Model\Resultset\Simple|Member[] $members
 *
 */
class Event extends AppModel {

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
	public $category;

	/**
	 *
	 * @var integer
	 */
	public $threshold;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Event[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Event
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'App\Models\EventAlignment', 'event_id', ['alias' => 'Alignments']);
		$this->hasMany('id', 'App\Models\MemberEvent', 'event_id', ['alias' => 'Members']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'event';
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = []) {
		$map = parent::map();
		$jsonAlignments = [];
		foreach ($this->alignments as $alignment) {
			$jsonAlignments[] = $alignment->map();
		}
		$map["alignments"] = $jsonAlignments;
		return $map;
	}

}
