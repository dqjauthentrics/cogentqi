<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Presenters;

use
	ResourcesModule\BasePresenter,
	Nette\Database\Table\Selection,
	App\Components\AjaxException;

class OutcomeAlignmentPresenter extends BasePresenter {

	/**
	 * @param int                               $outcomeId
	 * @param int                               $questionId
	 * @param \Nette\Database\Table\Selection[] $dbRecords
	 *
	 * @return \Nette\Database\Table\Selection
	 */
	private function find($outcomeId, $questionId, $dbRecords) {
		if (!empty($dbRecords)) {
			foreach ($dbRecords as $dbRecord) {
				if ($dbRecord["question_id"] == $questionId && $dbRecord["outcome_id"] == $outcomeId) {
					return $dbRecord;
				}
			}
		}
		return NULL;
	}

	/**
	 *
	 */
	public function actionUpdate() {
		$result = 0;
		try {
			$data = @$this->getInput()->getData();
			if (!empty($data["outcomeId"]) && !empty($data["instrumentId"]) && !empty($data["alignments"])) {
				$outcomeId = $data["outcomeId"];
				$instrumentId = $data["instrumentId"];
				$formAlignments = $data["alignments"];
				if (!empty($formAlignments)) {
					$dbRecords = $this->database->table('outcome_alignment')
						->where(
							'outcome_id=? AND (question_id IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)))',
							$outcomeId, $instrumentId)
						->fetchAll();
					foreach ($formAlignments as $questionId => $weight) {
						$dbRecord = $this->find($outcomeId, $questionId, $dbRecords);
						if (!empty($dbRecord)) {
							if (empty($weight)) {
								$dbRecord->delete();
							}
							else {
								$dbResult = $dbRecord->update(['weight' => $weight]);
							}
						}
						else {
							if (!empty($weight)) {
								$alignment = ['outcome_id' => $outcomeId, 'question_id' => $questionId, 'weight' => $weight];
								$dbResult = $this->database->table('outcome_alignment')->insert($alignment);
							}
						}
					}
				}
				$result = 1;
			}
		}
		catch (\Exception $exception) {
			throw new AjaxException(AjaxException::ERROR_FATAL, $exception->getMessage());
		}
		$this->sendResult($result);
	}
}