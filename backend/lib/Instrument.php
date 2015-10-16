<?php
namespace App;
require_once "../lib/QuestionGroup.php";
require_once "../lib/Question.php";
require_once "../lib/QuestionChoice.php";

class Instrument extends Model {
	/**
	 * @param \App\Components\DbContext $db
	 * @param int                       $instrumentId
	 * @param int                       $assessmentId
	 *
	 * @return array
	 */
	public static function createResponseTemplate($db, $instrumentId, $assessmentId) {
		$questions = $db->table('question')->where('question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)', $instrumentId)
			->order('sort_order');
		$responses = [];
		foreach ($questions as $question) {
			$data = [
				'assessment_id'  => $assessmentId,
				'question_id'    => $question["id"],
				'response'       => NULL,
				'response_index' => NULL,
			];
			$responses[] = $db->table('assessment_response')->insert($data);
		}
		return $responses;
	}

	/**
	 * @param \App\Components\DbContext  $db
	 * @param \Nette\Database\Table\IRow $instrument
	 *
	 * @return array
	 */
	public function mapOLD($db, $instrument) {
		$map = $db->map($instrument);
		$db = $this->api->db;
		$choices = $db->table('question_choice')->where('question_type_id=?', $instrument["question_type_id"])->order('sort_order');
		$jsonQuestionChoices = [];
		foreach ($choices as $choice) {
			$jsonQuestionChoices[] = $db->map($choice);
		}
		$map["questionChoices"] = $jsonQuestionChoices;

		$questionGroupRecords = $db->table('question_group')->where('instrument_id=?', $instrument["id"])->order('sort_order');
		$jsonQuestionGroups = [];
		$questionGroup = new QuestionGroup($this->api);
		foreach ($questionGroupRecords as $questionGroupRecord) {
			$jsonQuestionGroups[] = $questionGroup->map($questionGroupRecord);
		}
		$map["questionGroups"] = $jsonQuestionGroups;

		$questionRecords = $db->table('question')
			->where('question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)', $instrument["id"])->order('sort_order');
		$jsonQuestions = [];
		$question = new Question($this->api);
		foreach ($questionRecords as $questionRecord) {
			$jsonQuestions[] = $question->map($questionRecord);
		}
		$map["questions"] = $jsonQuestions;

		$resAlignRecords = $db->table('resource_alignment')
			->where('questionId IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrumentId=?))', $instrument["id"]);
		$jsonAligns = [];
		$resAlign = new Question($this->api);
		foreach ($resAlignRecords as $resAlignRecord) {
			$jsonAligns[] = $resAlign->map($resAlignRecord);
		}
		$map["alignments"] = $jsonAligns;
		$map["typeName"] = $instrument->question_type["entry_type"];
		return $map;
	}
}