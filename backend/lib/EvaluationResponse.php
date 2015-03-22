<?php
namespace App;

class EvaluationResponse extends Model {

	/**
	 * @param array $organization
	 * @param bool  $full
	 *
	 * @return array
	 */
	public function map($organization, $full = FALSE) {
		$associative = [
			"id"           => $organization["id"],
			"evaluationId" => $organization["evaluation_id"],
			"questionId"   => $organization["question_id"],
			"response"     => $organization["response"]
		];
		if ($full) {
			$associative["evaluator_comments"] = $organization["evaluator_comments"];
			$associative["member_comments"] = $organization["member_comments"];
		}
		return $associative;
	}
}