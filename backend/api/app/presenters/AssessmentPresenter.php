<?php
namespace App\Presenters;

use ResourcesModule\BasePresenter,
	App\Model\Assessment,
	App\Components\AjaxException;

class AssessmentPresenter extends BasePresenter {

	public function actionRead($id) {
		$this->resource = [];
		$result = $this->retrieve($id);
		if (empty($result)) {
			throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
		}
		if (!empty($id)) {
			$this->resource = Assessment::map($this->database, $result);
		}
		else {
			foreach ($result as $record) {
				$this->resource[] = Assessment::map($this->database, $result);
			}
		}
		$this->sendResource();
	}
}