<?php
namespace Cogent\Components;

use Cogent\Models\Assessment;
use Cogent\Models\AssessmentResponse;
use Cogent\Models\Instrument;
use Cogent\Models\Organization;
use Cogent\Models\Question;
use Cogent\Models\QuestionChoice;
use Cogent\Models\QuestionGroup;

/**
 * Class Matrix
 * @package Cogent\Components
 */
class Matrix {
	/** @var \Phalcon\Db\AdapterInterface $dbif */
	private $dbif = NULL;

	/**
	 * @param \Phalcon\Db\AdapterInterface $dbif
	 */
	function __construct($dbif) {
		$this->dbif = $dbif;
	}

	/**
	 * @param int $total
	 * @param int $count
	 * @param int $decimalPlaces
	 *
	 * @return float|int
	 */
	public static function avg($total, $count, $decimalPlaces = 1) {
		return !empty($total) && !empty($count) ? round($total / $count, $decimalPlaces) : 0;
	}


	/**
	 * @param string $currentType
	 * @param string $testType
	 *
	 * @return string
	 */
	private function setType($currentType, $testType) {
		if (empty($currentType)) {
			return $testType;
		}
		else if ($currentType !== $testType) {
			return 'M';
		}
		return $currentType;
	}

	private function ellipsify($str, $maxLen) {
		if (strlen($str) > $maxLen) {
			$str = substr($str, 0, $maxLen) . '...';
		}
		return $str;
	}

	/**
	 * @param array $hdrs
	 * @param array $rows
	 */
	public function matrixTable($hdrs, $rows) {
		?>
		<style>
			#matrix {
				border-collapse: collapse;
			}

