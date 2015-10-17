<?php
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext,
	ResourcesModule\BasePresenter;

class Instrument extends BaseModel {

	/**
	 * @param \App\Components\DbContext $database
	 * @param int                       $instrumentId
	 * @param int                       $assessmentId
	 *
	 * @return array
	 */
	public static function createResponseTemplate($database, $instrumentId, $assessmentId) {
		$questions = $database->table('question')->where('question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)', $instrumentId)
			->order('sort_order');
		$responses = [];
		foreach ($questions as $question) {
			$data = [
				'assessment_id'  => $assessmentId,
				'question_id'    => $question["id"],
				'response'       => NULL,
				'response_index' => NULL,
			];
			$responses[] = $database->table('assessment_response')->insert($data);
		}
		return $responses;
	}

}
