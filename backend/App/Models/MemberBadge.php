<?php
namespace Cogent\Models;

/**
 * Class MemberBadge
 * @package Cogent\Models
 *
 * @method Member getMember()
 * @method Badge getBadge()
 *
 * @property Member $member
 * @property Badge  $badge
 *
 */
class MemberBadge extends CogentModel {
	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var string
	 */
	public $title;

	/**
	 *
	 * @var integer
	 */
	public $member_id;

	/**
	 *
	 * @var string
	 */
	public $earned;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return MemberBadge[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return MemberBadge
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('member_id', 'Cogent\Models\Member', 'id', ['alias' => 'Member', 'foreignKey' => TRUE]);
		$this->belongsTo('badge_id', 'Cogent\Models\Badge', 'id', ['alias' => 'Badge', 'foreignKey' => TRUE]);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'member_badge';
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = []) {
		$map = parent::map($options);
		if (!empty($this->badge)) {
			$map['image'] = $this->badge->image;
		}
		return $map;
	}

}
