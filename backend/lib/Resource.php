<?php
namespace App;
require_once "../lib/ResourceAlignment.php";

class Resource extends Model {

	/**
	 * @param array $resource
	 *
	 * @return array
	 */
	public function map($resource) {
		$associative = parent::map($resource);
		$associative["rawScore"] = 0;
		$associative["score"] = 0;
		$alignmentRecords = $this->api->db->resource_alignment()->where('resource_id', $resource["id"]);
		$jsonAlignments = [];
		$alignment = new ResourceAlignment($this->api);
		foreach ($alignmentRecords as $alignmentRecord) {
			$alignment->mapExcludes = ["resource_id"];
			$jsonAlignments[] = $alignment->map($alignmentRecord);
		}
		$associative["alignments"] = $jsonAlignments;
		return $associative;
	}

}
