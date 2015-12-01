<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Model;

use App\Components\AjaxResult;
use Nette\Database\Table\IRow,
	ResourcesModule\BasePresenter;
use Nette\Utils\DateTime;

class Recommendation extends BaseModel {
	const MAX_ORG_LEVEL = 3;
    const MAX_RATING = 4;

	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $member
	 * @param int                        $mode
	 *
	 * @return array
	 */
	public static function map($database, $member, $mode = BasePresenter::MODE_LISTING) {
		return $database->map($member);
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
	 * @param \App\Components\DbContext $database
	 * @param int                       $assessmentId
	 *
	 * @return \App\Components\AjaxResult
	 */
	public static function recommend($database, $assessmentId) {
		$result = new AjaxResult();
		try {
			$assessment = $database->table('assessment')->get($assessmentId);
			$member = $database->table('member')->get($assessment["member_id"]);
            $responses = $assessment->related('assessment_response');

			$organizationOutcomes = $database->table('organization_outcome')->where('organization_id=?', $member['organization_id'])->fetchAll();
			$outcomeAlignments = $database->table('outcome_alignment')
				->where('question_id IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?))', $assessment["instrument_id"]);
			$outcomeEvents = $database->table('outcome_event')->where('member_id=?', $assessment['member_id'])->fetchAll();


			$outTable = [];
			foreach ($outcomeAlignments as $outcomeAlignment) {
				$outcome = $outcomeAlignment->ref('outcome');
				$questionId = $outcomeAlignment["question_id"];
				$outcomeId = $outcome["id"];
				if (empty($outTable[$questionId])) {
					$outTable[$questionId] = [];
				}
				$outTable[$questionId][$outcomeId] = [
					'name'     => $outcome["name"],
					'weight'   => $outcomeAlignment['weight'],
					'relWt'    => $outcomeAlignment['rel_wt'],
					'nEvents'  => self::countMatchingEvents($outcomeId, $outcomeEvents),
					'orgLevel' => self::getOrgOutcome($outcomeId, $organizationOutcomes)
				];
			}
			/**
			 * @var \Nette\Database\Table\IRow $response
			 */
			$disp = [];
			foreach ($responses as $response) {
				$questionId = $response['question_id'];
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
				//$result->data = ['table' => $outTable, 'responses' => $disp]; // for debugging
			}
		}
		catch (\Exception $exception) {
			$result->setException($exception);
		}
		return $result;
	}

    public static function planItemCompleted($database, $planItem) {
        $latestAssessmentIds = Assessment::getLatestAssessmentIds($database, $planItem->member_id);
        $responses = $database->table('assessment_response')->
            where("assessment_id IN ? AND recommended_resource IN ?",
            $latestAssessmentIds, $planItem->module->resource_id);
        foreach ($responses as $response) {
            $response->update(['recommended_resource' => null]);
        }
    }

    public static function createRecommendationsForEvent($database, $memberEvent) {
        $eventAlignments = $database->table('event_alignment')->where('event_id', $memberEvent->event_id);
        $questionToResponse = [];
        foreach ($eventAlignments as $alignment) {
            $questionToResponse[$alignment->question_id] = null;
        }
        $latestAssessmentIds= Assessment::getLatestAssessmentIds($database, $memberEvent->member_id);
        $responsesToCover = $database->table('assessment_response')->
            where("assessment_id IN ? AND question_id IN ?",
            $latestAssessmentIds, array_keys($questionToResponse));
        foreach ($responsesToCover as $response) {
            $questionToResponse[$response->question_id] = $response;
        }
        // Increment event values on responses if not covered
        foreach ($eventAlignments as $alignment) {
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
        $rankedCoverages = self::createRankedResourceList($database, $scoredQuestions, $memberEvent->member);

        $currentResourceRecommendations = [];
        $order = 0;
        $currentRecommendation = $database->table('plan_item')->
            where('member_id', $memberEvent->member_id) ->
            where('plan_item_status_id', PlanItem::STATUS_RECOMMENDED);
        foreach ($currentRecommendation as $recommendation) {
            if ($recommendation->score > $order) {
                $order = $recommendation->score;
            }
            $currentResourceRecommendations[$recommendation->module_id] = 0;
        }
        $newRecommendations = [];
        $date = new DateTime();
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

    private static function createScoredQuestions($assessmentResponses) {
        $scoredQuestions = [];
        foreach ($assessmentResponses as $response) {
            $scoredQuestions[$response->question_id] = [
                'response' => $response->response,
                'maxResponse' => $response->question->question_type->max_range,
                'importance' => $response->question->importance,
            ];
        }
        return $scoredQuestions;
    }

    /**
     * @param \App\Components\DbContext $database
     * @param int $assessmentId
     * @throws \Exception
     */
	public static function createRecommendationsForAssessment($database, $assessmentId) {
		try {
			$assessment = $database->table('assessment')->get($assessmentId);
            $member = $database->table('member')->get($assessment["member_id"]);
            $scoredQuestions = self::createScoredQuestions($assessment->related('assessment_response'));
            // Filter out any competencies that don't require resource coverage
            $filteredQuestions = self::assessmentQuestionsToCover($scoredQuestions);
            $rankedCoverages = self::createRankedResourceList($database, $filteredQuestions, $member);
            self::saveRankedResources($database, $rankedCoverages, $member, $assessmentId);
            self::saveAssessmentCoverages($database, $rankedCoverages, $assessmentId);
		}
		catch (\Exception $exception) {
			// For now...;
            throw $exception;
		}
	}

    /**
     * @param \App\Components\DbContext $database
     * @param array                     $filteredQuestions
     * @param \Nette\Database\Table\IRow $member
     *
     * @return array
     *
     */
    private static function createRankedResourceList($database, $filteredQuestions, $member) {
        // Record the resources that will be offered in the future as a module.
        // If multiple modules exist for a resource, select he earlies one.
        $futureResources = [];
        foreach($database->query("SELECT * FROM module WHERE starts > NOW()") as $module) {
            $rId = $module->resource_id;
            $starts = !empty($module->starts) ? $module->starts->getTimeStamp() : null;
            if (!array_key_exists($rId, $futureResources)) {
                $futureResources[$rId] = [
                    'moduleId' => $module->id,
                    'starts' => $starts,
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
        foreach ($member->related('plan_item.member_id') as $item) {
            if ($item->plan_item_status_id != PlanItem::STATUS_RECOMMENDED &&
                $item->plan_item_status_id != PlanItem::STATUS_WITHDRAWN) {
                array_push($pastResources, $item->module->resource->id);
            }
        }
        $rankedCoverages = [];
        $resourceAlignments = $database->table('resource_alignment')->
            where('question_id IN', array_keys($filteredQuestions))->
            where('resource_id NOT IN', $pastResources)->
            where('resource_id IN', array_keys($futureResources));

        // Record the alignment strengths that constitute coverage for each question
        $maxCoveringStrengths = [];
        foreach ($filteredQuestions as $key => $value) {
            $maxCoveringStrengths[$key] = 0;
        }
        foreach ($resourceAlignments as $alignment) {
            if ($alignment['weight'] > $maxCoveringStrengths[$alignment['question_id']]) {
                $maxCoveringStrengths[$alignment['question_id']] = $alignment['weight'];
            }
        }

        // Record how well each resource covers a subset of questions
        $resourceCoverages = [];
        foreach ($resourceAlignments as $alignment) {
            $rId = $alignment['resource_id'];
            if (!array_key_exists($rId, $resourceCoverages)) {
                $resourceCoverages[$rId] = [
                        'resourceId' => $rId,
                        'moduleId' => $futureResources[$rId]['moduleId'],
                        'totalWeight' => 0,
                        'questions' => [],
                        'totalResponseError' => 0,
                        'order' => 0,
                        'rating' => 0,
                    ];
            }
            if ($alignment['weight'] == $maxCoveringStrengths[$alignment['question_id']]) {
                $coverage = &$resourceCoverages[$rId];
                $coverage['totalWeight'] +=
                    $filteredQuestions[$alignment['question_id']]['importance'];
                $coverage['questions'][$alignment['question_id']] = 0;
            }
        }
        self::sortResourceCoverages($resourceCoverages);
        unset($coverage);
        while (true) {
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
        usort($rankedCoverages, function($c1, $c2) {
           return $c2['totalResponseError'] - $c1['totalResponseError'];
        });
        return $rankedCoverages;
    }
    // Save, for each covered competency, the covering resource
    private static function saveAssessmentCoverages($database, $rankedCoverages, $assessmentId) {
        foreach ($rankedCoverages as $rankedCoverage) {
            $responses = $database->table('assessment_response')->
                where('assessment_id = ? AND question_id IN ?',
                $assessmentId, array_keys($rankedCoverage['questions']));
            foreach ($responses as $response) {
                $response->update(['recommended_resource' => $rankedCoverage['resourceId']]);
            }
        }
    }

    private static function createNewRecommendationArray(
        $moduleId, $memberId, $date, $rating, $order, $recommendationId) {
        return [
            'module_id' => $moduleId,
            'plan_item_status_id' => PlanItem::STATUS_RECOMMENDED,
            'status_stamp' => $date,
            'member_id' => $memberId,
            'rank' => $rating,
            'score' => $order,
            'recommendation_id' => $recommendationId,
        ];
    }

    //  Save recommendations to plan item table
    private static function saveRankedResources($database, $rankedCoverages, $member, $assessmentId) {
        $date = new DateTime();
        $recommendationFields = [
            'member_id' => $member->id,
            'assessment_id' => $assessmentId,
            'created_on' => $date,
        ];
        $recommendation = $database->table('recommendation')->
            where("member_id = ? AND assessment_id = ?", $member->id, $assessmentId);
        if (count($recommendation) == 0) {
            $recommendation = $database->table('recommendation')->insert($recommendationFields);
        }
        else {
            $recommendation = $recommendation->fetch();
            $recommendation->update($recommendationFields);
        }
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
        $oldRecommendations = $member->related('plan_item.member_id')->
            where("plan_item_status_id = 'R'");
        $numberToDelete = max(0, count($oldRecommendations) - count($newRecommendations));
        $numberDeleted = 0;
        $updateIndex = 0;

        // foreach old recommendation row we either delete it or update it
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
        $inserts = array_slice(
            $newRecommendations, $updateIndex, count($newRecommendations));
        if (count($inserts) > 0) {
            $database->table('plan_item')->insert(array_slice(
                $newRecommendations, $updateIndex, count($newRecommendations)));
        }
    }

    private static function setOrderAndRatings(&$rankedCoverages, $scoredQuestions) {
        $order = 1;
        $maxError = 0;
        foreach($rankedCoverages as &$coverage) {
            $coverage['order'] = $order++;
            foreach ($coverage['questions'] as $questionId => $dummy) {
                $question = $scoredQuestions[$questionId];
                $coverage['totalResponseError'] +=
                    1 - ($question['response']/$question['maxResponse']);
            }
            if ($coverage['totalResponseError'] > $maxError) {
                $maxError = $coverage['totalResponseError'];
            }
        }
        foreach($rankedCoverages as &$coverage) {
            $coverage['rating'] = $maxError !=0 ?
                ceil(self::MAX_RATING*($coverage['totalResponseError']/$maxError)) : 0;
        }
    }

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

    private static function reduceResourceCoverages($selectedCoverage, &$coverages, $scoredQuestions) {
        foreach ($coverages as &$coverage) {
            foreach ($selectedCoverage['questions'] as $question => $dummy) {
                if (array_key_exists($question, $coverage['questions'])){
                    unset($coverage['questions'][$question]);
                    $coverage['totalWeight'] -= $scoredQuestions[$question]['importance'];
                }
            }
        }
        unset($coverage);
        self::sortResourceCoverages($coverages);
    }

    private static function sortResourceCoverages(&$coverages) {
        usort($coverages, function($r1, $r2) {
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