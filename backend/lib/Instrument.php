<?php
namespace App;
require_once "../lib/QuestionGroup.php";
require_once "../lib/Question.php";
require_once "../lib/QuestionChoice.php";

class Instrument extends Model {

	/**
	 * @param array $instrument
	 *
	 * @return array
	 */
	public function map($instrument) {
		$associative = parent::map($instrument);
		try {
			$questionTypeResponseRecords = $this->api->db->question_choice()->where('question_type_id=?', $instrument["question_type_id"])->order('sort_order');
			$jsonQuestionChoices = [];
			$associative["minRange"] = 0;
			$associative["maxRange"] = 0;
			$questionTypeResponse = new QuestionChoice($this->api);
			foreach ($questionTypeResponseRecords as $questionTypeResponseRecord) {
				if ($questionTypeResponseRecord["value"] > $associative["maxRange"]) {
					$associative["maxRange"] = $questionTypeResponseRecord["value"];
				}
				if ($questionTypeResponseRecord["value"] < $associative["minRange"] && $questionTypeResponseRecord["value"] >= 0) {
					$associative["minRange"] = $questionTypeResponseRecord["value"];
				}
				$jsonQuestionChoices[] = $questionTypeResponse->map($questionTypeResponseRecord);
			}
			$associative["questionTypeResponses"] = $jsonQuestionChoices;

			$questionGroupRecords = $this->api->db->question_group()->where('instrument_id=?', $instrument["id"])->order('sort_order');
			$jsonQuestionGroups = [];
			$questionGroup = new QuestionGroup($this->api);
			foreach ($questionGroupRecords as $questionGroupRecord) {
				$jsonQuestionGroups[] = $questionGroup->map($questionGroupRecord);
			}
			$associative["questionGroups"] = $jsonQuestionGroups;

			$questionRecords = $this->api->db->question()
				->where('question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)', $instrument["id"])->order('sort_order');
			$jsonQuestions = [];
			$question = new Question($this->api);
			foreach ($questionRecords as $questionRecord) {
				$jsonQuestions[] = $question->map($questionRecord);
			}
			$associative["questions"] = $jsonQuestions;

			$resAlignRecords = $this->api->db->resource_alignment()
				->where('questionId IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrumentId=?))', $instrument["id"]);
			$jsonAligns = [];
			$resAlign = new Question($this->api);
			foreach ($resAlignRecords as $resAlignRecord) {
				$jsonAligns[] = $resAlign->map($resAlignRecord);
			}
			$associative["alignments"] = $jsonAligns;
		}
		catch (\Exception $exception) {
			$this->api->sendError($exception);
		}
		return $associative;
	}
}