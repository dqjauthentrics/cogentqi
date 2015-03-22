<?php
namespace App;
require_once("EvaluationResponse.php");

class Evaluation extends Model {

	function __construct($api) {
		parent::__construct($api, "member_id");
	}

	public function initializeRoutes($api) {
		parent::initializeRoutes($api);
	}

	/**
	 * @param array $evaluation
	 * @param bool  $full
	 *
	 * @return array
	 */
	public function map($evaluation, $full = FALSE) {
		$associative = [
			"id"           => $evaluation["id"],
			"instrumentId" => $evaluation["first_name"],
			"memberId"     => $evaluation["last_name"],
			"byMemberId"   => $evaluation["role_id"],
			"lastSaved"    => $evaluation["job_title"],
			"lastModified" => $evaluation["email"],
		];
		if ($full) {
			$associative["evaluatorComments"] = $evaluation["evaluator_comments"];
			$associative["memberComments"] = $evaluation["member_comments"];

			$responses = [];
			$records = $this->api->db->evaluation_response()->where("evaluation_id=?", $evaluation["id"]);
			foreach ($records as $record) {
				$response = new EvaluationResponse($this->api);
				$responses[] = $response->map($record);
			}
			$associative["responses"] = $responses;
		}
		return $associative;
	}
}