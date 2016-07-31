<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\CogentModel;
use Cogent\Models\Instrument;
use Cogent\Models\InstrumentSchedule;
use Cogent\Models\Question;
use Cogent\Models\QuestionGroup;

class InstrumentController extends ControllerBase {
	/**
	 * Return a list.
	 */
	public function indexAction() {
		$instrument = new Instrument();
		$data = $instrument->get(NULL, TRUE, 'sort_order');
		$result = new Result($this);
		$result->sendNormal($data);
	}

	/**
	 * Return a single record.
	 *
	 * @param int $id
	 */
	public function getAction($id) {
		$result = new Result($this);
		$instrument = new Instrument();
		$instrument = $instrument->get($id, FALSE);
		if (!empty($instrument)) {
			$instrument = $instrument->map();
		}
		else {
			$result->setError(Result::CODE_NOT_FOUND);
		}
		$result->sendNormal($instrument);
	}

	/**
	 * @todo Replace getAction() call above when moved to I2/A2.
	 */
	public function singleAction($id) {
		$this->getAction($id);
	}

	/**
	 * @param int $groupId
	 */
	public function questionGroupsAction($groupId = NULL) {
		$result = new Result($this);
		if (empty($groupId)) {
			$groups = QuestionGroup::query()->orderBy("instrument_id,sort_order")->execute();
		}
		else {
			$groups = QuestionGroup::query()->where('instrument_id = :id:', ["id" => $groupId])->orderBy("sort_order")->execute();
		}
		$groupsArray = $this->mapRecords($groups);
		$result->setNormal($groupsArray);
		$result->sendNormal();
	}

	/**
	 * Retrieves a full schedule for the givent instrumentId
	 *
	 * @param int $instrumentId
	 */
	public function scheduleAction($instrumentId = NULL) {
		$result = new Result($this);
		$data = [];
		try {
			$sched = new InstrumentSchedule();
			if (empty($instrumentId)) {
				$data = $sched->get();
			}
			else {
				$data = $sched->get(NULL, TRUE, '', 'instrument_id=:id:', ['id' => 'ends DESC,starts DESC']);
			}
		}
		catch (\Exception $exception) {
			$result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal($data);
	}

	/**
	 * @param QuestionGroup[] $questionGroups
	 * @param int             $questionGroupId
	 *
	 * @return QuestionGroup|null
	 */
	private function findGroup($questionGroups, $questionGroupId) {
		$group = NULL;
		if (!empty($questionGroups)) {
			foreach ($questionGroups as $group) {
				if ($group->id == $questionGroupId) {
					return $group;
				}
			}
		}
		return $group;
	}


	/**
	 * Save the given alignments for this resource.
	 */
	public function saveAction() {
		$result = new Result($this);
		$transaction = $this->transactionManager->getOrCreateTransaction();
		try {
			$data = @$this->getInputData();
			if (!empty($data["instrument"])) {
				$formInstrument = $data["instrument"];
				$instrumentId = $formInstrument['id'];
				$instrumentRecord = Instrument::findFirst($instrumentId);
				/** @var \Cogent\Models\Instrument $resource */
				if (!$instrumentRecord->update(['description' => $formInstrument['dsc']])) {
					throw new \Exception($resource->errorMessagesAsString());
				}
				$formGroups = $formInstrument["questionGroups"];
				if (!empty($formGroups)) {
					$groupRecords = QuestionGroup::query()->where('instrument_id=:id:', ['id' => $instrumentId])->execute();
					/** @var QuestionGroup[] $groupRecords */
					foreach ($formGroups as $formGroup) {
						$groupRecord = CogentModel::findRecord($groupRecords, $formGroup['id']);
						if (!empty($groupRecord)) {
							$groupRecord->update([
									'tag'     => $formGroup['tag'],
									'number'  => $formGroup['nmb'],
									'summary' => $formGroup['sm']
								]
							);
							$questionRecords = Question::query()->where('question_group_id=:id:', ['id' => $groupRecord->id])->execute();
							/** @var Question[] $questionRecords */
							if (!empty($formGroup['questions'])) {
								foreach ($formGroup['questions'] as $formQuestion) {
									$questionRecord = CogentModel::findRecord($questionRecords, $formQuestion['id']);
									if (!empty($questionRecord)) {
										$questionRecord->update([
												'name'    => $formQuestion['n'],
												'number'  => $formQuestion['nmb'],
												'summary' => $formQuestion['sm']
											]
										);
									}
								}
							}
						}
					}
				}
				$transaction->commit();
				$result->setNormal();
			}
		}
		catch (\Exception $exception) {
			$transaction->rollback();
			$result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->send();
	}

}