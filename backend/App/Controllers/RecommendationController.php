<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\Recommendation;

class RecommendationController extends ControllerBase {

	/**
	 * @param int|null $id
	 */
	public function getAction($id = NULL) {
		$result = new Result($this);
		try {
			$recommendation = new Recommendation();
			$recommendations = $recommendation->createRecommendationsForAssessment($id);
			$result->setNormal($recommendations);
		}
		catch (\Exception $exception) {
			$result->message = $exception->getMessage();
		}
		$result->sendNormal();
	}
}