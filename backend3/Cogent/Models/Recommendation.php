<?php
namespace Cogent\Models;

use Cogent\Components\Result;
use Cogent\Models\Outcome;

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
	public function countMatchingEvents($outcomeId, $outcomeEvents) {
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
	public function getOrgOutcome($outcomeId, $organizationOutcomes) {
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
	public function recommend($assessmentId) {
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
	public function planItemCompleted($planItem) {
		$assessmentModel = new Assessment();
		$latestAssessmentIds = $assessmentModel->getLatestAssessmentIds($planItem->member_id);
		$responses = AssessmentResponse::query()
				->where("assessment_id IN ($latestAssessmentIds) AND recommended_resource_id IN ($planItem->module->resource_id)")
				->execute();
		/** @var AssessmentResponse $response */
		foreach ($responses as $response) {
			$response->update(['recommended_resource' => NULL]);
		}
	}

	/**
	 * @param $memberEvent
	 */
	public function createRecommendationsForEvent($memberEvent) {
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
			if (empty($response->recommended_resource_id)) {
				$newValue = $response->event_value + $alignment->increment;
				$response->update(['event_value' => $newValue]);
			}
		}
		// Filter responses to the ones we need recommendations for
		$filteredResponses = [];
		foreach ($questionToResponse as $questionId => $response) {
			if (empty($response->recommended_resource_id) && $response->event_value >= $response->question->outcome_threshold) {
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
				$response->update(['recommended_resource_id' => $coverage['resourceId']]);
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
	 * @param float $level   0 <= $level <= 1
	 * @param int $responseMax
	 * @return int  An integer x, 1 <= x <= $responseMax
	 */
	private static function outcomeLevelToResponse($level, $responseMax) {
		return (($responseMax - 1)*$level) + 1;
	}

	private static function getOutcomeScores($organizationId) {
		$orgOutcomes = OrganizationOutcome::getLatestForOrganization(
				$organizationId);
		/** @var OrganizationOutcome $orgOutcome */
		$questionStats = [];
		foreach ($orgOutcomes as $orgOutcome) {
			/** @var OutcomeAlignment $alignment */
			foreach($orgOutcome->outcome->alignments as $alignment) {
				$questionId = $alignment->question_id;
				if (!array_key_exists($questionId, $questionStats)) {
					$questionStats[$questionId] = [];
				}
				$response = self::outcomeLevelToResponse(
                    $orgOutcome->level, intval($alignment->question->type->max_range));
				$questionStats[$questionId][] = [
						'response' => $response,
						'alignment' => $alignment->weight
				];
			}
		}
		$outcomeScores = [];
		foreach ($questionStats as $questionId => $stats) {
			$weightedSum = 0;
			$total= 0;
			foreach ($stats as $stat) {
				$weightedSum += $stat['alignment']*$stat['response'];
				$total += $stat['alignment'];
			}
			$outcomeScores[$questionId] = $weightedSum/$total;
		}
		return $outcomeScores;
	}

	/**
	 * @param Member $member
	 *
	 * @return array
	 */
	private static function createScoredQuestions($member) {
		$outcomes = self::getOutcomeScores($member->organization_id);
		$scoredQuestions = [];
		// @todo need real weights...
		$assessmentWeight = 1;
		$outcomeWeight = 1;
		/** @var AssessmentResponse $response */
		foreach (Assessment::getLatestResponses($member->id) as $response) {
			if ($response->question->type->entry_type !== 'LIKERT') {
				continue;
			}
			$qId = $response->question_id;
			$responseVal = empty($response->response) ? 0 : $response->response;
			$outcome = !array_key_exists($qId, $outcomes) ? 0 : $outcomes[$qId];
			if ($responseVal == 0 && $outcome == 0) {
				continue;
			}
            $ow = $outcome == 0 ? 0 : $outcomeWeight;
            $aw = $responseVal == 0 ? 0 : $assessmentWeight;
			$scoredQuestions[$qId] = [
					'score' => round((($aw*$responseVal) + ($ow*$outcome)) /($aw + $ow)),
					'maxScore' => $response->question->type->max_range
			];
		}
		return $scoredQuestions;
	}

	/**
	 * @param int $assessmentId
	 *
	 * @return array
	 */
	public static function createRecommendationsForMember($member) {
		// Obtain the aggregate (assessment and outcome) scores
		$scoredQuestions = self::createScoredQuestions($member);
		$rankedResources = self::createRankedResourceList($scoredQuestions, $member);
        //  @todo need to identify would is initiating the recommendation generation
        //  passing 1 for now
        self::saveRankedResources($rankedResources, $member, 1);
		return $rankedResources;
	}

	/**
	 * @param array  $scoredQuestions
	 * @param Member $member
	 *
	 * @return array
	 *
	 */
	private static function createRankedResourceList($scoredQuestions, $member) {
		// Record the resources that will be offered in the future as a module.
		// If multiple modules exist for a resource, select the earliest one.
		//
		$futureResources = [];
		$rankedCoverages = [];
		foreach (Module::query()->where('starts > NOW()')->execute() as $module) {
			$rId = $module->resource_id;
			$starts = !empty($module->starts) ? strtotime($module->starts) : NULL;
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

		if (!empty($scoredQuestions) && !empty($futureResources)) {
			// We don't want to recommend any resources that are contained in the member's plan except for previously recommended and
			// withdrawn ones.
			//
			$pastResources = [];
			foreach ($member->planItems as $item) {
				if ($item->plan_item_status_id != PlanItem::STATUS_RECOMMENDED && $item->plan_item_status_id != PlanItem::STATUS_WITHDRAWN) {
					array_push($pastResources, $item->module->resource_id);
				}
			}

			/** @var ResourceAlignment[] $resourceAlignments */
			$resultSet = ResourceAlignment::query()
					->inWhere('question_id', array_keys($scoredQuestions))
					->notInWhere('resource_id', $pastResources)
					->inWhere('resource_id', array_keys($futureResources))
					->execute();
			$resourceAlignments = [];
			foreach ($resultSet as $alignment) {
				$resourceAlignments[]= $alignment;
			}
			foreach ($resourceAlignments as $resourceAlignment) {
				$resourceAlignment->setUtilityByResponse(
						$scoredQuestions[$resourceAlignment->question_id]['score']);
			}

			// Record the alignment strengths that constitute coverage for each question
			$maxCoveringStrengths = [];
			foreach ($scoredQuestions as $key => $value) {
				$maxCoveringStrengths[$key] = 0;
			}
			foreach ($resourceAlignments as $alignment) {
				if ($alignment->weight > $maxCoveringStrengths[$alignment->question_id]) {
					$maxCoveringStrengths[$alignment->question_id] = $alignment->weight;
				}
			}
			/*
                        // Try to reuse resources that are shared between different instruments.
                        // We will not be deleting recommendations from other instruments so we might
                        // as well not re-cover them

                        // get all plan items for this member that are recommended by
                        // another instrument
                        $questionsCoveredByOther = [];
                        if (!empty($instrument)) {
                            $resourcesRecommendedByOther = [];
                            $resourceToPlanItem = [];
                            $sharedPlanItems = [];
                            $allRecommendedPlanItems = [];
                            foreach ($member->planItems as $item) {
                                if ($item->plan_item_status_id != PlanItem::STATUS_RECOMMENDED) {
                                    continue;
                                }
                                $allRecommendedPlanItems[] = $item->id;
                                foreach ($item->recommended as $recommended) {
                                    if ($recommended->instrument_id != $instrument) {
                                        $resourceToPlanItem[$item->module->resource_id] = $item->id;
                                        $resourcesRecommendedByOther[$item->module->resource_id] = 0;
                                        break;
                                    }
                                }
                            }
                            foreach ($resourceAlignments as $alignment) {
                                if (array_key_exists($alignment->resource_id, $resourcesRecommendedByOther)) {
                                    if ($alignment->weight == $maxCoveringStrengths[$alignment->question_id]) {
                                        $questionsCoveredByOther[$alignment->question_id] = 0;
                                        $sharedPlanItems[$resourceToPlanItem[$alignment->resource_id]] = 0;
                                    }
                                }
                            }
                            // Now adjust recommended table, Delete all recommended plan items
                            // and add all shared.

                        }
            */
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
							'totalScoreError'    => 0,
							'order'              => 0,
							'rating'             => 0,
					];
				}
				if ($alignment->weight == $maxCoveringStrengths[$alignment->question_id]) {
					$coverage = &$resourceCoverages[$rId];
					$coverage['totalWeight'] += 1;
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
						self::reduceResourceCoverages($coverage, $resourceCoverages);
						break;
					}
				}
				if (count($resourceCoverages) == 0) {
					break;
				}
			}
			self::setOrderAndRatings($rankedCoverages, $scoredQuestions);

			// Sort final resource list in descending order of the total total error
			//
			usort($rankedCoverages, function ($c1, $c2) {
				return $c2['totalScoreError'] - $c1['totalScoreError'];
			});
		}
		return $rankedCoverages;
	}

	/**
	 * Save, for each covered competency, the covering resource.
	 *
	 * @param $rankedCoverages
	 * @param $assessmentId
	 */
	private function saveAssessmentCoverages($rankedCoverages, $assessmentId) {
		foreach ($rankedCoverages as $rankedCoverage) {
			$responses = AssessmentResponse::query()
					->where('assessment_id=:aid:', ['aid' => $assessmentId])
					->inWhere('question_id', array_keys($rankedCoverage['questions']))
					->execute();
			/** @var AssessmentResponse $response */
			foreach ($responses as $response) {
				$response->update(['recommended_resource_id' => $rankedCoverage['resourceId']]);
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
	 *
	 * @throws \Exception
	 */
	private static function saveRankedResources($rankedCoverages, $member, $assessmentId) {
		$date = self::dbDateTime();
		$recommendationFields = [
				'member_id'     => $member->id,
				'assessment_id' => $assessmentId,
				'created_on'    => $date,
		];
		$recommendation = self::findFirst([
				'conditions' => "member_id=:mid: AND assessment_id=:aid:",
				'bind'       => ['mid' => $member->id, 'aid' => $assessmentId]
		]);
		if (empty($recommendation)) {
			$recommendation = new Recommendation();
		}
        /*
		if (!$recommendation->save($recommendationFields)) {
			throw new \Exception($recommendation->errorMessagesAsString());
		}
        */
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
				if (!$recommendation->update($newRecommendations[$updateIndex])) {
					throw new \Exception($recommendation->errorMessagesAsString());
				}
				$updateIndex++;
			}
		}
		$inserts = array_slice($newRecommendations, $updateIndex, count($newRecommendations));
		if (!empty($inserts)) {
			foreach ($inserts as $insert) {
				$newItem = new PlanItem();
				if (!$newItem->save($insert)) {
					throw new \Exception($recommendation->errorMessagesAsString());
				}
			}
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
				$coverage['totalScoreError'] +=
						1 - ($question['score'] / $question['maxScore']);
			}
			if ($coverage['totalScoreError'] > $maxError) {
				$maxError = $coverage['totalScoreError'];
			}
		}
		foreach ($rankedCoverages as &$coverage) {
			$coverage['rating'] = $maxError != 0 ? ceil(self::MAX_RATING * ($coverage['totalScoreError'] / $maxError)) : 0;
		}
	}

	/**
	 * @param array $scoredQuestions
	 *
	 * @return array
	 */
	private function assessmentQuestionsToCover($scoredQuestions) {
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
	private static function reduceResourceCoverages($selectedCoverage, &$coverages) {
		foreach ($coverages as &$coverage) {
			foreach ($selectedCoverage['questions'] as $question => $dummy) {
				if (array_key_exists($question, $coverage['questions'])) {
					unset($coverage['questions'][$question]);
					$coverage['totalWeight'] -= 1;
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
