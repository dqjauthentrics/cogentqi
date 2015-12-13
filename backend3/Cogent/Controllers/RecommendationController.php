<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Recommendation;

class RecommendationController extends ControllerBase {

	/**
	 * @param int|null $id
	 */
	public function getAction($id = NULL) {
		$result = new Result($this);
		try {
			$recommendations = Recommendation::createRecommendationsForAssessment($id);
			$result->setNormal($recommendations);
		}
		catch (\Exception $exception) {
			$result->message = $exception->getMessage();
		}
		$result->sendNormal();
	}
}