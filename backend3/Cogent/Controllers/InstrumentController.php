<?php
namespace Cogent\Controllers;

use Cogent\Models\Instrument;
use Cogent\Components\Result;

class InstrumentController extends ControllerBase {
	/**
	 * Return a list.
	 */
	public function indexAction() {
		$instrument = new Instrument();
		$data = $instrument->get();
		$result = new Result();
		$result->sendNormal($data);
	}

	/**
	 * Return a single record.
	 *
	 * @param int $id
	 */
	public function getAction($id) {
		$result = new Result();
		$instrument = new Instrument();
		$instrument = $instrument->get($id, FALSE);
		$instrument = $instrument->map();
		$result->sendNormal($instrument);
	}

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