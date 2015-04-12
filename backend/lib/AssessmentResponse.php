<?php
namespace App;

class AssessmentResponse extends Model {

	public function map($assessmentResponseRecord) {
		$associative = [];
		if (!empty($assessmentResponseRecord)) {
			$associative = [
				'id' => $assessmentResponseRecord["id"],
				'qi' => $assessmentResponseRecord["question_id"],
				'r'  => $assessmentResponseRecord["response"],
				'ri' => $assessmentResponseRecord["response_index"],
				'ec' => $assessmentResponseRecord["assessor_comments"],
				'mc' => $assessmentResponseRecord["member_comments"]
			];
		}
		return $associative;
	}
}