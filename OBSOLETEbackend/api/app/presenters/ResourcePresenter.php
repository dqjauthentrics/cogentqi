<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Presenters;

use App\Components\AjaxResult;
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

	/**
	 */
	public function actionCreate() {
		$result = new AjaxResult();
		try {
			$params = json_decode(file_get_contents('php://input'), TRUE);
			$resourceForm = $params["resource"];
			if (!empty($resourceForm) && is_array($resourceForm)) {
				$resource = $this->database->unmap($resourceForm, 'resource');
				$resource['creator_id'] = $this->user->id;
				if (empty($resource['resource_type_id'])) {
					$resource['resource_type_id'] = 'T'; //@todo Hard-coded default type
				}
				if (empty($resource["id"])) {
					$resourceRow = $this->database->table('resource')->insert($resource);
				}
				else {
					$resourceRow = $this->database->table('resource')->where('id=?', $resource["id"])->fetch();
					$resourceRow->update($resource);
				}
				$result->data = Resource::map($this->database, $resourceRow);
				$result->status = AjaxResult::STATUS_OKAY;
				$result->code = 200;
			}
			else {
				$result->message = "Invalid data received";
			}
		}
		catch (\Exception $exception) {
			$result->message = $exception->getMessage();
			$result->code = 500;
			//throw new AjaxException($exception->getMessage());
		}
		$this->sendResult($result);
	}
}