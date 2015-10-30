<?php
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

			$organizationOutcomes = $database->table('organization_outcome')->where('organization_id=?', $member['organization_id'])->fetchAll();
			$outcomeAlignments = $database->table('outcome_alignment')
				->where('question_id IN (SELECT id FROM question WHERE question_group_id IN (SELECT id FROM question_group WHERE instrument_id=?))', $assessment["instrument_id"]);
			$outcomeEvents = $database->table('outcome_event')->where('member_id=?', $assessment['member_id'])->fetchAll();
			$responses = $assessment->related('assessment_response');

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
}
