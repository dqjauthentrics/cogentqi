<?php
namespace App;

class AssessmentResponse extends Model {

	public function initialize() {
		//$this->mapExcludes = ["assessorComments", "memberComments"];
		parent::initialize();
	}

	public function map($assessmentResponseRecord) {
		$associative = [];
		if (!empty($assessmentResponseRecord)) {
			$associative = [
				'id' => $assessmentResponseRecord["id"],
				'qi' => $assessmentResponseRecord["questionId"],
				'r'  => $assessmentResponseRecord["response"],
				'ri' => $assessmentResponseRecord["responseIndex"],
				'ec' => $assessmentResponseRecord["assessorComments"],
				'mc' => $assessmentResponseRecord["memberComments"]
			];
		}
		return $associative;
	}
}