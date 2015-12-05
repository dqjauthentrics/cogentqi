<?php
namespace Cogent\Models;

class PlanItem extends CogentModel {

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
		$this->belongsTo('module_id', 'Module', 'id', ['alias' => 'Module']);
		$this->belongsTo('member_id', 'Member', 'id', ['alias' => 'Member']);
		$this->belongsTo('plan_item_status_id', 'PlanItemStatus', 'id', ['alias' => 'PlanItemStatus']);
		$this->belongsTo('recommendation_id', 'Recommendation', 'id', ['alias' => 'Recommendation']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'plan_item';
	}

}
