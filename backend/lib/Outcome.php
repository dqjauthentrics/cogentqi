<?php
namespace App;
require_once "../lib/OutcomeAlignment.php";
require_once "../lib/OrganizationOutcome.php";

class Outcome extends Model {
	private $singleOrganizationId = NULL;

	private function find($outcomeId, $questionId, $records) {
		if (!empty($records)) {
			foreach ($records as $record) {
				if ($record["question_id"] == $questionId && $record["outcome_id"] == $outcomeId) {
					return $record;
				}
			}
		}
		return NULL;
	}

	public function initializeRoutes() {
		parent::initializeRoutes();

		$urlName = $this->urlName();
		$this->api->get("/$urlName/organization/:organizationId", function ($organizationId = NULL) use ($urlName) {
			$jsonRecords = [];
			$this->singleOrganizationId = $organizationId;
			foreach ($this->api->db->{$this->tableName} as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});

		$this->api->post("/$urlName/saveAlignments", function () {
			$post = $this->api->request()->post();
			if (!empty($post["outcomeId"]) && !empty($post["instrumentId"]) && !empty($post["alignments"])) {
				$outcomeId = $post["outcomeId"];
				$instrumentId = $post["instrumentId"];
				$alignments = $post["alignments"];
				if (!empty($alignments)) {
					$records = $this->api->db->outcome_alignment()
						->where(
							'outcome_id=? AND (question_id IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)))',
							$outcomeId, $instrumentId
						);
					foreach ($alignments as $questionId => $weight) {
						$record = $this->find($outcomeId, $questionId, $records);
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
								$alignment = ['outcome_id' => $outcomeId, 'question_id' => $questionId, 'weight' => $weight];
								$result = $this->api->db->outcome_alignment()->insert($alignment);
							}
						}
					}
				}
			}
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
			$alignment->mapExcludes = ["outcomeId"];
			$jsonAlignments[] = $alignment->map($alignmentRecord);
		}
		$associative["alignments"] = $jsonAlignments;

		$jsonOutcomeLevels = [];
		if (!empty($this->singleOrganizationId)) {
			$dbRecords = $this->api->db->organization_outcome()->where('organization_id=?',$this->singleOrganizationId); //->order('outcomeId');
			foreach ($dbRecords as $dbRecord) {
				$outId = $dbRecord["outcome_id"];
				$jsonOutcomeLevels[$outId] = (int)$dbRecord["level"];
			}
		}
		else {
			$dbRecords = $this->api->db->organization_outcome(); //->order('organizationId,outcomeId');
			foreach ($dbRecords as $dbRecord) {
				$organizationId = $dbRecord["organization_id"];
				$outId = $dbRecord["outcome_id"];
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
