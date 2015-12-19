<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Instrument;
use Cogent\Models\InstrumentSchedule;
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

}