<?php
namespace App\Models;
/**
 * Class MemberEvent
 * @package App\Models
 *
 * @method Member getMember()
 * @method Event getEvent()
 *
 * @property Member $member
 * @property Event $event
 *
 */
class MemberEvent extends AppModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $member_id;

	/**
	 *
	 * @var integer
	 */
	public $event_id;

	/**
	 *
	 * @var string
	 */
	public $comments;

	/**
	 *
	 * @var string
	 */
	public $occurred;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return MemberEvent[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return MemberEvent
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('event_id', 'App\Models\Event', 'id', ['alias' => 'Event']);
		$this->belongsTo('member_id', 'App\Models\Member', 'id', ['alias' => 'Member']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'member_event';
	}

	public function map($options = []) {
		$map = parent::map($options);
		$map['n'] = $this->event->name;
		$map['dsc'] = $this->event->description;
		$map['cat'] = $this->event->category;
		return $map;
	}

}
