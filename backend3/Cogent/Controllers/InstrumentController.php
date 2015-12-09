<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Instrument;
use Cogent\Models\InstrumentSchedule;

class InstrumentController extends ControllerBase {
	/**
	 * Return a list.
	 */
	public function indexAction() {
		$instrument = new Instrument();
		$data = $instrument->get();
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
	 * Retrieves a full schedule for the givent instrumentId
	 *
	 * @param int $instrumentId
	 */
	public function scheduleAction($instrumentId) {
		$result = new Result($this);
		$data = [];
		try {
			$sched = new InstrumentSchedule();
			$data = $sched->get(NULL, TRUE, '', 'instrument_id=:id:', ['id' => 'ends DESC,starts DESC']);
		}
		catch (\Exception $exception) {
			$result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal($data);
	}

}