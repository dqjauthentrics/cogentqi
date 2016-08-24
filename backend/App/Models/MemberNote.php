<?php
namespace App\Models;

/**
 * Class MemberNote
 * @package App\Models
 *
 * @method Member getMember()
 * @method Member getCreator()
 *
 * @property Member $member
 * @property Member $creator
 *
 */
class MemberNote extends AppModel {

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
		$this->belongsTo('member_id', 'App\Models\Member', 'id', ['alias' => 'Member']);
		$this->belongsTo('creator_id', 'App\Models\Member', 'id', ['alias' => 'Creator']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'member_note';
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = []) {
		$map = parent::map($options);
		$map['creator'] = $this->creator->map(['minimal' => TRUE]);
		return $map;
	}

}
