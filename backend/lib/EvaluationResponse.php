<?php
namespace App;

class EvaluationResponse extends Model {

	public function initialize() {
		//$this->mapExcludes = ["evaluator_comments", "member_comments"];
		parent::initialize();
	}

	public function map($evaluationResponseRecord) {
		$associative = [];
		if (!empty($evaluationResponseRecord)) {
			$associative = [
				'id' => $evaluationResponseRecord["id"],
				'qi' => $evaluationResponseRecord["question_id"],
				'r'  => $evaluationResponseRecord["response"],
				'ri' => $evaluationResponseRecord["response_index"],
				'ec' => $evaluationResponseRecord["evaluator_comments"],
				'mc' => $evaluationResponseRecord["member_comments"]
			];
		}
		return $associative;
	}
}