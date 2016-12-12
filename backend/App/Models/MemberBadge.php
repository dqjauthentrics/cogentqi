<?php
namespace App\Models;

/**
 * Class MemberBadge
 * @package App\Models
 *
 * @method Member getMember()
 * @method Badge getBadge()
 *
 * @property Member $member
 * @property Badge  $badge
 *
 */
class MemberBadge extends AppModel {
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
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('member_id', 'App\Models\Member', 'id', ['alias' => 'Member', 'foreignKey' => TRUE]);
		$this->belongsTo('badge_id', 'App\Models\Badge', 'id', ['alias' => 'Badge', 'foreignKey' => TRUE]);
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
			$map['name'] = $this->badge->name;
			$map['image'] = $this->badge->image;
			$map['description'] = $this->badge->description;
		}
		return $map;
	}

}
