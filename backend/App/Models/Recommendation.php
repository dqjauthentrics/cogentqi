<?php
namespace App\Models;

use App\Components\Result;
use App\Models\Outcome;

/**
 * Class Recommendation
 * @package App\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple|PlanItem[] getPlanItems()
 * @method Member getMember()
 * @method Assessment getAssessment()
 */
class Recommendation extends AppModel {
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
		$this->hasMany('id', 'App\Models\PlanItem', 'recommendation_id', ['alias' => 'PlanItems']);
		$this->belongsTo('member_id', 'App\Models\Member', 'id', ['alias' => 'Member']);
		$this->belongsTo('assessment_id', 'App\Models\Assessment', 'id', ['alias' => 'Assessment']);
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

			$organizationOutcomes = OutcomeReport::query()->where('organization_id=?', $member['organization_id'])->execute();
			$outcomeAlignments = OutcomeAlignment::query()
					->where(
							'question_id IN (SELECT id FROM App\Models\Question WHERE question_group_id IN (SELECT id FROM App\Models\QuestionGroup WHERE instrument_id=:id:))',
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
     * @param MemberEvent[] $memberEvents
     * @throws \Exception
     */
    public function createRecommendationsForEvents($memberEvents) {
        // See which events have reached the threshold number of occurrences
        /** @var MemberEvent[] $activatedMemberEvents */
        $activatedMemberEvents = [];
        /** @var MemberEvent $memberEvent */
        foreach ($memberEvents as $memberEvent) {
            /** @var MemberEvent[] $events */
            $events = MemberEvent::query()->
            where('member_id = ?1 AND event_id = ?2 AND recommendation_made = FALSE')->
            bind([1 => $memberEvent->member_id, 2 => $memberEvent->event_id])->
            execute()->toArray();
            if (count($events) >= $memberEvent->event->threshold) {
                $activatedMemberEvents[] = $memberEvent;
                /** @var MemberEvent $event */
                foreach ($events as $event) {
                    $event->update(['recommendation_made' => TRUE]);
                }
            }
        }
        if (empty($activatedMemberEvents)) {
            return;
        }
        $member = $activatedMemberEvents[0]->member;

        // Accumulate questions and their scores
        $questionToScores = [];
        $maxRanges = [];
        foreach ($activatedMemberEvents as $memberEvent) {
            foreach ($memberEvent->event->alignments as $alignment) {
                if (!array_key_exists($alignment->question_id, $questionToScores)) {
                    $questionToScores[$alignment->question_id] = [];
                    $maxRanges[$alignment->question_id] =
                        $alignment->question->type->max_range;
                }
                $questionToScores[$alignment->question_id][] = $alignment->weight;
            }
        }

        // Calculate average scores
        $scoredQuestions = [];
        foreach ($questionToScores as $questionId => $scores) {
            $scoredQuestions[$questionId] = [
                'score' => round(array_sum($scores)/count($scores)),
                'maxScore' => $maxRanges[$questionId]
            ];
        }

        // Create recommendations
        $rankedCoverings = self::createRankedResourceList(
            $scoredQuestions, $member, TRUE);

        // Adjustment for order of recommendations
        $maxItem = PlanItem::maximum(
            [
                "column"     => "score",
                "conditions" => "member_id = ?0 AND plan_item_status_id = ?1",
                "bind"       => [$member->id, PlanItem::STATUS_RECOMMENDED]
            ]
        );

        // Save new recommendations
        $date = new \DateTime();
        foreach ($rankedCoverings as $covering) {
            $newRecommendation = self::createNewRecommendationArray(
                $covering['moduleId'],
                $member->id,
                $date,
                $covering['rating'],
                $covering['order'] + $maxItem,
                null
            );
            $newItem = new PlanItem();
            if (!$newItem->save($newRecommendation)) {
                throw new \Exception($newItem->errorMessagesAsString());
            }
        }
	}

	/**
	 * @param int $assessmentId
	 *
	 * @return array
	 */
	public static function createRecommendationsForMember($member) {
		// Obtain the aggregate (assessment and outcome) scores
		$scoredQuestions = self::createScoredQuestions($member);
		$rankedCoverings = self::createRankedResourceList($scoredQuestions, $member);
        //  @todo need to identify would is initiating the recommendation generation
        //  passing 1 for now
        self::saveRankedResources($rankedCoverings, $member, 1);
		return $rankedCoverings;
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
        $orgOutcomes = OutcomeReport::getLatestForOrganization(
            $organizationId);
        /** @var OutcomeReport $orgOutcome */
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
	 * @param array  $scoredQuestions
	 * @param Member $member
	 * @param boolean $reuseCurrentRecommendations
	 *
	 * @return array
	 *
	 */
	private static function createRankedResourceList($scoredQuestions, $member, $reuseCurrentRecommendations = FALSE) {
		// Record the resources that will be offered in the future as a module.
		// If multiple modules exist for a resource, select the earliest one.
		//
		$futureResources = [];
		$rankedCoverings = [];
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
            /** @var PlanItem $item */
			foreach ($member->planItems as $item) {
				if ($item->plan_item_status_id != PlanItem::STATUS_RECOMMENDED && $item->plan_item_status_id != PlanItem::STATUS_WITHDRAWN) {
					array_push($pastResources, $item->module->resource_id);
				}
			}

			/** @var ResourceAlignment[] $resourceAlignments */
            $resourceAlignments = ResourceAlignment::query()
					->inWhere('question_id', array_keys($scoredQuestions))
					->notInWhere('resource_id', $pastResources)
					->inWhere('resource_id', array_keys($futureResources))
					->execute()
                    ->toArray();
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

            if ($reuseCurrentRecommendations) {
                // Remove any question scores already covered by current recommendations
                $currentResources = [];
                // Accumulate current resources recommendations
                foreach ($member->planItems as $item) {
                    if ($item->plan_item_status_id == PlanItem::STATUS_RECOMMENDED) {
                        $currentResources[$item->module->resource_id] = 0;
                    }
                }
                // Map questions to current resources
                $currentAlignments = [];
                foreach ($resourceAlignments as $alignment) {
                    $isCurrentAlignment = array_key_exists(
                        $alignment->resource_id, $currentResources);
                    if ($isCurrentAlignment) {
                        if (!array_key_exists($alignment->question_id, $currentAlignments)) {
                            $currentAlignments[$alignment->question_id] = [];
                        }
                        $currentAlignments[$alignment->question_id][] = $alignment;
                    }
                }
                // Determine which questions are covered by current resources
                $questionsToRemove = [];
                foreach ($scoredQuestions as $questionId => $dummy) {
                    if (!array_key_exists($questionId, $currentAlignments)) {
                        continue;
                    }
                    foreach ($currentAlignments[$questionId] as $alignment) {
                        $weight = $alignment->weight;
                        $maxWeight = $maxCoveringStrengths[
                            $alignment->question_id];
                        if ($weight == $maxWeight) {
                            $questionsToRemove[] = $questionId;
                        }
                    }
                }
                // Remove already-covered question scores
                foreach ($questionsToRemove as $questionId) {
                    unset($scoredQuestions[$questionId]);
                }
            }

			// Record how well each resource covers a subset of questions
			$questionCoverings = [];
			foreach ($resourceAlignments as $alignment) {
				$rId = $alignment->resource_id;
				if (!array_key_exists($rId, $questionCoverings)) {
					$questionCoverings[$rId] = [
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
					$covering = &$questionCoverings[$rId];
					$covering['totalWeight'] += 1;
					$covering['questions'][$alignment->question_id] = 0;
				}
			}

			self::sortResourceCoverages($questionCoverings);
			unset($covering);
			while (TRUE) {
				for ($i = count($questionCoverings) - 1; $i >= 0; $i--) {
					$covering = $questionCoverings[$i];
					unset($questionCoverings[$i]);
					if ($covering['totalWeight'] != 0) {
						array_push($rankedCoverings, $covering);
						self::reduceResourceCoverages($covering, $questionCoverings);
						break;
					}
				}
				if (count($questionCoverings) == 0) {
					break;
				}
			}
			self::setOrderAndRatings($rankedCoverings, $scoredQuestions);

			// Sort final resource list in descending order of the total total error
			//
			usort($rankedCoverings, function ($c1, $c2) {
				return $c2['totalScoreError'] - $c1['totalScoreError'];
			});
		}
		return $rankedCoverings;
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
	 * @param array  $rankedCoverings
	 * @param Member $member
	 * @param int    $assessmentId
	 *
	 * @throws \Exception
	 */
	private static function saveRankedResources($rankedCoverings, $member, $assessmentId) {
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
		foreach ($rankedCoverings as $coverage) {
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
                    throw new \Exception($newItem->errorMessagesAsString());
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
