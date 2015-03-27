<?php
namespace App;
require_once "../lib/QuestionGroup.php";
require_once "../lib/Question.php";
require_once "../lib/QuestionTypeResponse.php";

class Instrument extends Model {

	/**
	 * @param array $instrument
	 *
	 * @return array
	 */
	public function map($instrument) {
		$associative = parent::map($instrument);
		try {
			$questionTypeResponseRecords = $this->api->db->question_type_response()->where('question_type_id=?', $instrument["question_type_id"])->order('sort_order');
			$jsonQuestionTypeResponses = [];
			$associative["minRange"] = 0;
			$associative["maxRange"] = 0;
			$questionTypeResponse = new QuestionTypeResponse($this->api);
			foreach ($questionTypeResponseRecords as $questionTypeResponseRecord) {
				if ($questionTypeResponseRecord["value"] > $associative["maxRange"]) {
					$associative["maxRange"] = $questionTypeResponseRecord["value"];
				}
				if ($questionTypeResponseRecord["value"] < $associative["minRange"] && $questionTypeResponseRecord["value"] >= 0) {
					$associative["minRange"] = $questionTypeResponseRecord["value"];
				}
				$jsonQuestionTypeResponses[] = $questionTypeResponse->map($questionTypeResponseRecord);
			}
			$associative["questionTypeResponses"] = $jsonQuestionTypeResponses;

			$questionGroupRecords = $this->api->db->question_group()->where('instrument_id=?', $instrument["id"])->order('sort_order');
			$jsonQuestionGroups = [];
			$questionGroup = new QuestionGroup($this->api);
			foreach ($questionGroupRecords as $questionGroupRecord) {
				$jsonQuestionGroups[] = $questionGroup->map($questionGroupRecord);
			}
			$associative["questionGroups"] = $jsonQuestionGroups;

			$questionRecords = $this->api->db->question()->where('question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)', $instrument["id"])->order('sort_order');
			$jsonQuestions = [];
			$question = new Question($this->api);
			foreach ($questionRecords as $questionRecord) {
				$jsonQuestions[] = $question->map($questionRecord);
			}
			$associative["questions"] = $jsonQuestions;

		}
		catch (\Exception $exception) {
			$this->api->sendError($exception);
		}
		return $associative;
	}
}