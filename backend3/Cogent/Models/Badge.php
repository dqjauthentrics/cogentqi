<?php
namespace Cogent\Models;

/**
 * Class Badge
 * @package Cogent\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple|Badge[] getMemberBadges()
 * @method Module getModule()
 *
 * @property \Phalcon\Mvc\Model\Resultset\Simple|Badge[] $memberBadges()
 * @property Module                                      $module
 *
 */
class Badge extends CogentModel {

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
	public $image;

	/**
	 *
	 * @var string
	 */
	public $issuer;

	/**
	 *
	 * @var string
	 */
	public $tags;

	/**
	 *
	 * @var integer
	 */
	public $module_id;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Badge[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Badge
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Cogent\Models\MemberBadge', 'badge_id', ['alias' => 'MemberBadges']);
		$this->belongsTo('module_id', 'Cogent\Models\Module', 'id', ['alias' => 'Module']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'badge';
	}

}