			#matrix th {
				border: 1px solid gray;
				padding: 0.1em;
				font-size: 0.8em;
				transform: rotate(305deg);
				margin: 0;
				height: 200px;
			}

			#matrix td {
				border: 1px solid gray;
				padding: 0.1em;
				font-size: 0.9em;
				margin: 0;
			}

			#matrix td.typeV {
				background: #EEE;
			}

			#matrix td.typeS {
				background: #EFE;
			}

			#matrix td.typeC {
				background: #FEE;
			}

			#matrix td.typeCS {
				background: #FEF;
				font-weight: bold;
			}

			#matrix td.typeR {
				background: #FFE;
				font-weight: bold;
			}

			#matrix td.typeRC {
				background: #FFE;
				font-weight: bold;
			}
		</style>
		<table id="matrix">
			<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<?php
				foreach ($hdrs as $hdr) {
					?>
					<th><?= $this->ellipsify(@$hdr[1], 15) ?></th>
					<?php
				}
				?>
			</tr>
			</thead>
			<?php
			foreach ($rows as $row) {
				?>
				<tr>
					<td><?= !empty($row["oid"]) ? $row["oid"] : @$row["mid"] . ':' . @$row["aid"] ?></td>
					<td><?= @$row["n"] ?></td>
					<?php
					foreach ($row["rsp"] as $rsp) {
						?>
						<td class="type<?= @$rsp[0] ?> section<?= @$rsp[3] ?>"><?= @$rsp[0] . ':' . @$rsp[1] . ':' . @$rsp[2] . ':' . @$rsp[3] ?></td>
						<?php
					}
					?>
				</tr>
				<?php
			}
			?>
		</table>
		<?php
	}

	/**
	 * @param int $organizationId
	 * @param int $instrumentId
	 *
	 * @return array
	 */
	private function getMembersForAssessments($organizationId, $instrumentId) {
		/** @var \PDO $pdo */
		$pdo = $this->dbif;
		$sql = "SELECT
				a.member_id,max(a.last_modified) AS maxMod, m.first_name, m.last_name, m.role_id, m.job_title, m.email, m.level
			FROM assessment a, member m
			WHERE a.member_id=m.id AND instrument_id=? AND member_id IN (SELECT id FROM member WHERE organization_id=?) GROUP BY member_id";
		$statement = $pdo->prepare($sql);
		$statement->execute([$instrumentId, $organizationId]);
		$dbRecords = $statement->fetchAll();

		$members = [];
		$memberIds = [];
		foreach ($dbRecords as $dbRecord) {
			$memberIds[] = $dbRecord["member_id"];
			$members[$dbRecord["member_id"]] = [
				'max' => $dbRecord["maxMod"],
				'fn'  => $dbRecord["first_name"],
				'ln'  => $dbRecord["last_name"],
				'r'   => $dbRecord["role_id"],
				'jt'  => $dbRecord["job_title"],
				'em'  => $dbRecord["email"],
				'lv'  => $dbRecord["level"],
			];
		}
		$memberIds = implode(",", $memberIds);
		return [$memberIds, $members];
	}

	/**
	 * @param int $instrumentId
	 *
	 * @return array
	 */
	private function getMatrixHeaders($instrumentId) {
		$headers = [];
		$groupIdx = 0;
		$lastGroupId = NULL;
		$groups = [];
		$groupRecords = QuestionGroup::find(['conditions' => 'instrument_id=:id:', 'bind' => ['id' => $instrumentId], 'order' => 'sort_order']);
		$groupNumbers = [];
		/** @var QuestionGroup $groupRecord */
		foreach ($groupRecords as $groupRecord) {
			$groups[] = trim($groupRecord->number . ' ' . $groupRecord->tag);
			$groupNumbers[$groupRecord->id] = trim($groupRecord->number);
			$questionRecords = $groupRecord->getQuestions(); //->orderBy('sort_order');
			foreach ($questionRecords as $questionRecord) {
				$groupId = $questionRecord->question_group_id;
				if ($lastGroupId != NULL && $groupId != $lastGroupId && $groupIdx < count($groups)) {
					$headers[] = ['S', $groups[$groupIdx], 'H', $groupIdx];
					$groupIdx++;
				}
				$lastGroupId = $groupId;
				$headers[] = ['R', $groupNumbers[$groupId] . '.' . trim($questionRecord->number . ' ' . $questionRecord->name), 'H', $groupIdx];
			}
		}
		if (count($groups) > 0) {
			$headers[] = ['S', $groups[(count($groups) - 1)], 'H', $groupIdx];
		}
		$headers[] = ['R', 'Averages', 'H', -1];
		return $headers;
	}

	/**
	 * @param array  $sections
	 * @param array  $columns
	 * @param array  $responses
	 * @param string $typeId
	 * @param int    $lastGroupId
	 * @param int    $colIdx
	 * @param int    $groupIdx
	 */
	private function addMatrixSection($sections, $choices, &$columns, &$responses, $typeId, $lastGroupId, $colIdx, $groupIdx) {
		if (empty($sections[$lastGroupId])) {
			$sections[$lastGroupId] = ['typeName' => $typeId, 'total' => 0, 'count' => 0, 'groupIdx' => $groupIdx - 1];
		}
		$sectAvg = $this->avg($sections[$lastGroupId]["total"], $sections[$lastGroupId]["count"]);
		$choiceStyle = $this->getChoiceStylePrefix($sectAvg, $choices);
		$responses[] = ['S', $sectAvg, $sections[$lastGroupId]["typeName"], $groupIdx - 1, $choiceStyle];
		if (empty($columns[$colIdx])) {
			$columns[$colIdx] = ['typeName' => $typeId, 'total' => 0, 'count' => 0];
		}
		$columns[$colIdx]["total"] += $sectAvg;
		$columns[$colIdx]["count"]++;
		$columns[$colIdx]["groupIdx"] = $groupIdx;
		$columns[$colIdx]["t"] = 'S';
	}

	/**
	 * @param int|double $val
	 * @param string[]   $choices
	 *
	 * @return string
	 */
	private function getChoiceStylePrefix($val, $choices) {
		$val = (int)round($val);
		return !empty($choices[$val]) ? $choices[$val] : '';
	}

	/**
	 * @param $instrumentId
	 *
	 * @return array
	 */
	private function getInstrumentChoices($instrumentId) {
		$choices = [];
		$instrument = Instrument::findFirst($instrumentId);
		if (!empty($instrument)) {
			$choiceRecords = QuestionChoice::find([
				'conditions' => 'question_type_id=:qtid:',
				'bind'       => ['qtid' => $instrument->question_type_id],
				'order'      => 'sort_order'
			]);
			if (!empty($choiceRecords)) {
				foreach ($choiceRecords as $choiceRecord) {
					$choices[] = $choiceRecord->icon_prefix; //@todo Rename column to 'style'
				}
			}
		}
		return $choices;
	}

	/**
	 * @param int $organizationId
	 * @param int $instrumentId
	 *
	 * @return array
	 */
	public function buildMatrix($organizationId, $instrumentId) {
		$headers = [];
		$tableRowValues = [];
		$groupIdx = 0;
		$error = NULL;
		try {
			$headers = $this->getMatrixHeaders($instrumentId);
			list($memberIds, $members) = $this->getMembersForAssessments($organizationId, $instrumentId);
			if (!empty($members)) {
				$assessmentRecords = Assessment::find([
					'conditions' => 'instrument_id=:iid: AND member_id IN (' . $memberIds . ')',
					'bind'       => ['iid' => $instrumentId]
				]);
				$columns = [];
				$matrix = ['total' => 0, 'count' => 0, 'typeName' => NULL];
				$groupIdx = 0;
				$typeId = '';
				$choices = $this->getInstrumentChoices($instrumentId);
				$groupIds = [];
				$groups = QuestionGroup::find(['conditions' => 'instrument_id=:id:', 'order' => 'sort_order', 'bind' => ['id' => $instrumentId]]);
				foreach ($groups as $group) {
					$groupIds[] = $group->id;
				}
				$groupIds = implode(',', $groupIds);
				foreach ($assessmentRecords as $assessment) {
					$member = $members[$assessment->member_id];
					if ($assessment->last_modified == $member["max"]) {
						$responses = [];
						$memberId = $assessment->member_id;
						$assessmentId = $assessment->id;
						$sections = [];
						$lastGroupId = NULL;
						$colIdx = 0;
						$row = ['total' => 0, 'count' => 0, 'typeName' => $assessment->instrument->questionType->entry_type];
						$groupIdx = 0;
						$recordIdx = 0;
						$questions = Question::find(['conditions' => 'question_group_id IN (' . $groupIds . ')', 'order' => 'sort_order']);
						$memberResponses = AssessmentResponse::find(['conditions' => 'assessment_id=:aid:', 'bind' => ['aid' => $assessmentId]]);
						$memberResponsesKeyed = [];
						foreach ($memberResponses as $memberResponse) {
							$memberResponsesKeyed[$memberResponse->question_id] = $memberResponse;
						}
						foreach ($questions as $question) {
							$groupId = $question->question_group_id;
							$typeId = substr($question->type->entry_type, 0, 1);
							$response = !empty($memberResponsesKeyed[$question->id]) ? $memberResponsesKeyed[$question->id]->response_index : 0;
							if (empty($sections[$groupId])) {
								if (!empty($lastGroupId)) {
									$this->addMatrixSection($sections, $choices, $columns, $responses, $typeId, $lastGroupId, $colIdx, $groupIdx);
									$colIdx++;
								}
								$sections[$groupId] = ['typeName' => $typeId, 'total' => 0, 'count' => 0, 'groupIdx' => $groupIdx - 1];
								$lastGroupId = $groupId;
								$groupIdx++;
							}
							if (empty($columns[$colIdx])) {
								$columns[$colIdx] = ['typeName' => $typeId, 'total' => 0, 'count' => 0];
							}
							if (empty($row['typeName'])) {
								$row['typeName'] = $typeId;
							}
							$choiceStyle = $this->getChoiceStylePrefix($response, $choices);
							$responses[] = ['V', $response, $typeId, $groupIdx - 1, $choiceStyle];

							$matrix['total'] += $response;
							$matrix['count']++;
							$matrix['typeName'] = $this->setType($matrix['typeName'], $typeId);

							$row["total"] += $response;
							$row["count"]++;
							$row['typeName'] = $this->setType($row['typeName'], $typeId);

							$columns[$colIdx]["total"] += $response;
							$columns[$colIdx]["count"]++;
							$columns[$colIdx]["groupIdx"] = $groupIdx;

							$sections[$groupId]["total"] += $response;
							$sections[$groupId]["count"]++;
							$sections[$groupId]['typeName'] = $this->setType($sections[$groupId]['typeName'], $typeId);
							$sections[$groupId]["groupIdx"] = $groupIdx - 1;

							$colIdx++;
							$recordIdx++;
						}
						$this->addMatrixSection($sections, $choices, $columns, $responses, $typeId, $lastGroupId, $colIdx, $groupIdx);
						$rowAvg = $this->avg($row['total'], $row['count']);
						$choiceStyle = $this->getChoiceStylePrefix($rowAvg, $choices);
						$responses[] = ['R', $rowAvg, $row['typeName'], $groupIdx, $choiceStyle];
						$tableRowValues[] = [
							'aid' => $assessmentId,
							'mid' => $memberId,
							'n'   => $member['fn'] . ' ' . $member['ln'],
							'r'   => $member["r"],
							'jt'  => $member["jt"],
							'lv'  => $member["lv"],
							'em'  => $member["em"],
							'rsp' => $responses,
						];
					}
				}
				$columnSummaries = [];
				foreach ($columns as $colIdx => $info) {
					$cAvg = $this->avg($columns[$colIdx]["total"], $columns[$colIdx]["count"]);
					$choiceStyle = $this->getChoiceStylePrefix($cAvg, $choices);
					$columnSummaries[] = ['C' . @$columns[$colIdx]['t'], $cAvg, $columns[$colIdx]["typeName"], $columns[$colIdx]["groupIdx"] - 1, $choiceStyle];
				}
				$rcAvg = $this->avg($matrix["total"], $matrix["count"]);
				$choiceStyle = $this->getChoiceStylePrefix($rcAvg, $choices);
				$columnSummaries[] = ['RC', $rcAvg, $matrix["typeName"], $groupIdx, $choiceStyle];
				$tableRowValues[] = ['mid' => -1, 'n' => 'Averages', 'rsp' => $columnSummaries];
			}
		}
		catch (\Exception $exception) {
			$error = $exception->getMessage();
		}
		return ['M', $headers, $tableRowValues, $groupIdx, $error];
	}

	/**
	 * Get a matrix of values for all organizations, calculating average values over their members.
	 */
	public function buildOrgMatrix($organizationId, $instrumentId) {
		$headers = $this->getMatrixHeaders($instrumentId);
		$tableRowValues = [];
		$instrumentId = (int)$instrumentId;
		$organizationId = (int)$organizationId;
		$choices = $this->getInstrumentChoices($instrumentId);

		$row = $this->dbif->query("SELECT retrieveOrgDescendantIds($organizationId) AS orgIds")->fetch();
		$orgIds = $row["orgIds"];
		$orgIds = $organizationId . (strlen($orgIds) > 0 ? "," : "") . $orgIds;
		$sql = "SELECT 	
					retrieveOrgSubParentId($organizationId,m.organization_id) AS organization_id, 
					retrieveOrgSubParentName($organizationId,m.organization_id) name, 
					q.question_group_id, ar.question_id, t.entry_type, AVG(ar.response_index) AS response
				FROM 
					assessment_response ar, assessment a, member m, organization o, question q, question_type t
				WHERE 	
					a.instrument_id=$instrumentId AND a.member_id=m.id AND q.question_type_id=t.id 
					AND m.organization_id IN (SELECT id FROM organization WHERE id IN($orgIds)) 
					AND m.organization_id = o.id
					AND ar.assessment_id=a.id
					AND q.id=ar.question_id
				GROUP BY retrieveOrgSubParentId($organizationId,m.organization_id), name, q.question_group_id, ar.question_id, t.entry_type
				ORDER BY organization_id, name,q.sort_order";
		$dbRecords = $this->dbif->query($sql)->fetchAll();

		$matrix = ['total' => 0, 'count' => 0, 'typeName' => NULL];
		$responses = [];
		$orgNames = [];
		$sections = [];
		$columns = [];
		$typeId = NULL;
		$groupIdx = 0;
		$colIdx = 0;
		$nSections = 0;
		$lastGroupId = NULL;
		$lastOrgId = NULL;
		$row = ['total' => 0, 'count' => 0, 'typeName' => ''];
		if (!empty($dbRecords)) {
			foreach ($dbRecords as $dbRecord) {
				$orgId = $dbRecord["organization_id"];
				$orgNames[$orgId] = $dbRecord["name"];
				$groupId = $dbRecord["question_group_id"];
				$typeId = substr($dbRecord["entry_type"], 0, 1);
				$response = $dbRecord["response"];
				if (empty($responses[$orgId])) {
					if (!empty($lastOrgId)) {
						$this->addMatrixSection($sections[$lastOrgId], $choices, $columns, $responses[$lastOrgId], $typeId, $lastGroupId, $colIdx, $groupIdx);
						$responses[$lastOrgId][] = ['R', $this->avg($row['total'], $row['count']), $row['typeName'], $groupIdx];
					}
					$responses[$orgId] = [];
					$orgNames[$orgId] = '';
					$sections[$orgId] = [];
					$responses[$orgId] = [];
					$groupIdx = 0;
					$lastGroupId = NULL;
					$colIdx = 0;
					$row = ['total' => 0, 'count' => 0, 'typeName' => $typeId];
				}
				if (empty($sections[$orgId][$groupId])) {
					if (!empty($lastGroupId)) {
						$nSections++;
						if (!empty($lastGroupId)) {
							$this->addMatrixSection($sections[$orgId], $choices, $columns, $responses[$orgId], $typeId, $lastGroupId, $colIdx, $groupIdx);
							$colIdx++;
						}
					}
					$sections[$orgId][$groupId] = ['typeName' => $typeId, 'total' => 0, 'count' => 0, 'groupIdx' => $groupIdx - 1];
					$lastGroupId = $groupId;
					$groupIdx++;
				}
				if (empty($columns[$colIdx])) {
					$columns[$colIdx] = ['typeName' => $typeId, 'total' => 0, 'count' => 0];
				}
				$responses[$orgId][] = ['V', (double)number_format($response, 1), $typeId, $groupIdx - 1];

				$matrix['total'] += $response;
				$matrix['count']++;
				$matrix['typeName'] = $this->setType($matrix['typeName'], $typeId);

				$row["total"] += $response;
				$row["count"]++;
				$row['typeName'] = $this->setType($row['typeName'], $typeId);

				$columns[$colIdx]["total"] += $response;
				$columns[$colIdx]["count"]++;
				$columns[$colIdx]["groupIdx"] = $groupIdx;
				$colIdx++;

				$sections[$orgId][$groupId]["total"] += $response;
				$sections[$orgId][$groupId]["count"]++;
				$sections[$orgId][$groupId]['typeName'] = $this->setType($sections[$orgId][$groupId]['typeName'], $typeId);
				$sections[$orgId][$groupId]["groupIdx"] = $groupIdx - 1;

				$lastOrgId = $orgId;
			}
			$this->addMatrixSection($sections[$lastOrgId], $choices, $columns[$lastOrgId], $responses[$lastOrgId], $typeId, $lastGroupId, $colIdx, $groupIdx);
			$responses[$lastOrgId][] = ['R', $this->avg($row['total'], $row['count']), $row['typeName'], $groupIdx];
			foreach ($responses as $orgId => $responseSet) {
				$tableRowValues[] = ['oid' => $orgId, 'n' => $orgNames[$orgId], 'rsp' => $responseSet];
			}

			$columnSummaries = [];
			foreach ($columns as $colIdx => $info) {
				if (empty($columns[$colIdx]["total"])) {
					$columns[$colIdx]["total"] = 0;
					$columns[$colIdx]["count"] = 0;
					$columns[$colIdx]["typeName"] = 'TBD';
					$columns[$colIdx]["groupIdx"] = 0;
				}
				$columnSummaries[] = [
					'C' . @$columns[$colIdx]['t'],
					$this->avg($columns[$colIdx]["total"], $columns[$colIdx]["count"]),
					$columns[$colIdx]["typeName"],
					$columns[$colIdx]["groupIdx"] - 1
				];
			}
			$columnSummaries[] = ['RC', $this->avg($matrix["total"], $matrix["count"]), $matrix["typeName"], $groupIdx];
			$tableRowValues[] = [
				'oid' => -1,
				'n'   => 'Averages',
				'rsp' => $columnSummaries,
			];
		}
		return ['O', $headers, $tableRowValues, $nSections];
	}

	/**
	 * @param int $organizationId
	 * @param int $instrumentId
	 *
	 * @return array
	 */
	public function myMatrix($organizationId, $instrumentId) {
		$orgs = Organization::find(['conditions' => 'parent_id = :id:', 'bind' => ['id' => $organizationId]]);
		$childCount = count($orgs);
		if ($childCount > 0) {
			return $this->buildOrgMatrix($organizationId, $instrumentId);
		}
		else {
			return $this->buildMatrix($organizationId, $instrumentId);
		}
	}
}
