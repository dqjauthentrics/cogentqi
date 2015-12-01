<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Assessment;
use Phalcon\Mvc\Model\Resultset;

class AssessmentController extends ControllerBase {

	/**
	 * @param string $parentType
	 * @param int    $id
	 */
	public function indexAction($parentType, $id) {
		$result = new Result();
		$data = [];
		$where = "member_id = :id:";
		$assessments = [];
		if ($parentType == "member") {
			$assessments = Assessment::query()->where($where)->bind(["id" => $id])->orderBy("last_saved")->execute();
		}
		elseif ($parentType == "organization") {
			$assessments = Assessment::query()->join('Cogent\Models\Member', 'organization_id=:id:')->bind(["id" => $id])->execute();
		}
		/** @var Assessment $assessment */
		foreach ($assessments as $assessment) {
			$data[] = $assessment->map();
		}
		$result->sendNormal($data);
	}
}
