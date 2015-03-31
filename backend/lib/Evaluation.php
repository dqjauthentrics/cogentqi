<?php
namespace App;
require_once("EvaluationResponse.php");

class Evaluation extends Model {

	public function initialize() {
		parent::initialize();

		$urlName = $this->urlName();
		$this->api->get("/$urlName/organization/:orgId", function ($orgId = NULL) use ($urlName) {
			$jsonRecords = [];
			foreach ($this->api->db->evaluation()->where("member_id IN (SELECT id FROM member WHERE organization_id=?)", $orgId) as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});
		$this->api->get("/$urlName/matrix/:orgId/:instrumentId", function ($orgId, $instrumentId) use ($urlName) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->evaluation()->where("instrument_id=? AND member_id IN (SELECT id FROM member WHERE organization_id=?)", $instrumentId, $orgId);
			foreach ($dbRecords as $dbRecord) {
				$responses = [];
				$memberId = $dbRecord["member_id"];
				/** @todo These are not sorted by question sort_order!!! */
				$responseRecords = $this->api->db->evaluation_response()->where("evaluation_id=?", $dbRecord["id"]);
				foreach ($responseRecords as $responseRecord) {
					$responses[] = (int)$responseRecord["response_index"];
				}
				$jsonRecords[] = ['memberId' => $memberId, 'responses' => $responses];
			}
			$this->api->sendResult($jsonRecords);
		});
		$this->api->get("/$urlName/matrix/rollup/:orgId/:instrumentId", function ($orgId, $instrumentId) use ($urlName) {
			$jsonRecords = [];

			$sql = "SELECT m.organization_id,o.name,er.question_id, avg(er.response_index) AS response
					FROM evaluation_response er, evaluation e, member m, organization o, question q
					WHERE e.instrument_id=$instrumentId AND e.member_id=m.id AND
						m.organization_id IN (SELECT id FROM organization WHERE parent_id=$orgId) AND er.evaluation_id=e.id AND m.organization_id=o.id AND q.id=er.question_id
					GROUP BY m.organization_id, o.name, er.question_id ORDER BY q.sort_order";
			$dbRecords = $this->api->pdo->query($sql);
			$responseSets = [];
			$orgNames = [];
			foreach ($dbRecords as $dbRecord) {
				$orgId = $dbRecord["organization_id"];
				if (empty($responseSets[$orgId])) {
					$responseSets[$orgId] = [];
					$orgNames[$orgId] = '';
				}
				$responseSets[$orgId][] = (double)number_format($dbRecord["response"],1);
				$orgNames[$orgId] = $dbRecord["name"];
			}
			foreach ($responseSets as $orgId => $responses) {
				$jsonRecords[] = ['organizationId' => $orgId, 'name' => $orgNames[$orgId], 'responses' => $responses];
			}
			echo json_encode($jsonRecords);
		});
	}

	/**
	 * @param array $evaluation
	 *
	 * @return array
	 */
	public function map($evaluation) {
		$associative = parent::map($evaluation);

		$total = 0;
		$nItems = 0;
		$responses = [];
		$records = $this->api->db->evaluation_response()->where("evaluation_id=?", $evaluation["id"]);
		foreach ($records as $record) {
			if ($record["response"] > 0) {
				$nItems++;
				$total += (int)$record["response"];
			}
			$response = new EvaluationResponse($this->api);
			$responses[] = $response->map($record);
		}
		if (!strstr($_SERVER["REQUEST_URI"], "/organization")) {
			if (empty($this->mapExcludes) && !in_array("responses", $this->mapExcludes)) {
				$associative["responses"] = $responses;
			}
		}
		$associative["score"] = ($total > 0 && $nItems > 0 ? number_format($total / $nItems, 1) : 0);
		$associative["scoreRank"] = round($associative["score"]);
		return $associative;
	}
}