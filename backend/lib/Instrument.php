<?php
namespace App;
require_once "../lib/QuestionGroup.php";
require_once "../lib/Question.php";

class Instrument extends Model {

	/**
	 * @param array $instrument
	 *
	 * @return array
	 */
	public function map($instrument) {
		$associative = parent::map($instrument);
		return $associative;
		try {
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
			echo "\nERROR\n";
			var_dump($exception);
		}
		return $associative;
	}
}