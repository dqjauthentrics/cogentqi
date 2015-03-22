<?php
namespace App;
require_once "../lib/QuestionGroup.php";
require_once "../lib/Question.php";

class Instrument extends Model {

	/**
	 * @param array $instrument
	 * @param bool  $full
	 *
	 * @return array
	 */
	public function map($instrument, $full = FALSE) {
		$associative = parent::map($instrument);
		$questionGroupRecords = $this->api->db->question_group()->where('instrument_id=?', $instrument["id"]);
		$jsonQuestionGroups = [];
		$questionGroup = new QuestionGroup($this->api);
		foreach ($questionGroupRecords as $questionGroupRecord) {
			$jsonQuestionGroups[] = $questionGroup->map($questionGroupRecord);
		}
		$associative["questionGroups"] = $jsonQuestionGroups;

		$questionRecords = $this->api->db->question()->where('question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)', $instrument["id"]);
		$jsonQuestions = [];
		$question = new Question($this->api);
		foreach ($questionRecords as $questionRecord) {
			$jsonQuestions[] = $question->map($questionRecord);
		}
		$associative["questions"] = $jsonQuestions;

		return $associative;
	}
}