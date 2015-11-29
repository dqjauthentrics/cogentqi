<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Model;

use App\Components\AjaxResult;
use Nette\Database\Table\IRow,
	ResourcesModule\BasePresenter;

class Recommendation extends BaseModel {
	const MAX_ORG_LEVEL = 3;

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

	/**
	 * @param \App\Components\DbContext $database
	 * @param int                       $assessmentId
	 *
	 * @return \App\Components\AjaxResult
	 */
	public static function createRecommendationsForAssessment($database, $assessmentId) {
		try {
			$assessment = $database->table('assessment')->get($assessmentId);
            $member = $database->table('member')->get($assessment["member_id"]);
            $scoredQuestions = [];
            foreach ($assessment->related('assessment_response') as $response) {
                $scoredQuestions[$response->question->id] = [
                    'response' => $response->response,
                    'maxResponse' => $response->question->question_type->max_range,
                    'importance' => $response->question->importance,
                    'outcome_threshold' => $response->question->outcome_threshold,
                    'outcome_value' => $response->outcome_value,
                    'event_threshold' =>$response->question->event_threshold,
                    'event_value' => $response->event_value,
                ];
				if ($response->question->importance <= 0) {
					throw new \Exception('Question importance must be greater than zero');
				}
            }
            $rankedCoverages = self::createRankedResourceList($database, $scoredQuestions, $member);
            self::saveRankedResources($database, $rankedCoverages, $member, $assessmentId);
		}
		catch (\Exception $exception) {
			// For now...;
            throw $exception;
		}
	}

    /**
     * @param \App\Components\DbContext $database
     * @param array                     $scoredQuestions
     * @param \Nette\Database\Table\IRow $member
     *
     * @return array
     *
     */
    private static function createRankedResourceList($database, $scoredQuestions, $member) {
        // Filter out any competencies that don't require resource coverage
        $filteredQuestions = self::questionsToCover($scoredQuestions);

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
        // in the member's plan except for previously recommended ones.
        $pastResources = [];
        foreach ($member->related('plan_item.member_id') as $item) {
            if ($item->plan_item_status_id != 'R') {
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

    private static function saveRankedResources($database, $rankedCoverages, $member, $assessmentId) {
        $date = $database->dbDateTme();
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
            $newRecommendations[] = [
                'module_id' => $coverage['moduleId'],
                'plan_item_status_id' => 'R',
                'status_stamp' => $date,
                'member_id' => $member->id,
                'rank' => $coverage['rating'],
                'score' => $coverage['order'],
                'recommendation_id' => $recommendation->id,
            ];
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
        // Now inserts
        $database->table('plan_item')->insert(array_slice(
            $newRecommendations, $updateIndex, count($newRecommendations)));
    }

    private static function setOrderAndRatings(&$rankedCoverages, $scoredQuestions) {
        $MAX_RATING = 4;
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
            $coverage['rating'] = ceil($MAX_RATING*($coverage['totalResponseError']/$maxError));
        }
    }

    private static function questionsToCover($scoredQuestions) {
        $filteredQuestions = [];
        foreach ($scoredQuestions as $questionId => $scoredQuestion) {
            if ($scoredQuestion['outcome_value'] >= $scoredQuestion['outcome_threshold'] ||
                $scoredQuestion['event_value'] >= $scoredQuestion['event_threshold']) {
                $filteredQuestions[$questionId] = $scoredQuestion;
            }
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