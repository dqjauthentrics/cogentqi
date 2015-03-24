<?php
namespace App;
require_once "../lib/OutcomeAlignment.php";

class Outcome extends Model {

	/**
	 * @param array $outcome
	 *
	 * @return array
	 */
	public function map($outcome) {
		$associative = parent::map($outcome);
		$alignmentRecords = $this->api->db->outcome_alignment()->where('outcome_id', $outcome["id"]);
		$jsonAlignments = [];
		$alignment = new OutcomeAlignment($this->api);
		foreach ($alignmentRecords as $alignmentRecord) {
			$alignment->mapExcludes = ["outcome_id"];
			$jsonAlignments[] = $alignment->map($alignmentRecord);
		}
		$associative["alignments"] = $jsonAlignments;
		return $associative;
	}

}
