<?php
namespace App\Presenters;

use Nette,
	Nette\Database\Table\IRow,
	ResourcesModule\BasePresenter,
	App\Components\AjaxException;

class InstrumentPresenter extends BasePresenter {

	/**
	 * @param IRow $instrument
	 * @param int $mode
	 *
	 * @return array
	 */
	public function map($instrument, $mode = self::MODE_LISTING) {
		$db = $this->database;
		$fullInstrument = $db->map($instrument);
		if ($mode !== self::MODE_LISTING) {
			if (!empty($instrument)) {
				$choices = $db->table('question_choice')->where('question_type_id=?', $instrument["question_type_id"])->order('sort_order');
				$jsonQuestionChoices = [];
				foreach ($choices as $choice) {
					$jsonQuestionChoices[] = $this->database->map($choice);
				}
				$fullInstrument["questionChoices"] = $jsonQuestionChoices;

				$questionGroupRecords = $db->table('question_group')->where('instrument_id=?', $instrument["id"])->order('sort_order');
				$jsonQuestionGroups = [];
				foreach ($questionGroupRecords as $questionGroupRecord) {
					$jsonQuestionGroups[] = $this->database->map($questionGroupRecord);
				}
				$fullInstrument["questionGroups"] = $jsonQuestionGroups;

				$questionRecords = $db->table('question')
					->where('question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)', $instrument["id"])->order('sort_order');
				$jsonQuestions = [];
				foreach ($questionRecords as $questionRecord) {
					$jsonQuestions[] = $this->database->map($questionRecord);
				}
				$fullInstrument["questions"] = $jsonQuestions;

				$resAlignRecords = $db->table('resource_alignment')
					->where('question_id IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?))', $instrument["id"]);
				$jsonAligns = [];
				foreach ($resAlignRecords as $resAlignRecord) {
					$jsonAligns[] = $this->database->map($resAlignRecord);
				}
				$fullInstrument["alignments"] = $jsonAligns;
				$fullInstrument["typeName"] = $instrument->ref('question_type')["entry_type"];
			}
		}
		return $fullInstrument;
	}

	/**
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionRead($id, $mode = self::MODE_LISTING) {
		$result = [];
		try {
			if (!empty($id)) {
				$instrument = $this->database->table('instrument')->get($id);
				$result = $this->map($instrument);
			}
			else {
				$instruments = $this->database->table('instrument')->fetchAll();
				foreach ($instruments as $instrument) {
					$result[] = $this->map($instrument);
				}
			}
		}
		catch (\Exception $exception) {
			throw new AjaxException($exception);
		}
		$this->sendResult($result);
	}
}
