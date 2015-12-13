<?php
namespace Cogent\Models;
/**
 * Class MemberEvent
 * @package Cogent\Models
 *
 * @method Member getMember()
 * @method Event getEvent()
 *
 * @method Member $member
 * @method Event $event
 *
 */
class MemberEvent extends CogentModel {

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
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('event_id', 'Cogent\Models\Event', 'id', ['alias' => 'Event']);
		$this->belongsTo('member_id', 'Cogent\Models\Member', 'id', ['alias' => 'Member']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'member_event';
	}

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

}