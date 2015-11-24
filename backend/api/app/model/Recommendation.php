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
		$result = new AjaxResult();
		try {
			$assessment = $database->table('assessment')->get($assessmentId);
            $member = $database->table('member')->get($assessment["member_id"]);
            $scoredQuestions = [];
            foreach ($assessment->related('assessment_response') as $response) {
                $scoredQuestions[$response->question->id] = [
                    'response' => $response->response,
                    'maxResponse' => $response->question->max_range,
                    'importance' => $response->question->importance,
                    'outcome_threshold' => $response->question->outcome_threshold,
                    'outcome_value' => $response->outcome_value,
                    'event_threshold' =>$response->question->event_threshold,
                    'event_value' => $response->event_value,
                ];
            }
            $result->data = self::createRankedResourceList($database, $scoredQuestions, $member);
		}
		catch (\Exception $exception) {
			$result->setException($exception);
		}
		return $result;
	}

    /**
     * @param \App\Components\DbContext $database
     * @param array                     $scoredQuestions
     *
     * @return array
     */
    private static function createRankedResourceList($database, $scoredQuestions, $member) {
        // Filter out any competencies that don't require resource coverage
        $filteredQuestions = self::questionsToCover($scoredQuestions);

        $pastResources = [];
        foreach ($member->related('plan_item.member_id') as $item) {
            array_push($pastResources, $item->module->resource->id);
        }
        $rankedCoverages = [];
        $resourceAlignments = $database->table('resource_alignment')->
            where('question_id IN', array_keys($filteredQuestions))->
            where('resource_id NOT IN', $pastResources);

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
            if (!array_key_exists($resourceCoverages, $rId)) {
                $resourceCoverages[$rId] =
                    [
                        'resourceId' => $rId,
                        'totalWeight' => 0,
                        'questions' => [],
                        'totalResponseError' => 0,
                    ];
            }
            if ($alignment['weight'] == $maxCoveringStrengths[$alignment['question_id']]) {
                $coverage = $resourceCoverages[$rId];
                $coverage['totalWeight'] +=
                    $filteredQuestions[$alignment['question_id']]['importance'];
                $coverage['questions'][$alignment['question_id']] = 0;
            }
        }
        self::sortResourceCoverages($resourceCoverages);

        while (true) {
            for ($i = count($resourceCoverages) - 1; $i >= 0; $i++) {
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
        self::setTotalResponseErrors($rankedCoverages);
        // Sort final resource list in descending order of the total response error
        usort($rankedCoverages, function($c1, $c2) {
           return $c2['totalResposeError'] - $c1['totalResposeError'];
        });
        // Return a list of resource ids
        $resourceList = [];
        for ($i = 0; $i < count($rankedCoverages); $i++) {
            array_push($resourceList, $rankedCoverages[$i]['resourceId']);
        }
        return $resourceList;
    }

    private static function setTotalResponseErrors(&$rankedCoverages) {
        foreach($rankedCoverages as $coverage) {
            foreach ($coverage['questions'] as $question) {
                $coverage['totalResponseError'] += 1 - $question['response']/$question['maxResponse'];
            }
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
        foreach ($coverages as $coverage) {
            foreach ($selectedCoverage['questions'] as $question => $dummy) {
                if (array_key_exists($question, $coverage['questions'])){
                    unset($coverage['questions'][$question]);
                    $coverage['totalWeight'] -= $scoredQuestions[$question]['importance'];
                }
            }
        }
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