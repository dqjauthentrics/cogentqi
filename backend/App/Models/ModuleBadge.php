<?php
namespace Cogent\Models;

/**
 * Class ModuleBadge
 * @package Cogent\Models
 *
 * @method Module getModule()
 * @method Badge  getBadge()
 *
 * @property Module $module
 * @property Badge  $badge
 */
class ModuleBadge extends CogentModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $module_id;

	/**
	 *
	 * @var integer
	 */
	public $badge_id;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return ModuleBadge[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return ModuleBadge
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('module_id', 'Cogent\Models\Module', 'id', ['alias' => 'Module']);
		$this->belongsTo('badge_id', 'Cogent\Models\Badge', 'id', ['alias' => 'Badge']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'module_badge';
	}

}
