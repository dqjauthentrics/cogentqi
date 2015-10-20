<?php
namespace App\Presenters;

use
	ResourcesModule\BasePresenter,
	Nette\Database\Table\Selection,
	App\Components\AjaxException;

class ResourceAlignmentPresenter extends BasePresenter {

	/**
	 * @param int                               $resourceId
	 * @param int                               $questionId
	 * @param \Nette\Database\Table\Selection[] $dbRecords
	 *
	 * @return \Nette\Database\Table\Selection
	 */
	private function find($resourceId, $questionId, $dbRecords) {
		if (!empty($dbRecords)) {
			foreach ($dbRecords as $dbRecord) {
				if ($dbRecord["question_id"] == $questionId && $dbRecord["resource_id"] == $resourceId) {
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
			if (!empty($data["resourceId"]) && !empty($data["instrumentId"]) && !empty($data["alignments"])) {
				$resourceId = $data["resourceId"];
				$instrumentId = $data["instrumentId"];
				$formAlignments = $data["alignments"];
				if (!empty($formAlignments)) {
					$dbRecords = $this->database->table('resource_alignment')
						->where(
							'resource_id=? AND (question_id IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?)))',
							$resourceId, $instrumentId)
						->fetchAll();
					foreach ($formAlignments as $questionId => $weight) {
						$dbRecord = $this->find($resourceId, $questionId, $dbRecords);
						if (!empty($dbRecord)) {
							if (empty($weight)) {
								echo "DELETE: $questionId, $weight\n";
								$dbRecord->delete();
							}
							else {
								echo "UPDATE: $questionId, $weight\n";
								$dbResult = $dbRecord->update(['weight' => $weight]);
							}
						}
						else {
							if (!empty($weight)) {
								echo "INSERT: $questionId, $weight\n";
								$alignment = ['resource_id' => $resourceId, 'question_id' => $questionId, 'weight' => $weight];
								$dbResult = $this->database->table('resource_alignment')->insert($alignment);
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