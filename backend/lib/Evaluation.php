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
			foreach ($this->api->db->evaluation()->where("instrument_id=? AND member_id IN (SELECT id FROM member WHERE organization_id=?)", $instrumentId, $orgId) as $dbRecord) {
				$responses = [];
				$memberId = $dbRecord["member_id"];
				$responseRecords = $this->api->db->evaluation_response()->where("evaluation_id=?", $dbRecord["id"]);
				foreach ($responseRecords as $responseRecord) {
					$responses[] = (int)$responseRecord["response_index"];
				}
				$jsonRecords[] = ['memberId' => $memberId, 'responses' => $responses];
			}
			$this->api->sendResult($jsonRecords);
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