<?php
namespace App;
require_once "../lib/OutcomeAlignment.php";
require_once "../lib/OrganizationOutcome.php";

class Outcome extends Model {
	private $singleOrganizationId = NULL;

	function initialize() {
		parent::initialize();

		$urlName = $this->urlName();
		$this->api->get("/$urlName/organization/:organizationId", function ($organizationId = NULL) use ($urlName) {
			$jsonRecords = [];
			$this->singleOrganizationId = $organizationId;
			foreach ($this->api->db->{$this->tableName} as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});
	}

	/**
	 * @param array $outcome
	 *
	 * @return array
	 */
	public function map($outcome) {
		$associative = parent::map($outcome);
		$jsonAlignments = [];
		$alignment = new OutcomeAlignment($this->api);
		foreach ($this->api->db->OutcomeAlignment()->where('outcomeId', $outcome["id"]) as $alignmentRecord) {
			$alignment->mapExcludes = ["outcomeId"];
			$jsonAlignments[] = $alignment->map($alignmentRecord);
		}
		$associative["alignments"] = $jsonAlignments;

		$jsonOutcomeLevels = [];
		if (!empty($this->singleOrganizationId)) {
			$dbRecords = $this->api->db->OrganizationOutcome()->where('organizationId=?',$this->singleOrganizationId); //->order('outcomeId');
			foreach ($dbRecords as $dbRecord) {
				$outId = $dbRecord["outcomeId"];
				$jsonOutcomeLevels[$outId] = (int)$dbRecord["level"];
			}
		}
		else {
			$dbRecords = $this->api->db->OrganizationOutcome(); //->order('organizationId,outcomeId');
			foreach ($dbRecords as $dbRecord) {
				$organizationId = $dbRecord["organizationId"];
				$outId = $dbRecord["outcomeId"];
				if (empty($jsonOutcomeLevels[$organizationId])) {
					$jsonOutcomeLevels[$organizationId] = [];
				}
				$jsonOutcomeLevels[$organizationId][$outId] = (int)$dbRecord["level"];
			}
		}
		$associative["levels"] = $jsonOutcomeLevels;

		return $associative;
	}

}
