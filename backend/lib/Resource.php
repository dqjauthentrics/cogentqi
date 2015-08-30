<?php
namespace App;
require_once "../lib/ResourceAlignment.php";

class Resource extends Model {

	private function find($resourceId, $questionId, $records) {
		if (!empty($records)) {
			foreach ($records as $record) {
				if ($record["question_id"] == $questionId && $record["resource_id"] == $resourceId) {
					return $record;
				}
			}
		}
		return NULL;
	}

	public function initializeRoutes() {
		parent::initializeRoutes();

		$this->api->post("/resource/saveAlignments", function () {
			$post = $this->api->request()->post();
			if (!empty($post["resourceId"]) && !empty($post["instrumentId"]) && !empty($post["alignments"])) {
				$resourceId = $post["resourceId"];
				$instrumentId = $post["instrumentId"];
				$alignments = $post["alignments"];
				if (!empty($alignments)) {
					$records = $this->api->db->resource_alignment()
						->where(
							'resource_id=? AND (question_id IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)))',
							$resourceId, $instrumentId
						);
					foreach ($alignments as $questionId => $weight) {
						$record = $this->find($resourceId, $questionId, $records);
						if (!empty($record)) {
							if (empty($weight)) {
								$record->delete();
							}
							else {
								$record["weight"] = $weight;
								$result = $record->update();
							}
						}
						else {
							if (!empty($weight)) {
								$resourceAlignment = ['resource_id' => $resourceId, 'question_id' => $questionId, 'weight' => $weight];
								$result = $this->api->db->resource_alignment()->insert($resourceAlignment);
							}
						}
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
