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

class OrganizationOutcome extends AppModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $organization_id;

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
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return OrganizationOutcome[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return OrganizationOutcome
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('organization_id', 'App\Models\Organization', 'id', ['alias' => 'Organization']);
		$this->belongsTo('outcome_id', 'App\Models\Outcome', 'id', ['alias' => 'Outcome']);
		$this->belongsTo('evaluator_id', 'App\Models\Member', 'id', ['alias' => 'Member']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'organization_outcome';
	}

    /**
     * @param int $orgId
     * @return \Phalcon\Mvc\Model\ResultsetInterface
     */
    public static function getLatestForOrganization($orgId) {
        $sql = "SELECT a.id as id
            FROM organization_outcome a
              INNER JOIN (
                SELECT MAX(id) as id
                FROM organization_outcome
                WHERE organization_id = $orgId
                GROUP BY outcome_id
              ) b ON a.id = b.id";
		$orgOutcome = new OrganizationOutcome();
        $records = $orgOutcome->getDBIF()->query($sql)->fetchAll();
        $ids = self::getArrayColumn($records, 'id');
        return OrganizationOutcome::query()->inWhere('id', $ids)->execute();
	}
}
