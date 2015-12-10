<?php
namespace Cogent\Models;

/**
 * Class PlanItem
 * @package Cogent\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple getMembers()
 * @method \Phalcon\Mvc\Model\Resultset\Simple getModules()
 * @method  Recommendation getRecommendation()
 * @method  PlanItemStatus getStatus()
 *
 */
class PlanItem extends CogentModel {
	const STATUS_RECOMMENDED = 'R';
	const STATUS_ENROLLED = 'E';
	const STATUS_WITHDRAWN = 'W';
	const STATUS_COMPLETED = 'C';

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
	 * @var string
	 */
	public $plan_item_status_id;

	/**
	 *
	 * @var string
	 */
	public $status_stamp;

	/**
	 *
	 * @var integer
	 */
	public $member_id;

	/**
	 *
	 * @var integer
	 */
	public $recommendation_id;

	/**
	 *
	 * @var double
	 */
	public $score;

	/**
	 *
	 * @var integer
	 */
	public $rank;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return PlanItem[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return PlanItem
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('module_id', 'Cogent\Models\Module', 'id', ['alias' => 'Modules']);
		$this->belongsTo('member_id', 'Cogent\Models\Member', 'id', ['alias' => 'Members']);
		$this->belongsTo('plan_item_status_id', 'Cogent\Models\PlanItemStatus', 'id', ['alias' => 'Status']);
		$this->belongsTo('recommendation_id', 'Cogent\Models\Recommendation', 'id', ['alias' => 'Recommendations']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'plan_item';
	}


	/**
	 * @param array $options
	 *
	 * @return array|null
	 */
	public function map($options = []) {
		$map = NULL;
		/** @var Module $module */
		$module = $this->module;
		$resourceId = !empty($module) ? $module->resource_id : NULL;
		$resource = !empty($module) ? $module->resource : NULL;
		/** @var \Cogent\Models\Resource $resource */
		$resourceName = !empty($resource) ? $resource->name : NULL;
		$map = [
			'm'  => $this->module_id,
			's'  => $this->plan_item_status_id,
			'dt' => $this->presentationDateTime($this->status_stamp),
			'n'  => $resourceName,
			'r'  => $resourceId
		];
		return $map;
	}

}
