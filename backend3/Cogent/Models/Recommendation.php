<?php
namespace Cogent\Models;

use Cogent\Components\Result;

/**
 * Class Recommendation
 * @package Cogent\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple|PlanItem[] getPlanItems()
 * @method Member getMember()
 * @method Assessment getAssessment()
 */
class Recommendation extends CogentModel {
	const MAX_ORG_LEVEL = 3;
	const MAX_RATING = 4;


	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $member_id;

	/**
	 *
	 * @var string
	 */
	public $created_on;

	/**
	 *
	 * @var integer
	 */
	public $assessment_id;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Recommendation[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Recommendation
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Cogent\Models\PlanItem', 'recommendation_id', ['alias' => 'PlanItems']);
		$this->belongsTo('member_id', 'Cogent\Models\Member', 'id', ['alias' => 'Member']);
		$this->belongsTo('assessment_id', 'Cogent\Models\Assessment', 'id', ['alias' => 'Assessment']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'recommendation';
	}

	/**
	 * @param int $outcomeId
	 * @param     $outcomeEvents
	 *
	 * @return int
	 */
	public static function countMatchingEvents($outcomeId, $outcomeEvents) {
		$nMatches = 0;
		foreach ($outcomeEvents as $outcomeEvent) {
			if ($outcomeEvent['outcome_id'] == $outcomeId) {
				$nMatches++;
			}
		}
		return $nMatches;
	}

	/**
	 * @param int $outcomeId
	 * @param     $organizationOutcomes
	 *
	 * @return int
	 */
	public static function getOrgOutcome($outcomeId, $organizationOutcomes) {
		foreach ($organizationOutcomes as $organizationOutcome) {
			if ($organizationOutcome['outcome_id'] == $outcomeId) {
				return $organizationOutcome["level"];
			}
		}
		return 0;
	}

	/**
	 * @param int $assessmentId
	 *
	 * @return Result
	 */
	public static function recommend($assessmentId) {
		$result = new Result();
		try {
			$assessment = Assessment::findFirst($assessmentId);
			$member = $assessment->member;
			$responses = $assessment->responses;

			$organizationOutcomes = OrganizationOutcome::query()->where('organization_id=?', $member['organization_id'])->execute();
			$outcomeAlignments = OutcomeAlignment::query()
				->where(
					'question_id IN (SELECT id FROM Cogent\Models\Question WHERE question_group_id IN (SELECT id FROM Cogent\Models\QuestionGroup WHERE instrument_id=:id:))',
					['id' => $assessment->instrument_id]
				);
			$outcomeEvents = OutcomeEvent::query()->where('member_id=:id:', ['id' => $assessment->member_id])->execute();

			$outTable = [];
			foreach ($outcomeAlignments as $outcomeAlignment) {
				$outcome = $outcomeAlignment->outcome;
				$questionId = $outcomeAlignment["question_id"];
				$outcomeId = $outcome["id"];
				if (empty($outTable[$questionId])) {
					$outTable[$questionId] = [];
				}
				$outTable[$questionId][$outcomeId] = [
					'name'     => $outcome->name,
					'weight'   => $outcomeAlignment->weight,
					'relWt'    => $outcomeAlignment->rel_wt,
					'nEvents'  => self::countMatchingEvents($outcomeId, $outcomeEvents),
					'orgLevel' => self::getOrgOutcome($outcomeId, $organizationOutcomes)
				];
			}
			/**
			 * @var AssessmentResponse $response
			 */
			$disp = [];
			foreach ($responses as $response) {
				$questionId = $response->question_id;
				$responseUpdater = [
					'outcome_factor'      => 0,
					'outcome_weight'      => 0,
					'event_factor'        => 0,
					'event_weight'        => 0,
					'recommendation_rank' => 0
				];
				if (!empty($outTable[$questionId])) {
					foreach ($outTable[$questionId] as $outcomeId => $weighting) {
						if ($weighting['weight'] > 0 && $weighting["orgLevel"] > 0) {
							$responseUpdater['outcome_factor'] += (self::MAX_ORG_LEVEL - $weighting['orgLevel']);
							$responseUpdater['outcome_weight'] += ($weighting['weight'] / 100);
						}
						$responseUpdater['event_factor'] += $weighting['nEvents'];
						$responseUpdater['event_weight'] += ($weighting['weight'] / 100);
					}
				}
				$disp[] = $responseUpdater;
				$response->update($responseUpdater);
			}
		}
		catch (\Exception $exception) {
			$result->setException($exception);
		}
		return $result;
	}

	/**
	 * @param $planItem
	 */
	public static function planItemCompleted($planItem) {
		$assessmentModel = new Assessment();
		$latestAssessmentIds = $assessmentModel->getLatestAssessmentIds($planItem->member_id);
		$responses = AssessmentResponse::query()
			->where("assessment_id IN ($latestAssessmentIds) AND recommended_resource IN ($planItem->module->resource_id)")
			->execute();
		/** @var AssessmentResponse $response */
		foreach ($responses as $response) {
			$response->update(['recommended_resource' => NULL]);
		}
	}

	/**
	 * @param $memberEvent
	 */
	public static function createRecommendationsForEvent($memberEvent) {
		$assessmentModel = new Assessment();
		$eventAlignments = EventAlignment::findFirst($memberEvent->event_id);
		$questionToResponse = [];
		foreach ($eventAlignments as $alignment) {
			$questionToResponse[$alignment->question_id] = NULL;
		}
		$latestAssessmentIds = $assessmentModel->getLatestAssessmentIds($memberEvent->member_id);
		$responsesToCover = AssessmentResponse::query()->where("assessment_id IN ($latestAssessmentIds) AND question_id IN (" . array_keys($questionToResponse) . ")");
		foreach ($responsesToCover as $response) {
			$questionToResponse[$response->question_id] = $response;
		}
		// Increment event values on responses if not covered
		foreach ($eventAlignments as $alignment) {
			/** @var AssessmentResponse $response */
			$response = $questionToResponse[$alignment->question_id];
			if (empty($response->recommended_resource)) {
				$newValue = $response->event_value + $alignment->increment;
				$response->update(['event_value' => $newValue]);
			}
		}
		// Filter responses to the ones we need recommendations for
		$filteredResponses = [];
		foreach ($questionToResponse as $questionId => $response) {
			if (empty($response->recommended_resource) && $response->event_value >= $response->question->outcome_threshold) {
				$filteredResponses[$questionId] = $response;
			}
		}
		$scoredQuestions = self::createScoredQuestions($filteredResponses);
		$rankedCoverages = self::createRankedResourceList($scoredQuestions, $memberEvent->member);

		$currentResourceRecommendations = [];
		$order = 0;
		$currentRecommendation = PlanItem::query()
			->where('member_id', $memberEvent->member_id)
			->andWhere('plan_item_status_id', PlanItem::STATUS_RECOMMENDED)
			->execute();
		foreach ($currentRecommendation as $recommendation) {
			if ($recommendation->score > $order) {
				$order = $recommendation->score;
			}
			$currentResourceRecommendations[$recommendation->module_id] = 0;
		}
		$newRecommendations = [];
		$date = new \DateTime();
		// If response was covered, then reset outcome_value and mark covered.  Also, add
		// recommendations to plan
		foreach ($rankedCoverages as $coverage) {
			foreach ($coverage['questions'] as $questionId => $dummy) {
				$response = $questionToResponse[$questionId];
				$response->update(['recommended_resource' => $coverage['resourceId']]);
				$response->update(['event_value' => 0]);
			}
			if (!array_key_exists($coverage['moduleId'], $currentResourceRecommendations)) {
				$newRecommendations[] = self::createNewRecommendationArray(
					$coverage['moduleId'],
					$memberEvent->member_id,
					$date,
					self::MAX_RATING,
					++$order,
					1
				);
			}
		}
	}

	/**
	 * @param array $assessmentResponses
	 *
	 * @return array
	 */
	private static function createScoredQuestions($assessmentResponses) {
		$scoredQuestions = [];
		foreach ($assessmentResponses as $response) {
			$scoredQuestions[$response->question_id] = [
				'response'    => $response->response,
				'maxResponse' => $response->question->question_type->max_range,
				'importance'  => $response->question->importance,
			];
		}
		return $scoredQuestions;
	}

	/**
	 * @param int $assessmentId
	 *
	 * @throws \Exception
	 */
	public static function createRecommendationsForAssessment($assessmentId) {
		$assessment = Assessment::findFirst($assessmentId);
		$member = $assessment->getAssessee();
		$scoredQuestions = self::createScoredQuestions($assessment->getResponses());
		// Filter out any competencies that don't require resource coverage
		$filteredQuestions = self::assessmentQuestionsToCover($scoredQuestions);
		$rankedCoverages = self::createRankedResourceList($filteredQuestions, $member);
		self::saveRankedResources($rankedCoverages, $member, $assessmentId);
		self::saveAssessmentCoverages($rankedCoverages, $assessmentId);
	}

	/**
	 * @param array  $filteredQuestions
	 * @param Member $member
	 *
	 * @return array
	 *
	 */
	private static function createRankedResourceList($filteredQuestions, $member) {
		// Record the resources that will be offered in the future as a module.
		// If multiple modules exist for a resource, select he earlies one.
		$futureResources = [];
		foreach (Module::query()->where('starts > NOW()')->execute() as $module) {
			$rId = $module->resource_id;
			$starts = !empty($module->starts) ? $module->starts->getTimeStamp() : NULL;
			if (!array_key_exists($rId, $futureResources)) {
				$futureResources[$rId] = [
					'moduleId' => $module->id,
					'starts'   => $starts,
				];
			}
			if (empty($futureResources[$rId]['starts'])) {
				continue;
			}
			if (empty($starts) || $futureResources[$rId]['starts'] > $starts) {
				$futureResources[$rId]['starts'] = $starts;
				$futureResources[$rId]['moduleId'] = $module->id;
			}
		}
		// We don't want to recommend any resources that are contained
		// in the member's plan except for previously recommended and withdrawn ones.
		$pastResources = [];
		foreach ($member->planItems as $item) {
			if ($item->plan_item_status_id != PlanItem::STATUS_RECOMMENDED &&
				$item->plan_item_status_id != PlanItem::STATUS_WITHDRAWN
			) {
				array_push($pastResources, $item->module->resource->id);
			}
		}
		$rankedCoverages = [];
		$resourceAlignments = ResourceAlignment::query()
			->where('question_id IN', array_keys($filteredQuestions))
			->andWhere('resource_id NOT IN', $pastResources)
			->andWhere('resource_id IN', array_keys($futureResources))
			->execute();

		// Record the alignment strengths that constitute coverage for each question
		$maxCoveringStrengths = [];
		foreach ($filteredQuestions as $key => $value) {
			$maxCoveringStrengths[$key] = 0;
		}
		foreach ($resourceAlignments as $alignment) {
			if ($alignment->weight > $maxCoveringStrengths[$alignment->question_id]) {
				$maxCoveringStrengths[$alignment->question_id] = $alignment->weight;
			}
		}

		// Record how well each resource covers a subset of questions
		$resourceCoverages = [];
		foreach ($resourceAlignments as $alignment) {
			$rId = $alignment->resource_id;
			if (!array_key_exists($rId, $resourceCoverages)) {
				$resourceCoverages[$rId] = [
					'resourceId'         => $rId,
					'moduleId'           => $futureResources[$rId]['moduleId'],
					'totalWeight'        => 0,
					'questions'          => [],
					'totalResponseError' => 0,
					'order'              => 0,
					'rating'             => 0,
				];
			}
			if ($alignment->weight == $maxCoveringStrengths[$alignment['question_id']]) {
				$coverage = &$resourceCoverages[$rId];
				$coverage['totalWeight'] +=
					$filteredQuestions[$alignment->question_id]['importance'];
				$coverage['questions'][$alignment->question_id] = 0;
			}
		}
		self::sortResourceCoverages($resourceCoverages);
		unset($coverage);
		while (TRUE) {
			for ($i = count($resourceCoverages) - 1; $i >= 0; $i--) {
				$coverage = $resourceCoverages[$i];
				unset($resourceCoverages[$i]);
				if ($coverage['totalWeight'] != 0) {
					array_push($rankedCoverages, $coverage);
					self::reduceResourceCoverages($coverage,
						$resourceCoverages, $filteredQuestions);
					break;
				}
			}
			if (count($resourceCoverages) == 0) {
				break;
			}
		}
		self::setOrderAndRatings($rankedCoverages, $filteredQuestions);
		// Sort final resource list in descending order of the total response error
		usort($rankedCoverages, function ($c1, $c2) {
			return $c2['totalResponseError'] - $c1['totalResponseError'];
		});
		return $rankedCoverages;
	}

	/**
	 * Save, for each covered competency, the covering resource.
	 *
	 * @param $rankedCoverages
	 * @param $assessmentId
	 */
	private static function saveAssessmentCoverages($rankedCoverages, $assessmentId) {
		foreach ($rankedCoverages as $rankedCoverage) {
			$responses = AssessmentResponse::query()
				->where('assessment_id=:aid: AND question_id IN (' . array_keys($rankedCoverage['questions']) . ')', ['aid' => $assessmentId])
				->execute();
			/** @var AssessmentResponse $response */
			foreach ($responses as $response) {
				$response->update(['recommended_resource' => $rankedCoverage['resourceId']]);
			}
		}
	}

	/**
	 * @param int    $moduleId
	 * @param int    $memberId
	 * @param string $date
	 * @param double $rating
	 * @param int    $order
	 * @param int    $recommendationId
	 *
	 * @return array
	 */
	private static function createNewRecommendationArray($moduleId, $memberId, $date, $rating, $order, $recommendationId) {
		return [
			'module_id'           => $moduleId,
			'plan_item_status_id' => PlanItem::STATUS_RECOMMENDED,
			'status_stamp'        => $date,
			'member_id'           => $memberId,
			'rank'                => $rating,
			'score'               => $order,
			'recommendation_id'   => $recommendationId,
		];
	}

	/**
	 * Save recommendations to plan item table.
	 *
	 * @param array  $rankedCoverages
	 * @param Member $member
	 * @param int    $assessmentId
	 */
	private static function saveRankedResources($rankedCoverages, $member, $assessmentId) {
		$date = new \DateTime();
		$recommendationFields = [
			'member_id'     => $member->id,
			'assessment_id' => $assessmentId,
			'created_on'    => $date,
		];
		$recommendation = Recommendation::findFirst([
			'conditions' => "member_id=:mid: AND assessment_id=:aid:",
			'bind'       => ['mid' => $member->id, 'aid' => $assessmentId]
		]);
		if (empty($recommendation)) {
			$recommendation = new Recommendation();
		}
		$recommendation->update($recommendationFields);

		// Create objects for plan_item entries
		$newRecommendations = [];
		foreach ($rankedCoverages as $coverage) {
			$newRecommendations[] = self::createNewRecommendationArray(
				$coverage['moduleId'],
				$member->id,
				$date,
				$coverage['rating'],
				$coverage['order'],
				$recommendation->id
			);
		}
		$oldRecommendations = [];
		foreach ($member->planItems as $planItem) {
			if ($planItem->plan_item_status_id = PlanItem::STATUS_RECOMMENDED) {
				$oldRecommendations[] = $planItem;
			}
		}
		$numberToDelete = max(0, count($oldRecommendations) - count($newRecommendations));
		$numberDeleted = 0;
		$updateIndex = 0;

		// foreach old recommendation row we either delete it or update it
		/** @var Recommendation $recommendation */
		foreach ($oldRecommendations as $recommendation) {
			if ($numberDeleted < $numberToDelete) {
				$recommendation->delete();
				$numberDeleted++;
			}
			else {
				$recommendation->update($newRecommendations[$updateIndex]);
				$updateIndex++;
			}
		}
		$inserts = array_slice($newRecommendations, $updateIndex, count($newRecommendations));
		if (count($inserts) > 0) {
			$newItem = new PlanItem();
			$newItem->update(array_slice($newRecommendations, $updateIndex, count($newRecommendations)));
		}
	}

	/**
	 * @param array $rankedCoverages
	 * @param array $scoredQuestions
	 */
	private static function setOrderAndRatings(&$rankedCoverages, $scoredQuestions) {
		$order = 1;
		$maxError = 0;
		foreach ($rankedCoverages as &$coverage) {
			$coverage['order'] = $order++;
			foreach ($coverage['questions'] as $questionId => $dummy) {
				$question = $scoredQuestions[$questionId];
				$coverage['totalResponseError'] +=
					1 - ($question['response'] / $question['maxResponse']);
			}
			if ($coverage['totalResponseError'] > $maxError) {
				$maxError = $coverage['totalResponseError'];
			}
		}
		foreach ($rankedCoverages as &$coverage) {
			$coverage['rating'] = $maxError != 0 ?
				ceil(self::MAX_RATING * ($coverage['totalResponseError'] / $maxError)) : 0;
		}
	}

	/**
	 * @param array $scoredQuestions
	 *
	 * @return array
	 */
	private static function assessmentQuestionsToCover($scoredQuestions) {
		$filteredQuestions = [];
		foreach ($scoredQuestions as $questionId => $scoredQuestion) {
			$score = $scoredQuestion['response'];
			$max = $scoredQuestion['maxResponse'];
			if ($score != 0 && $score != $max) {
				$filteredQuestions[$questionId] = $scoredQuestion;
			}
		}
		return $filteredQuestions;
	}

	/**
	 * @param array $selectedCoverage
	 * @param array $coverages
	 * @param array $scoredQuestions
	 */
	private static function reduceResourceCoverages($selectedCoverage, &$coverages, $scoredQuestions) {
		foreach ($coverages as &$coverage) {
			foreach ($selectedCoverage['questions'] as $question => $dummy) {
				if (array_key_exists($question, $coverage['questions'])) {
					unset($coverage['questions'][$question]);
					$coverage['totalWeight'] -= $scoredQuestions[$question]['importance'];
				}
			}
		}
		unset($coverage);
		self::sortResourceCoverages($coverages);
	}

	/**
	 * @param array $coverages
	 */
	private static function sortResourceCoverages(&$coverages) {
		usort($coverages, function ($r1, $r2) {
			$w1 = $r1['totalWeight'];
			$w2 = $r2['totalWeight'];
			if ($w1 < $w2) {
				return -1;
			}
			if ($w1 > $w2) {
				return 1;
			}
			return 0;
		});
	}
}
