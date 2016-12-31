<?php
namespace App\Models;

/**
 * Class Module
 * @package App\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple|ModuleBadge[] getModuleBadges()
 * @method \Phalcon\Mvc\Model\Resultset\Simple|PlanItem[] getPlanItems()
 * @method Resource getResource()
 *
 * @property \Phalcon\Mvc\Model\Resultset\Simple|ModuleBadge[] $moduleBadges
 * @property \Phalcon\Mvc\Model\Resultset\Simple|PlanItem[]    $planItems
 * @property Resource                                          $resource
 */
class Module extends AppModel {

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
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'App\Models\PlanItem', 'module_id', ['alias' => 'PlanItems']);
		$this->hasMany('id', 'App\Models\ModuleBadge', 'module_id', ['alias' => 'ModuleBadges']);
		$this->belongsTo('resource_id', 'App\Models\Resource', 'id', ['alias' => 'Resource']);
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
	public function map($options = ['minimal' => FALSE, 'resource' => TRUE]) {
		$map = parent::map();
		$map['badges'] = [];
		if (!empty($this->moduleBadges)) {
			$badgeIdx = 0;
			foreach ($this->moduleBadges as $moduleBadge) {
				$map['badges'][$badgeIdx] = $moduleBadge->badge->map();
				$badgeIdx++;
			}
		}
		if (!empty($options['resource'])) {
			$map['resource'] = $this->resource->map();
		}
		return $map;
	}
}
