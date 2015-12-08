<?php
namespace Cogent\Models;

/**
 * Class PlanItem
 * @package Cogent\Models
 *
 * @member @method \Phalcon\Mvc\Model\Resultset\Simple getMembers()
 * @member @method \Phalcon\Mvc\Model\Resultset\Simple getModules()
 * @member  Recommendation getRecommendation()
 * @member  PlanItemStatus getStatus()
 *
 */
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

}
