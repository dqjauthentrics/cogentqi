<?php
namespace App\Presenters;

use Nette,
	ResourcesModule\BasePresenter,
	App\Model\Resource,
	ResourcesModule,
	Nette\Database\Table\IRow,
	App\Components\AjaxException;

class ResourcePresenter extends BasePresenter {
	/**
	 * @param int $id
	 * @param int $mode
	 *
	 * @throws \App\Components\AjaxException
	 */
	public function actionRead($id, $mode = self::MODE_LISTING) {
		if ($this->user->isAllowed('Resource', 'read')) {
			$result = $this->retrieve($id);
			if (!empty($id)) {
				$jsonRec = Resource::map($this->database, $result, $mode);
			}
			else {
				$jsonRec = [];
				foreach ($result as $resource) {
					$jsonRec[] = Resource::map($this->database, $resource, $mode);
				}
			}
			$this->sendResult($jsonRec);
		}
		else {
			throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
		}
	}
}