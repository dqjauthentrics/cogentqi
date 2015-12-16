<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Resource;
use Cogent\Models\ResourceAlignment;

class ResourceController extends ControllerBase {

	/**
	 * @param int                                $resourceId
	 * @param int                                $questionId
	 * @param \Cogent\Models\ResourceAlignment[] $alignments
	 *
	 * @return \Cogent\Models\ResourceAlignment
	 */
	private function find($resourceId, $questionId, $alignments) {
		if (!empty($resources)) {
			foreach ($alignments as $alignment) {
				if ($alignment->question_id == $questionId && $alignment->resource_id == $resourceId) {
					return $alignment;
				}
			}
		}
		return NULL;
	}

	/**
	 * Return a list.
	 */
	public function indexAction() {
		$resource = new Resource();
		$data = $resource->get();
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
		$resource = new Resource();
		$resource = $resource->get($id, FALSE);
		$resource = $resource->map();
		$result->sendNormal($resource);
	}

	/**
	 * Create a new record, storing the given form information.
	 */
	public function createAction() {
		$result = new Result($this);
		try {
			$params = json_decode(file_get_contents('php://input'), TRUE);
			$resourceForm = $params["resource"];
			if (!empty($resourceForm) && is_array($resourceForm)) {
				$resource = new \Cogent\Models\Resource();
				$resourceForm = $resource->unmap($resourceForm);
				$resourceForm['creator_id'] = $this->user()->id;
				if (empty($resourceForm['resource_type_id'])) {
					$resourceForm['resource_type_id'] = 'T'; //@todo Hard-coded default type
				}
				if (empty($resourceForm["id"])) {
					$resource = $resource->update($resourceForm);
				}
				else {
					$resource = Resource::findFirst($resourceForm["id"]);
					/** @var \Cogent\Models\Resource $resource */
					if (!empty($resource)) {
						$resource->update($resource);
					}
				}
				$result->setNormal($resource->map());
			}
			else {
				$result->setError(Result::CODE_INVALID_REQUEST);
			}
		}
		catch (\Exception $exception) {
			$result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal();
	}

	/**
	 * Save the given alignments for this resource.
	 */
	public function saveAlignmentsAction() {
		$result = new Result($this);
		try {
			$data = @$this->getInputData();
			if (!empty($data["resourceId"]) && !empty($data["instrumentId"]) && !empty($data["alignments"])) {
				$resourceId = $data["resourceId"];
				$formAlignments = $data["alignments"];
				if (!empty($formAlignments)) {
					$alignments = ResourceAlignment::query()->where('resource_id=:id:', ['id' => $resourceId])->execute();
					/** @var \Cogent\Models\ResourceAlignment[] $alignments
					 */
					foreach ($formAlignments as $questionId => $weight) {
						$alignment = $this->find($resourceId, $questionId, $alignments);
						if (!empty($alignment)) {
							if (empty($weight)) {
								$alignment->delete();
							}
							else {
								$alignment->save(['question_id' => $questionId, 'weight' => $weight]);
							}
						}
						else {
							if (!empty($weight)) {
								$alignment = new ResourceAlignment();
								$alignmenRec = ['resource_id' => $resourceId, 'question_id' => $questionId, 'weight' => $weight];
								$alignment->save($alignmenRec);
							}
						}
					}
				}
				$result->setNormal();
			}
		}
		catch (\Exception $exception) {
			$result->sendError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal();
	}

	/**
	 * Save an existing record from the given form.
	 */
	public function saveAction() {
		$result = new Result($this);
		try {
			$formResource = @$this->getInputData('resource');
			if (!empty($formResource)) {
				$resource = Resource::findFirst($formResource['id']);
				/** @var \Cogent\Models\Resource $resource */
				if (!empty($resource)) {
					$resource->update($formResource);
				}
			}
		}
		catch (\Exception $exception) {
			$result->sendError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal();
	}
}