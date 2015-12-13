<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Presenters;

use App\Model\InstrumentSchedule,
	ResourcesModule\BasePresenter,
	Nette\Database\Table\IRow;

class InstrumentSchedulePresenter extends BasePresenter {

	/**
	 * @param int $id
	 * @param int $mode
	 */
	public function actionRead($id, $mode = self::MODE_LISTING) {
		$jsonRecords = [];
		$result = parent::retrieve($id);
		if (!empty($result)) {
			if (!empty($id)) {
				$jsonRecords = $this->map($result, $mode);
			}
			else {
				foreach ($result as $record) {
					$jsonRecords[] = InstrumentSchedule::map($this->database, $record, $mode);
				}
			}
		}
		$this->sendResult($jsonRecords);
	}
}