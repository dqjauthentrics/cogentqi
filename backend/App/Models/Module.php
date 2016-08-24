<?php
namespace Cogent\Models;

/**
 * Class Module
 * @package Cogent\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple|ModuleBadge[] getModuleBadges()
 * @method \Phalcon\Mvc\Model\Resultset\Simple|PlanItem[] getPlanItems()
 * @method Resource getResource()
 *
 * @property \Phalcon\Mvc\Model\Resultset\Simple|ModuleBadge[] $moduleBadges
 * @property \Phalcon\Mvc\Model\Resultset\Simple|PlanItem[]    $planItems
 * @property Resource                                          $resource
 */
class Module extends CogentModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $resource_id;

	/**
	 *
	 * @var string
	 */
	public $ends;

	/**
	 *
	 * @var string
	 */
	public $sched_type;

	/**
	 *
	 * @var string
	 */
	public $starts;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Module[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Module
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Cogent\Models\PlanItem', 'module_id', ['alias' => 'PlanItems']);
		$this->hasMany('id', 'Cogent\Models\ModuleBadge', 'module_id', ['alias' => 'ModuleBadges']);
		$this->belongsTo('resource_id', 'Cogent\Models\Resource', 'id', ['alias' => 'Resource']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'module';
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = ['minimal' => FALSE]) {
		$map = parent::map();
		$map['badges'] = [];
		if (!empty($this->moduleBadges)) {
			$badgeIdx = 0;
			foreach ($this->moduleBadges as $moduleBadge) {
				$map['badges'][$badgeIdx] = $moduleBadge->badge->map();
				$badgeIdx++;
			}
		}
		if (empty($options['minimal'])) {
			$map['resource'] = $this->resource->map();
		}
		return $map;
	}
}
