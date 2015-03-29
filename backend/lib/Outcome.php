<?php
namespace App;
require_once "../lib/OutcomeAlignment.php";
require_once "../lib/OrganizationOutcome.php";

class Outcome extends Model {

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

		$jsonOutcomes = [];
		$orgOutcome = new OrganizationOutcome($this->api);
		$dbRecords = $this->api->db->organization_outcome(); //->order('organization_id,outcome_id');
		foreach ($dbRecords as $dbRecord) {
			$jsonOutcomes[] = ['o' => (int)$dbRecord["organization_id"], 'out' => (int)$dbRecord["outcome_id"], 'l' => (int)$dbRecord["level"]];
		}
		$associative["levels"] = $jsonOutcomes;

		return $associative;
	}

}
