<?php
namespace App\Presenters;

use Nette,
	Drahak\Restful\IResource,
	ResourcesModule\BasePresenter,
	App\Model\Outcome,
	ResourcesModule,
	Nette\Database\Table\IRow,
	App\Components\AjaxException;

class OutcomePresenter extends BasePresenter {

	/**
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionRead($id, $mode = self::MODE_LISTING) {
		if ($this->user->isAllowed('Outcome', 'read')) {
			if (!empty($id)) {
				/** @var IRow $outcome */
				$outcome = $this->database->table('outcome')->get($id);
				if (empty($outcome)) {
					throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
				}
				$jsonRec = Outcome::map($this->database, $outcome, $mode);
			}
			else {
				$outcomes = $this->database->table('outcome')->fetchAll();
				if (empty($outcomes)) {
					throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
				}
				$jsonRec = [];
				foreach ($outcomes as $outcome) {
					$jsonRec[] = Outcome::map($this->database, $outcome, $mode);
				}
			}
			$this->sendResult($jsonRec);
			//$this->resource = $jsonRec;
			//$this->sendResource(IResource::XML);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
	}

}