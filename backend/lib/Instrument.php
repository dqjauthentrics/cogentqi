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
			$questionTypeResponseRecords = $this->api->db->QuestionChoice()->where('questionTypeId=?', $instrument["questionTypeId"])->order('sortOrder');
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

			$questionGroupRecords = $this->api->db->QuestionGroup()->where('instrumentId=?', $instrument["id"])->order('sortOrder');
			$jsonQuestionGroups = [];
			$questionGroup = new QuestionGroup($this->api);
			foreach ($questionGroupRecords as $questionGroupRecord) {
				$jsonQuestionGroups[] = $questionGroup->map($questionGroupRecord);
			}
			$associative["questionGroups"] = $jsonQuestionGroups;

			$questionRecords = $this->api->db->Question()
				->where('questionGroupId IN (SELECT id FROM QuestionGroup WHERE instrumentId=?)', $instrument["id"])->order('sortOrder');
			$jsonQuestions = [];
			$question = new Question($this->api);
			foreach ($questionRecords as $questionRecord) {
				$jsonQuestions[] = $question->map($questionRecord);
			}
			$associative["questions"] = $jsonQuestions;

			$resAlignRecords = $this->api->db->ResourceAlignment()
				->where('questionId IN (SELECT id FROM question WHERE questionGroupId IN (SELECT id FROM QuestionGroup WHERE instrumentId=?))', $instrument["id"]);
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