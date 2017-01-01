<?php
namespace App\Models;

/**
 * Class Assessment
 * @package App\Models
 *
 * @method Outcome getOutcome()
 *
 * @property Outcome $outcome
 */

class OutcomeReport extends AppModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $outcome_id;

	/**
	 *
	 * @var string
	 */
	public $evaluated;

	/**
	 *
	 * @var integer
	 */
	public $evaluator_id;

	/**
	 *
	 * @var string
	 */
	public $evaluator_comments;

	/**
	 *
	 * @var integer
	 */
	public $level;

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('outcome_id', 'App\Models\Outcome', 'id', ['alias' => 'Outcome']);
		$this->belongsTo('evaluator_id', 'App\Models\Member', 'id', ['alias' => 'Member']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'outcome_report';
	}

}
