<?php
namespace App;
require_once "../lib/ResourceAlignment.php";

class Resource extends Model {

	public function initializeRoutes() {
		parent::initializeRoutes();

		$this->api->post("/resource/saveAlignments", function () {
			$post = $this->api->request()->post();
			if (!empty($post["resourceId"]) && !empty($post["instrumentId"])) {
				$records = $this->api->db->ResourceAlignment()
					->where('resourceId=? AND (questionId IN (SELECT id FROM Question WHERE questionGroupId IN (SELECT id FROM QuestionGroup WHERE instrumentId=?)))',
						$post["resourceId"], $post["instrumentId"])->delete();

				if (!empty($post["alignments"])) {
					foreach ($post["alignments"] as $alignment) {
						$resourceAlignment = ['resourceId' => $post["resourceId"], 'questionId' => $alignment["id"], 'weight' => $alignment["wt"]];
						echo "save:" . json_encode($resourceAlignment) . "\n";
						$this->api->db->ResourceAlignment()->insert($resourceAlignment);
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
		$alignmentRecords = $this->api->db->ResourceAlignment()->where('resourceId', $resource["id"]);
		$jsonAlignments = [];
		$alignment = new ResourceAlignment($this->api);
		foreach ($alignmentRecords as $alignmentRecord) {
			$alignment->mapExcludes = ["resourceId"];
			$jsonAlignments[] = $alignment->map($alignmentRecord);
		}
		$associative["alignments"] = $jsonAlignments;
		return $associative;
	}

}
