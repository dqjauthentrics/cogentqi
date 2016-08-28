<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\InstrumentSchedule;

class ScheduleController extends ControllerBase {

	/**
	 * Retrieves a full schedule for the givent instrumentId
	 *
	 * @param int $instrumentId
	 */
	public function listAction($instrumentId = NULL) {
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