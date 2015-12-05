<?php
namespace Cogent\Models;

class MemberNote extends CogentModel {

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
	public $creator_id;

	/**
	 *
	 * @var integer
	 */
	public $is_private;

	/**
	 *
	 * @var string
	 */
	public $content;

	/**
	 *
	 * @var string
	 */
	public $last_modified;

	/**
	 *
	 * @var integer
	 */
	public $flag;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return MemberNote[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return MemberNote
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('member_id', 'Member', 'id', ['alias' => 'Member']);
		$this->belongsTo('creator_id', 'Member', 'id', ['alias' => 'Member']);
		$this->belongsTo('member_id', 'Member', 'id', ['alias' => 'Member']);
		$this->belongsTo('creator_id', 'Member', 'id', ['alias' => 'Member']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'member_note';
	}

}
