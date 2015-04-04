<?php
namespace App;
require_once "../lib/OutcomeAlignment.php";
require_once "../lib/OrganizationOutcome.php";

class Outcome extends Model {
	private $singleOrganizationId = NULL;

	function initialize() {
		parent::initialize();

		$urlName = $this->urlName();
		$this->api->get("/$urlName/organization/:orgId", function ($orgId = NULL) use ($urlName) {
			$jsonRecords = [];
			$this->singleOrganizationId = $orgId;
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
		foreach ($this->api->db->outcome_alignment()->where('outcome_id', $outcome["id"]) as $alignmentRecord) {
			$alignment->mapExcludes = ["outcome_id"];
			$jsonAlignments[] = $alignment->map($alignmentRecord);
		}
		$associative["alignments"] = $jsonAlignments;

		$jsonOutcomeLevels = [];
		if (!empty($this->singleOrganizationId)) {
			$dbRecords = $this->api->db->organization_outcome()->where('organization_id=?',$this->singleOrganizationId); //->order('outcome_id');
			foreach ($dbRecords as $dbRecord) {
				$outId = $dbRecord["outcome_id"];
				$jsonOutcomeLevels[$outId] = (int)$dbRecord["level"];
			}
		}
		else {
			$dbRecords = $this->api->db->organization_outcome(); //->order('organization_id,outcome_id');
			foreach ($dbRecords as $dbRecord) {
				$orgId = $dbRecord["organization_id"];
				$outId = $dbRecord["outcome_id"];
				if (empty($jsonOutcomeLevels[$orgId])) {
					$jsonOutcomeLevels[$orgId] = [];
				}
				$jsonOutcomeLevels[$orgId][$outId] = (int)$dbRecord["level"];
			}
		}
		$associative["levels"] = $jsonOutcomeLevels;

		return $associative;
	}

}
