<?php
namespace Cogent\Models;

class Outcome extends CogentModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var string
	 */
	public $number;

	/**
	 *
	 * @var string
	 */
	public $name;

	/**
	 *
	 * @var string
	 */
	public $summary;

	/**
	 *
	 * @var string
	 */
	public $calc_method_id;

	/**
	 *
	 * @var string
	 */
	public $method;

	/**
	 *
	 * @var integer
	 */
	public $sort_order;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Outcome[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Outcome
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Cogent\Models\OrganizationOutcome', 'outcome_id', ['alias' => 'OrganizationOutcomes']);
		$this->hasMany('id', 'Cogent\Models\OutcomeAlignment', 'outcome_id', ['alias' => 'Alignments']);
		$this->hasMany('id', 'Cogent\Models\OutcomeEvent', 'outcome_id', ['alias' => 'Events']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'outcome';
	}

	/**
	 * @var array $options
	 * @return array
	 */
	public function map($options = ['alignments' => TRUE, 'singleOrgId' => NULL]) {
		$map = parent::map();
		if ($options['alignments']) {
			$jsonAlignments = [];
			/**
			 * @var OutcomeAlignment $alignmentRecord
			 */
			foreach ($this->getAlignments() as $alignmentRecord) {
				$jsonAlignments[] = $alignmentRecord->map();
			}
			$map["alignments"] = $jsonAlignments;
		}
		$jsonOutcomeLevels = [];
		if (!empty($options['singleOrgId'])) {
			$dbRecords = OrganizationOutcome::query()->where('organization_id=:id:', ['id' => $options['singleOrgId']])->orderBy('outcomeId')->execute();
			foreach ($this->$dbRecords() as $dbRecord) {
				$outId = (int)$dbRecord->outcome_id;
				$jsonOutcomeLevels[$outId] = (int)$dbRecord->level;
			}
			$map["levels"] = $jsonOutcomeLevels;
		}
		/**
		 * else {
		 * $dbRecords = $database->table('organization_outcome')->fetchAll(); //->order('organizationId,outcomeId');
		 * foreach ($dbRecords as $dbRecord) {
		 * $organizationId = (int)$dbRecord["organization_id"];
		 * $outId = (int)$dbRecord["outcome_id"];
		 * if (empty($jsonOutcomeLevels[$organizationId])) {
		 * $jsonOutcomeLevels[$organizationId] = [];
		 * }
		 * $jsonOutcomeLevels[$organizationId][$outId] = (int)$dbRecord["level"];
		 * }
		 * $map["levels"] = $jsonOutcomeLevels;
		 * }
		 **/
		return $map;
	}
}
