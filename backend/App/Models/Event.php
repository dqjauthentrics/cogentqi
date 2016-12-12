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
		if (empty($options['minimal'])) {
			$jsonAlignments = [];
			foreach ($this->alignments as $alignment) {
				$jsonAlignments[] = $alignment->map();
			}
			$map["alignments"] = $jsonAlignments;
		}
		return $map;
	}

}
