<?php
namespace App;
require_once "../lib/QuestionGroup.php";
require_once "../lib/Question.php";
require_once "../lib/QuestionChoice.php";

class Instrument extends Model {
	/**
	 * @param \NotORM $db
	 * @param int $instrumentId
	 * @param int $assessmentId
	 *
	 * @return array
	 */
	public static function createResponseTemplate($db, $instrumentId, $assessmentId) {
		$questions = $db->question()->where('question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)', $instrumentId)
			->order('sort_order');
		$responses = [];
		foreach ($questions as $question) {
			$data = [
				'assessment_id'  => $assessmentId,
				'question_id'    => $question["id"],
				'response'       => NULL,
				'response_index' => NULL,
			];
			$responses[] = $db->assessment_response()->insert($data);
		}
		return $responses;
	}

	/**
	 * @param \NotORM_Result $instrument
	 *
	 * @return array
	 */
	public function map($instrument) {
		$associative = parent::map($instrument);
		try {
			$db = $this->api->db;
			$choices = $db->question_choice()->where('question_type_id=?', $instrument["question_type_id"])->order('sort_order');
			$jsonQuestionChoices = [];
			$questionChoice = new QuestionChoice($this->api);
			foreach ($choices as $choice) {
				$jsonQuestionChoices[] = $questionChoice->map($choice);
			}
			$associative["questionChoices"] = $jsonQuestionChoices;

			$questionGroupRecords = $db->question_group()->where('instrument_id=?', $instrument["id"])->order('sort_order');
			$jsonQuestionGroups = [];
			$questionGroup = new QuestionGroup($this->api);
			foreach ($questionGroupRecords as $questionGroupRecord) {
				$jsonQuestionGroups[] = $questionGroup->map($questionGroupRecord);
			}
			$associative["questionGroups"] = $jsonQuestionGroups;

			$questionRecords = $db->question()
				->where('question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)', $instrument["id"])->order('sort_order');
			$jsonQuestions = [];
			$question = new Question($this->api);
			foreach ($questionRecords as $questionRecord) {
				$jsonQuestions[] = $question->map($questionRecord);
			}
			$associative["questions"] = $jsonQuestions;

			$resAlignRecords = $db->resource_alignment()
				->where('questionId IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrumentId=?))', $instrument["id"]);
			$jsonAligns = [];
			$resAlign = new Question($this->api);
			foreach ($resAlignRecords as $resAlignRecord) {
				$jsonAligns[] = $resAlign->map($resAlignRecord);
			}
			$associative["alignments"] = $jsonAligns;
			$associative["typeName"] = $instrument->question_type["entry_type"];
		}
		catch (\Exception $exception) {
			$this->api->sendError($exception);
		}
		return $associative;
	}
}