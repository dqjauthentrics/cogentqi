<?php
namespace App;
require_once "../lib/ResourceAlignment.php";

class Resource extends Model {

	public function initializeRoutes() {
		parent::initializeRoutes();

		$this->api->post("/resource/saveAlignments", function () {
			$post = $this->api->request()->post();
			if (!empty($post["resourceId"]) && !empty($post["instrumentId"])) {
				$records = $this->api->db->resource_alignment()
					->where('resourceId=? AND (questionId IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)))',
						$post["resourceId"], $post["instrumentId"])->delete();

				if (!empty($post["alignments"])) {
					foreach ($post["alignments"] as $alignment) {
						$resourceAlignment = ['resourceId' => $post["resource_id"], 'question_id' => $alignment["id"], 'weight' => $alignment["wt"]];
						echo "save:" . json_encode($resourceAlignment) . "\n";
						$this->api->db->resource_alignment()->insert($resourceAlignment);
					}
				}
			}
		});
	}

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
			$mapped = $alignment->map($alignmentRecord);
			$mapped["weight"] = (double)$mapped["weight"];
			$jsonAlignments[] = $mapped;
		}
		$associative["alignments"] = $jsonAlignments;
		return $associative;
	}

}
