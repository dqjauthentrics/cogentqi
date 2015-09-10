<?php
namespace App;
require_once "Operation.php";
require_once "Instrument.php";
require_once "InstrumentSchedule.php";
use App\Operation;
use App\Instrument;
use App\InstrumentSchedule;

require_once("AssessmentResponse.php");


class Assessment extends Model {
	const STATUS_ACTIVE = 'A';
	const STATUS_LOCKED = 'L';

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

	/**
	 * @param array $jsonRecords
	 */
	private function matrixTable($jsonRecords) {
		?>
		<table style="border:1px solid gray; padding: 1em;">
			<?php
			foreach ($jsonRecords as $rec) {
				?>
				<tr>
					<td><?= $rec["id"] ?></td>
					<td><?= $rec["n"] ?></td>
					<?php
					foreach ($rec["rsp"] as $rsp) {
						?>
						<td class="type<?= @$rsp[0] ?>"><?= @$rsp[0] . ':' . @$rsp[1] . ':' . @$rsp[2] ?></td>
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
	 * Create a new assessment.
	 *
	 * @param int                $assessorId
	 * @param int                $memberId
	 * @param InstrumentSchedule $scheduleItem
	 *
	 * @return null
	 */
	private function create($assessorId, $memberId, $scheduleItem) {
		$db = $this->api->db;
		$assessment = NULL;
		$db->transaction = 'BEGIN';
		try {
			$data = [
				'id'                     => NULL,
				'member_id'              => $memberId,
				'assessor_id'            => $assessorId,
				'instrument_id'          => $scheduleItem["instrument_id"],
				'instrument_schedule_id' => $scheduleItem["id"],
				'edit_status'            => Assessment::STATUS_ACTIVE,
				'view_status'            => Assessment::STATUS_ACTIVE,
			];
			$assessment = $db->assessment()->insert($data);
			if (!empty($assessment)) {
				$responses = Instrument::createResponseTemplate($db, $scheduleItem["instrument_id"], $assessment["id"]);
				if (!empty($responses)) {
					$assessment = $db->assessment()->where("id=?", $assessment["id"])->fetch();
					if (!empty($assessment)) {
						$db->transaction = 'COMMIT';
					}
				}
				else {
					throw new \Exception("Unable to create assessment responses.");
				}
			}
			else {
				throw new \Exception(json_encode($this->api->pdo->errorInfo()));
			}
		}
		catch (\Exception $exception) {
			$db->transaction = 'ROLLBACK';
		}
		return $assessment;
	}

	/**
	 * Fill and return a complete assessment record in JSON form using abbreviated column names to save transmission costs.
	 *
	 * @param $assessment
	 *
	 * @return array
	 */
	private function fill($assessment) {
		$db = $this->api->db;
		$jsonRecords = [
			'id',
			'member'     => [],
			'assessor'   => [],
			'instrument' => '',
			'sections'   => []
		];
		$responses = [];
		if (!empty($assessment)) {
			$jsonRecords = [
				'id'         => (int)$assessment["id"],
				'lm'         => @Model::dateTime($assessment["last_modified"]),
				'ls'         => @Model::dateTime($assessment["last_saved"]),
				'ac'         => @$assessment["assessor_comments"],
				'mc'         => @$assessment["member_comments"],
				'sc'         => @$assessment["score"],
				'rk'         => @$assessment["rank"],
				'es'         => @$assessment["edit_status"],
				'vs'         => @$assessment["view_status"],
				'member'     => [
					'id' => (int)$assessment["member_id"],
					//'av' => $assessment->member["avatar"],
					'fn' => @$assessment->member["first_name"],
					'ln' => @$assessment->member["last_name"],
					'ri' => @$assessment->member["role_id"],
					'jt' => @$assessment->member["job_title"],
					'lv' => @$assessment->member["level"],
					'rl' => @$assessment->member->role["name"]
				],
				'assessor'   => [
					'id' => (int)$assessment["assessor_id"],
					//'av' => $assessment->assessor["avatar"],
					'fn' => @$assessment->assessor["first_name"],
					'ln' => @$assessment->assessor["last_name"],
					'ri' => @$assessment->assessor["role_id"],
					'jt' => @$assessment->assessor["job_title"],
					'lv' => @$assessment->assessor["level"],
					'rl' => @$assessment->assessor->role["name"]
				],
				'instrument' => [
					'id'       => (int)$assessment["instrument_id"],
					'max'      => (int)$assessment->instrument["max_range"],
					'min'      => (int)$assessment->instrument["min_range"],
					'nm'       => @$assessment->instrument["name"],
					'sections' => [
					]
				]
			];
			foreach ($assessment->assessment_response() as $response) {
				$questionId = $response["question_id"];
				$typeId = $response->question->question_type["id"];
				$questionChoice = new QuestionChoice($this->api);
				$choices = $questionChoice->mapList($db->question_choice()->where('question_type_id=?', $typeId)->order('sort_order'));
				$responses[$questionId] = [
					'id' => (int)$response["id"],
					'r'  => $response["response"],
					'ri' => (int)$response["response_index"],
					'ac' => $response["assessor_comments"],
					'mc' => $response["member_comments"],
					'ch' => $choices
				];
			}
			$i = 0;
			$sections = $assessment->instrument->question_group();
			$sectionNames = [];
			foreach ($sections as $section) {
				$sectionNames[] = $section["tag"];
			}
			$nSections = count($sections);
			foreach ($sections as $section) {
				$nextPos = $i < $nSections - 1 ? $i + 1 : 0;
				$prevPos = $i > 0 ? $i - 1 : $nSections - 1;

				$next = ($nextPos + 1) . ". " . $sectionNames[$nextPos];
				$previous = ($prevPos + 1) . ". " . $sectionNames[$prevPos];

				$jsonSection = ['id' => $section["id"], 'number' => ($i + 1), 'name' => $section["tag"], 'next' => $next, 'previous' => $previous, 'questions' => []];
				foreach ($section->question() as $question) {
					$jsonSection['questions'][] = [
						'id'  => $question["id"],
						'nb'  => $question["number"],
						'nm'  => $question["name"],
						'sum' => $question["summary"],
						'dsc' => !empty($question["summary"]) ? $question["summary"] : $question["description"],
						'rsp' => @$responses[$question["id"]],
						'typ' => $question->question_type["entry_type"],
						'mn'  => $question->question_type["min_range"],
						'mx'  => $question->question_type["max_range"],
					];
				}
				$i++;
				$jsonRecords['instrument']['sections'][] = $jsonSection;
			}
		}
		return $jsonRecords;
	}

	/**
	 *
	 */
	public function initializeRoutes() {
		$urlName = $this->urlName();

		/**
		 * Full, single assessment retrieval.  Save time and loading by assembling everything on server for a single request, and by using abbreviated field names.
		 */
		$this->api->get("/$urlName/:assessmentId", function ($assessmentId) use ($urlName) {
			$assessment = $this->api->db->assessment()->where("id=?", $assessmentId)->fetch();
			$jsonRecords = $this->fill($assessment);
			$this->api->sendResult($jsonRecords);
		});

		/**
		 * Create new assessment.
		 */
		$this->api->get("/$urlName/new/:assessorId/:memberId", function ($assessorId, $memberId) use ($urlName) {
			$db = $this->api->db;
			$jsonRecords = NULL;
			$member = $this->api->db->member[$memberId];
			$roleId = $member["role_id"];
			$is = new InstrumentSchedule($this->api);
			$scheduleItem = $is->latest($roleId, Operation::EXECUTE);
			if (!empty($scheduleItem)) {
				$assessment = $this->create($assessorId, $memberId, $scheduleItem);
				$jsonRecords = $this->fill($assessment);
			}
			$this->api->sendResult($jsonRecords);
		});

		/**
		 * Save a single record, which is a full evaluation as returned by the get above.
		 */
		$this->api->post("/$urlName", function () {
			/** @var \NotORM $db */
			$db = $this->api->db;
			$jsonPostData = json_decode(file_get_contents('php://input'));
			$assessment = $jsonPostData->assessment;
			/**
			 * @var \NotORM_Row $assessmentRecord
			 * @var \NotORM_Row $record
			 */
			$assessmentRecord = $db->assessment()->where('id=?', $assessment->id)->fetch();
			if (!empty($assessmentRecord)) {
				$assessmentRecord["score"] = $assessment->sc;
				$assessmentRecord["rank"] = $assessment->rk;
				$assessmentRecord["last_saved"] = $assessmentRecord["last_modified"] = Model::dbDateTme();
				$assessmentRecord["assessor_comments"] = $assessment->ac;
				$assessmentRecord["member_comments"] = $assessment->mc;
				$assessmentRecord["edit_status"] = $assessment->es;
				$assessmentRecord["view_status"] = $assessment->vs;
				$assessmentRecord->update();
				$sections = $assessment->instrument->sections;
				if (!empty($sections)) {
					foreach ($sections as $section) {
						if (!empty($section->questions)) {
							foreach ($section->questions as $question) {
								$record = $db->assessment_response()
									->where('assessment_id=? AND question_id=?', $jsonPostData->assessment->id, $question->id)
									->fetch();
								if (!empty($record)) {
									$record["response_index"] = (int)$question->rsp->ri;
									$record["response"] = !empty($question->rsp) && !empty($question->rsp->r) ? $question->rsp->r : NULL;
									$record["assessor_comments"] = $question->rsp->ac;
									$record["member_comments"] = $question->rsp->mc;
									//secho "SET: " . $question->id . ":" . $record["response_index"] . ":" . $record["response"] . "\n";
									$record->update();
								}
							}
						}
					}
				}
				$this->api->sendResult("saved");
			}
			else {
				$this->api->sendResult("not saved");
			}
		});


		/**
		 * Get all assessments for an organization, ordered by most recent at top.
		 */
		$this->api->get("/$urlName/organization/:orgId", function ($organizationId = NULL) use ($urlName) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->assessment()->where("member_id IN (SELECT id FROM member WHERE organization_id=?)", $organizationId)->order("last_modified DESC");
			foreach ($dbRecords as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});

		/**
		 * Get all assessments for a given member.
		 */
		$this->api->get("/$urlName/member/:memberId", function ($memberId) use ($urlName) {
			$jsonRecords = [];
			foreach ($this->api->db->assessment()->where("member_id=?", $memberId)->order("last_modified DESC") as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});

		/**
		 * Get a matrix of assessment values for all members in an organization.
		 */
		$this->api->get("/$urlName/newmatrix/:memberId/:instrumentId", function ($memberId, $instrumentId) use ($urlName) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->assessment()->select('member_id,max(last_modified) as maxMod')
				->where('instrument_id=? AND member_id IN (SELECT subordinate_id FROM relationship WHERE superior_id=?)', $instrumentId, $memberId)
				->group('member_id');
			$members = [];
			$memberIds = [];
			$columnSummaries = [];
			foreach ($dbRecords as $dbRecord) {
				$member = $dbRecord->member;
				$memberIds[] = $dbRecord["member_id"];
				$members[$dbRecord["member_id"]] = [
					'max' => $dbRecord["maxMod"],
					'fn'  => $member["first_name"],
					'ln'  => $member["last_name"],
					'r'   => $member["role_id"],
					'jt'  => $member["job_title"],
					'em'  => $member["email"],
					'lv'  => $member["level"],
				];
			}
			$memberIds = implode(",", $memberIds);
			$dbRecords = $this->api->db->assessment()->where("instrument_id=? AND member_id IN ($memberIds)", $instrumentId);
			$columns = [];
			$matrix = ['total' => 0, 'count' => 0, 'typeName' => NULL];
			foreach ($dbRecords as $dbRecord) {
				$member = $members[$dbRecord["member_id"]];
				if ($dbRecord["last_modified"] == $member["max"]) {
					$responses = [];
					$memberId = $dbRecord["member_id"];
					$responseRecords = $this->api->db->assessment_response()->where("assessment_id=?", $dbRecord["id"]);
					$sections = [];
					$lastGroupId = NULL;
					$colIdx = 0;
					$row = ['total' => 0, 'count' => 0];
					foreach ($responseRecords as $responseRecord) {
						$groupId = $responseRecord->question["question_group_id"];
						$typeId = substr($responseRecord->question->question_type["entry_type"], 0, 1);
						$response = (int)$responseRecord["response_index"];
						if (empty($sections[$groupId])) {
							if (!empty($lastGroupId)) {
								$sectAvg = $this->avg($sections[$lastGroupId]["total"], $sections[$lastGroupId]["count"]);
								$responses[] = ['S', $sectAvg, $sections[$lastGroupId]["typeName"]];
								if (empty($columns[$colIdx])) {
									$columns[$colIdx] = ['typeName' => $typeId, 'total' => 0, 'count' => 0];
								}
								$columns[$colIdx]["total"] += $sectAvg;
								$columns[$colIdx]["count"]++;
								$columns[$colIdx]["t"] = 'S';
								$colIdx++;
							}
							$sections[$groupId] = ['typeName' => $typeId, 'total' => 0, 'count' => 0];
							$lastGroupId = $groupId;
						}
						if (empty($columns[$colIdx])) {
							$columns[$colIdx] = ['typeName' => $typeId, 'total' => 0, 'count' => 0];
						}
						if (empty($row['typeName'])) {
							$row['typeName'] = $typeId;
						}
						$responses[] = ['V', $response, $typeId];

						$matrix['total'] += $response;
						$matrix['count']++;
						$matrix['typeName'] = $this->setType($matrix['typeName'], $typeId);

						$row["total"] += $response;
						$row["count"]++;
						$row['typeName'] = $this->setType($row['typeName'], $typeId);

						$columns[$colIdx]["total"] += $response;
						$columns[$colIdx]["count"]++;

						$sections[$groupId]["total"] += $response;
						$sections[$groupId]["count"]++;
						$sections[$groupId]['typeName'] = $this->setType($sections[$groupId]['typeName'], $typeId);

						$colIdx++;
					}
					$responses[] = ['R', $this->avg($row['total'], $row['count']), $row['typeName']];
					$jsonRecords[] = [
						'id'  => $memberId,
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
				$columnSummaries[] = [
					'C' . @$columns[$colIdx]['t'],
					$this->avg($columns[$colIdx]["total"], $columns[$colIdx]["count"]),
					$columns[$colIdx]["typeName"]
				];
			}
			$columnSummaries[] = ['RC', $this->avg($matrix["total"], $matrix["count"]), $matrix["typeName"]];
			$jsonRecords[] = [
				'id'  => -1,
				'n'   => 'Averages',
				'rsp' => $columnSummaries,
			];

			if ($this->api->debug) {
				$this->matrixTable($jsonRecords);
			}
			else {
				$this->api->sendResult($jsonRecords);
			}
		});

		/**
		 * Get a matrix of assessment values for all members in an organization.
		 */
		$this->api->get("/$urlName/matrix/:orgId/:instrumentId", function ($organizationId, $instrumentId) use ($urlName) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->assessment()->select('member_id,max(last_modified) as maxMod')
				->where('instrument_id=? AND member_id IN (SELECT id FROM member WHERE organization_id=?)', $instrumentId, $organizationId)
				->group('member_id');
			$members = [];
			foreach ($dbRecords as $dbRecord) {
				$member = $dbRecord->member;
				$members[$dbRecord["member_id"]] = [
					'max' => $dbRecord["maxMod"],
					'fn'  => $member["first_name"],
					'ln'  => $member["last_name"],
					'r'   => $member["role_id"],
					'jt'  => $member["job_title"],
					'em'  => $member["email"],
					'lv'  => $member["level"],
				];
			}

			$dbRecords = $this->api->db->assessment()->where("instrument_id=? AND member_id IN (SELECT id FROM member WHERE organization_id=?)", $instrumentId, $organizationId);
			foreach ($dbRecords as $dbRecord) {
				$member = $members[$dbRecord["member_id"]];
				if ($dbRecord["last_modified"] == $member["max"]) {
					$responses = [];
					$memberId = $dbRecord["member_id"];
					/** @todo These are not sorted by question sortOrder!!! */
					$responseRecords = $this->api->db->assessment_response()->where("assessment_id=?", $dbRecord["id"]);
					foreach ($responseRecords as $responseRecord) {
						$typeId = $responseRecord->question->question_type["entry_type"];
						$responses[] = [(int)$responseRecord["response_index"], $typeId];
					}
					$jsonRecords[] = [
						'memberId'  => $memberId,
						'fn'        => $member['fn'],
						'ln'        => $member['ln'],
						'r'         => $member["r"],
						'jt'        => $member["jt"],
						'lv'        => $member["lv"],
						'responses' => $responses
					];
				}
			}
			$this->api->sendResult($jsonRecords);
		});

		/**
		 * Get a matrix of values for all organizations, calculating average values over their members.
		 */
		$this->api->get("/$urlName/matrix/rollup/:organizationId/:instrumentId", function ($organizationId, $instrumentId) use ($urlName) {
			$jsonRecords = [];
			$instrumentId = (int)$instrumentId;
			$organizationId = (int)$organizationId;

			$row = $this->api->pdo->query("SELECT retrieveOrgDescendantIds($organizationId) AS orgIds")->fetch();
			$orgIds = $row["orgIds"];
			$orgIds = $organizationId . (strlen($orgIds) > 0 ? "," : "") . $orgIds;

			//$row = $this->api->pdo->query("SELECT GROUP_CONCAT(id) FROM organization WHERE parent_id=?", $organizationId)->fetch();
			//$childIds = $row["orgIds"];
			$sql = "SELECT m.organization_id, o.name, ar.question_id, AVG(ar.response_index) AS response
					FROM assessment_response ar, assessment a, member m, organization o, question q
					WHERE a.instrument_id=$instrumentId AND a.member_id=m.id AND
						m.organization_id IN (SELECT id FROM organization WHERE id IN($orgIds)) AND ar.assessment_id=a.id AND m.organization_id=o.id
						AND q.id=ar.question_id
					GROUP BY m.organization_id, o.name, ar.question_id ORDER BY q.sort_order";
			$dbRecords = $this->api->pdo->query($sql);
			$responseSets = [];
			$orgNames = [];
			if (!empty($dbRecords)) {
				foreach ($dbRecords as $dbRecord) {
					$orgId = $dbRecord["organization_id"];
					if (empty($responseSets[$orgId])) {
						$responseSets[$orgId] = [];
						$orgNames[$orgId] = '';
					}
					$responseSets[$orgId][] = (double)number_format($dbRecord["response"], 1);
					$orgNames[$orgId] = $dbRecord["name"];
				}
				foreach ($responseSets as $orgId => $responses) {
					$jsonRecords[] = ['organizationId' => $orgId, 'name' => $orgNames[$orgId], 'responses' => $responses];
				}
			}
			echo json_encode($jsonRecords);
		});

		/**
		 * Progress report for overall organization.
		 */
		$this->api->get("/$urlName/progressbymonth/rollup/:organizationId/:instrumentId", function ($organizationId, $instrumentId) {
			$graphData = ['labels' => [], 'series' => []];
			$row = $this->api->pdo->query("SELECT retrieveOrgDescendantIds($organizationId) AS orgIds")->fetch();
			$orgIds = $row["orgIds"];
			$orgIds = $organizationId . (strlen($orgIds) > 0 ? "," : "") . $orgIds;

			$time = time();
			$thisYr = (int)date("Y", $time);
			$thisMo = (int)date("m", $time);
			$startYr = (int)date("Y", $time);
			$startMo = (int)date("m", $time);

			$seriesNames = ['Modules'];

			/** Get series names for assessments, then outcomes.
			 */
			$aSql = "SELECT qg.id,qg.tag AS name, YEAR(a.last_saved) AS yr, DATE_FORMAT(a.last_saved, '%m') AS mo, AVG(ar.response_index) AS average
				FROM question_group qg, question q, assessment a, assessment_response ar, member m, organization o
				WHERE m.organization_id IN ($orgIds) AND m.organization_id=o.id AND m.id=a.member_id
      				AND qg.instrument_id = $instrumentId AND q.question_group_id = qg.id AND ar.question_id = q.id AND ar.assessment_id=a.id
      				AND a.last_saved >= DATE_SUB(NOW(),INTERVAL 1 YEAR)
				GROUP BY YEAR(a.last_saved), DATE_FORMAT(a.last_saved, '%m'), qg.tag
				ORDER BY qg.sort_order, YEAR(a.last_saved) ASC, DATE_FORMAT(a.last_saved, '%m');";
			$dbRecords = $this->api->pdo->query($aSql);
			if (!empty($dbRecords)) {
				foreach ($dbRecords as $rec) {
					if ((int)$rec["yr"] < $startYr) {
						$startYr = (int)$rec["yr"];
						$startMo = (int)$rec["mo"];
					}
					if ($startYr == (int)$rec["yr"] && (int)$rec["mo"] < $thisMo) {
						$startMo = (int)$rec["mo"];
					}
					if (!in_array($rec["name"], $seriesNames)) {
						$seriesNames[] = $rec["name"];
					}
				}
			}
			$oSql = "SELECT ot.name, YEAR(oo.evaluated) AS yr, DATE_FORMAT(oo.evaluated, '%m') AS mo, AVG(oo.level) AS average
					FROM outcome AS ot, organization_outcome as oo
					WHERE oo.organization_id IN ($orgIds) AND oo.evaluated >= DATE_SUB(NOW(),INTERVAL 1 YEAR) AND ot.id=oo.outcome_id
					GROUP BY ot.name, YEAR(oo.evaluated), DATE_FORMAT(oo.evaluated, '%m'), ot.name
					ORDER BY ot.sort_order, ot.name, YEAR(oo.evaluated), DATE_FORMAT(oo.evaluated, '%m');";
			$dbRecords = $this->api->pdo->query($oSql);
			foreach ($dbRecords as $rec) {
				if ((int)$rec["yr"] < $startYr) {
					$startYr = (int)$rec["yr"];
					$startMo = (int)$rec["mo"];
					if ($startYr == (int)$rec["yr"] && (int)$rec["mo"] < $thisMo) {
						$startMo = (int)$rec["mo"];
					}
				}
				if (!in_array($rec["name"], $seriesNames)) {
					$seriesNames[] = $rec["name"];
				}
			}

			/**
			 * Truncate labels in case data does not go back a full year.
			 */
			$mo = $startMo;
			$done = FALSE;
			for ($yr = $startYr; (!$done && $yr <= $thisYr); $yr++) {
				for ($i = $mo; (!$done && $i <= 12); $i++) {
					if ($yr == $thisYr && $i > $thisMo) {
						$done = TRUE;
					}
					else {
						$graphData['labels'][] = $yr . "-" . sprintf("%02d", $i);
					}
				}
				$mo = 1;
			}


			/** Get modules in first position so the bars lie behind the lines.
			 */
			$sql = "SELECT r.name, YEAR(pi.status_stamp)  AS yr, DATE_FORMAT(pi.status_stamp, '%m') AS mo, COUNT(*) AS cnt
					FROM plan_item pi, module AS md, member AS m, resource r
					WHERE pi.status='C' AND m.organization_id IN ($orgIds) AND pi.status_stamp >= DATE_SUB(NOW(), INTERVAL 1 YEAR) AND md.resource_id=r.id
						 AND m.id=pi.member_id AND pi.module_id=md.id
					GROUP BY YEAR(pi.status_stamp), DATE_FORMAT(pi.status_stamp, '%m')
					ORDER BY YEAR(pi.status_stamp), DATE_FORMAT(pi.status_stamp, '%m');";
			$dbRecords = $this->api->pdo->query($sql);
			if (!empty($dbRecords)) {
				$seriesPos = 0;
				foreach ($dbRecords as $rec) {
					$yrMo = $rec["yr"] . '-' . $rec["mo"];
					$dataPos = array_search($yrMo, $graphData["labels"]);
					if ($dataPos !== FALSE) {
						if (empty($graphData['series'][$seriesPos])) {
							$graphData['series'][$seriesPos] = [
								'type'     => 'column',
								'name'     => 'Modules',
								'class'    => 'modules',
								"grouping" => 2,
								'yAxis'    => 1,
								'marker'   => ['symbol' => 'url(/img/badge32.png)'],
								'data'     => array_fill(0, count($graphData["labels"]), NULL),
								'color'    => '#CCC',
								'visible'  => TRUE,
								'opacity'  => 0.5,
								'tooltip'  => [
									'formatter' => "function () {return 'HELLO';}"
								]
							];
						}
						$graphData['series'][$seriesPos]['data'][$dataPos] = ['y' => (double)$rec["cnt"], 'text' => (number_format($rec["cnt"], 0) . ' Modules Completed')];
					}
				}
			}

			/**
			 * Append multiple assessment series.
			 */
			$dbRecords = $this->api->pdo->query($aSql);
			if (!empty($dbRecords)) {
				foreach ($dbRecords as $rec) {
					$yrMo = $rec["yr"] . '-' . $rec["mo"];
					$seriesPos = array_search($rec["name"], $seriesNames);
					$dataPos = array_search($yrMo, $graphData["labels"]);
					if ($seriesPos !== FALSE && $dataPos !== FALSE) {
						$seriesPos = (int)$seriesPos;
						if (empty($graphData['series'][$seriesPos])) {
							$graphData['series'][$seriesPos] = [
								'yAxis'    => 0,
								"class"    => 'assessments',
								"grouping" => 0,
								'name'     => $seriesNames[$seriesPos],
								'visible'  => TRUE,
								'data'     => array_fill(0, count($graphData["labels"]), NULL),
							];
						}
						$graphData['series'][$seriesPos]['data'][$dataPos] = (double)number_format($rec["average"], 2);
					}
				}
			}

			/**
			 * Append multiple outcomes.
			 */
			$dbRecords = $this->api->pdo->query($oSql);
			if (!empty($dbRecords)) {
				foreach ($dbRecords as $rec) {
					$yrMo = $rec["yr"] . '-' . $rec["mo"];
					$seriesPos = array_search($rec["name"], $seriesNames);
					$dataPos = array_search($yrMo, $graphData["labels"]);
					if ($seriesPos !== FALSE && $dataPos !== FALSE) {
						$seriesPos = (int)$seriesPos;
						if (empty($graphData['series'][$seriesPos])) {
							$graphData['series'][$seriesPos] = [
								'name'     => $rec["name"],
								'yAxis'    => 0,
								'class'    => 'outcomes',
								"grouping" => 1,
								'visible'  => FALSE,
								'data'     => array_fill(0, count($graphData["labels"]), NULL),
							];
						}
						$graphData['series'][$seriesPos]['data'][$dataPos] = (double)number_format($rec["average"], 2);
					}
				}
			}

			/**
			 * Append the single overall outcomes series.
			 */
			$sql = "SELECT YEAR(oo.evaluated) AS yr, DATE_FORMAT(oo.evaluated, '%m') AS mo, AVG(oo.level) AS average
					FROM outcome AS ot, organization_outcome as oo
					WHERE oo.organization_id IN ($orgIds) AND oo.evaluated >= DATE_SUB(NOW(),INTERVAL 1 YEAR)
					GROUP BY YEAR(oo.evaluated), DATE_FORMAT(oo.evaluated, '%m')
					ORDER BY YEAR(oo.evaluated), DATE_FORMAT(oo.evaluated, '%m');";
			$dbRecords = $this->api->pdo->query($sql);
			if (!empty($dbRecords)) {
				$seriesPos = count($seriesNames);
				$seriesPos = (int)$seriesPos;
				foreach ($dbRecords as $rec) {
					$yrMo = $rec["yr"] . '-' . $rec["mo"];
					$dataPos = array_search($yrMo, $graphData["labels"]);
					if ($dataPos !== FALSE) {
						if (empty($graphData['series'][$seriesPos])) {
							$graphData['series'][$seriesPos] = [
								'yAxis'     => 0,
								'name'      => 'Outcomes',
								'lineWidth' => 4,
								'class'     => 'outcomes_overall',
								"grouping"  => 0,
								'visible'   => TRUE,
								'lineColor' => 'red',
								'color'     => 'red',
								'marker'    => ['radius' => 8],
								'data'      => array_fill(0, count($graphData["labels"]), NULL),
							];
						}
						$graphData['series'][$seriesPos]['data'][$dataPos] = (double)number_format($rec["average"], 2);
					}
				}
			}
			//var_dump($graphData["labels"]);
			echo json_encode($graphData);
		});


		/**
		 * Single member progress report.
		 */
		$this->api->get("/$urlName/progressbymonth/single/:memberId", function ($memberId) {
			$graphData = ['labels' => [], 'series' => []];
			$time = time();
			$thisYr = (int)date("Y", $time);
			$thisMo = (int)date("m", $time);
			$startYr = (int)date("Y", $time);
			$startMo = (int)date("m", $time);

			$seriesNames = ['Modules'];

			/** Get series names for assessments, then outcomes.
			 */
			$aSql = "SELECT qg.id,qg.tag AS name, YEAR(a.last_saved) AS yr, DATE_FORMAT(a.last_saved, '%m') AS mo, AVG(ar.response_index) AS average
				FROM question_group qg, question q, assessment a, assessment_response ar, member m, organization o
				WHERE m.id=$memberId AND m.id=a.member_id
      				AND q.question_group_id = qg.id AND ar.question_id = q.id AND ar.assessment_id=a.id
      				AND a.last_saved >= DATE_SUB(NOW(),INTERVAL 1 YEAR)
				GROUP BY YEAR(a.last_saved), DATE_FORMAT(a.last_saved, '%m'), qg.tag
				ORDER BY qg.sort_order, YEAR(a.last_saved) ASC, DATE_FORMAT(a.last_saved, '%m');";
			$dbRecords = $this->api->pdo->query($aSql);
			if (!empty($dbRecords)) {
				foreach ($dbRecords as $rec) {
					if ((int)$rec["yr"] < $startYr) {
						$startYr = (int)$rec["yr"];
						$startMo = (int)$rec["mo"];
					}
					if ($startYr == (int)$rec["yr"] && (int)$rec["mo"] < $thisMo) {
						$startMo = (int)$rec["mo"];
					}
					if (!in_array($rec["name"], $seriesNames)) {
						$seriesNames[] = $rec["name"];
					}
				}
			}
			$oSql = "SELECT ot.name, YEAR(oo.evaluated) AS yr, DATE_FORMAT(oo.evaluated, '%m') AS mo, AVG(oo.level) AS average
					FROM outcome AS ot, organization_outcome as oo
					WHERE oo.organization_id IN (SELECT organization_id FROM member WHERE id=$memberId) AND oo.evaluated >= DATE_SUB(NOW(),INTERVAL 1 YEAR) AND ot.id=oo.outcome_id
					GROUP BY ot.name, YEAR(oo.evaluated), DATE_FORMAT(oo.evaluated, '%m'), ot.name
					ORDER BY ot.sort_order, ot.name, YEAR(oo.evaluated), DATE_FORMAT(oo.evaluated, '%m');";
			$dbRecords = $this->api->pdo->query($oSql);
			foreach ($dbRecords as $rec) {
				if ((int)$rec["yr"] < $startYr) {
					$startYr = (int)$rec["yr"];
					$startMo = (int)$rec["mo"];
					if ($startYr == (int)$rec["yr"] && (int)$rec["mo"] < $thisMo) {
						$startMo = (int)$rec["mo"];
					}
				}
				if (!in_array($rec["name"], $seriesNames)) {
					$seriesNames[] = $rec["name"];
				}
			}

			/**
			 * Truncate labels in case data does not go back a full year.
			 */
			$mo = $startMo;
			$done = FALSE;
			for ($yr = $startYr; (!$done && $yr <= $thisYr); $yr++) {
				for ($i = $mo; (!$done && $i <= 12); $i++) {
					if ($yr == $thisYr && $i > $thisMo) {
						$done = TRUE;
					}
					else {
						$graphData['labels'][] = $yr . "-" . sprintf("%02d", $i);
					}
				}
				$mo = 1;
			}


			/** Get modules in first position so the bars lie behind the lines.
			 */
			$sql = "SELECT r.name, YEAR(pi.status_stamp)  AS yr, DATE_FORMAT(pi.status_stamp, '%m') AS mo, COUNT(*) AS cnt
					FROM plan_item pi, module AS md, resource r
					WHERE pi.status='C' AND pi.member_id=$memberId AND pi.status_stamp >= DATE_SUB(NOW(), INTERVAL 1 YEAR) AND md.resource_id=r.id
						AND pi.module_id=md.id
					GROUP BY YEAR(pi.status_stamp), DATE_FORMAT(pi.status_stamp, '%m')
					ORDER BY YEAR(pi.status_stamp), DATE_FORMAT(pi.status_stamp, '%m');";
			$dbRecords = $this->api->pdo->query($sql);
			if (!empty($dbRecords)) {
				$seriesPos = 0;
				foreach ($dbRecords as $rec) {
					$yrMo = $rec["yr"] . '-' . $rec["mo"];
					$dataPos = array_search($yrMo, $graphData["labels"]);
					if ($dataPos !== FALSE) {
						if (empty($graphData['series'][$seriesPos])) {
							$graphData['series'][$seriesPos] = [
								'type'     => 'column',
								'name'     => 'Modules',
								'class'    => 'modules',
								"grouping" => 2,
								'yAxis'    => 1,
								'marker'   => ['symbol' => 'url(/img/badge32.png)'],
								'data'     => array_fill(0, count($graphData["labels"]), NULL),
								'color'    => '#CCC',
								'visible'  => TRUE,
								'opacity'  => 0.5,
								'tooltip'  => [
									'formatter' => "function () {return 'HELLO';}"
								]
							];
						}
						$graphData['series'][$seriesPos]['data'][$dataPos] = ['y' => (double)$rec["cnt"], 'text' => $rec["name"]];
					}
				}
			}

			/**
			 * Append multiple assessment series.
			 */
			$dbRecords = $this->api->pdo->query($aSql);
			if (!empty($dbRecords)) {
				foreach ($dbRecords as $rec) {
					$yrMo = $rec["yr"] . '-' . $rec["mo"];
					$seriesPos = array_search($rec["name"], $seriesNames);
					$dataPos = array_search($yrMo, $graphData["labels"]);
					if ($seriesPos !== FALSE && $dataPos !== FALSE) {
						$seriesPos = (int)$seriesPos;
						if (empty($graphData['series'][$seriesPos])) {
							$graphData['series'][$seriesPos] = [
								'yAxis'    => 0,
								"class"    => 'assessments',
								"grouping" => 0,
								'name'     => $seriesNames[$seriesPos],
								'visible'  => TRUE,
								'data'     => array_fill(0, count($graphData["labels"]), NULL),
							];
						}
						$graphData['series'][$seriesPos]['data'][$dataPos] = (double)number_format($rec["average"], 2);
					}
				}
			}

			/**
			 * Append multiple outcomes.
			 */
			$dbRecords = $this->api->pdo->query($oSql);
			if (!empty($dbRecords)) {
				foreach ($dbRecords as $rec) {
					$yrMo = $rec["yr"] . '-' . $rec["mo"];
					$seriesPos = array_search($rec["name"], $seriesNames);
					$dataPos = array_search($yrMo, $graphData["labels"]);
					if ($seriesPos !== FALSE && $dataPos !== FALSE) {
						$seriesPos = (int)$seriesPos;
						if (empty($graphData['series'][$seriesPos])) {
							$graphData['series'][$seriesPos] = [
								'name'     => $rec["name"],
								'yAxis'    => 0,
								'class'    => 'outcomes',
								"grouping" => 1,
								'visible'  => FALSE,
								'data'     => array_fill(0, count($graphData["labels"]), NULL),
							];
						}
						$graphData['series'][$seriesPos]['data'][$dataPos] = (double)number_format($rec["average"], 2);
					}
				}
			}

			/**
			 * Append the single overall outcomes series.
			 */
			$sql = "SELECT YEAR(oo.evaluated) AS yr, DATE_FORMAT(oo.evaluated, '%m') AS mo, AVG(oo.level) AS average
					FROM outcome AS ot, organization_outcome as oo
					WHERE oo.organization_id IN (SELECT organization_id FROM member WHERE id=$memberId) AND oo.evaluated >= DATE_SUB(NOW(),INTERVAL 1 YEAR)
					GROUP BY YEAR(oo.evaluated), DATE_FORMAT(oo.evaluated, '%m')
					ORDER BY YEAR(oo.evaluated), DATE_FORMAT(oo.evaluated, '%m');";
			$dbRecords = $this->api->pdo->query($sql);
			if (!empty($dbRecords)) {
				$seriesPos = count($seriesNames);
				$seriesPos = (int)$seriesPos;
				foreach ($dbRecords as $rec) {
					$yrMo = $rec["yr"] . '-' . $rec["mo"];
					$dataPos = array_search($yrMo, $graphData["labels"]);
					if ($dataPos !== FALSE) {
						if (empty($graphData['series'][$seriesPos])) {
							$graphData['series'][$seriesPos] = [
								'yAxis'     => 0,
								'name'      => 'Outcomes',
								'lineWidth' => 4,
								'class'     => 'outcomes_overall',
								"grouping"  => 0,
								'visible'   => TRUE,
								'lineColor' => 'red',
								'color'     => 'red',
								'marker'    => ['radius' => 8],
								'data'      => array_fill(0, count($graphData["labels"]), NULL),
							];
						}
						$graphData['series'][$seriesPos]['data'][$dataPos] = (double)number_format($rec["average"], 2);
					}
				}
			}
			//var_dump($graphData["labels"]);
			echo json_encode($graphData);
		});
	}


	/**
	 * Override base method to indicate which columns are date/time.
	 */
	public
	function initialize() {
		$this->dateTimeCols = ['last_saved', 'last_modified'];
		parent::initialize();
	}

	/**
	 * @todo This may/should be superfluous now.
	 *
	 * @param array $assessment
	 *
	 * @return array
	 */
	public
	function map($assessment) {
		$associative = [
			'id'       => (int)$assessment["id"],
			'lm'       => Model::dateTime($assessment["last_modified"]),
			'ls'       => Model::dateTime($assessment["last_saved"]),
			'ac'       => $assessment["assessor_comments"],
			'mc'       => $assessment["member_comments"],
			'sc'       => (double)$assessment["score"],
			'rk'       => (int)$assessment["rank"],
			'es'       => $assessment["edit_status"],
			'vs'       => $assessment["view_status"],
			'ii'       => (int)$assessment["instrument_id"],
			'member'   => [
				'id' => (int)$assessment["member_id"],
				'fn' => $assessment->member["first_name"],
				'ln' => $assessment->member["last_name"],
				'ri' => $assessment->member["role_id"],
				'jt' => $assessment->member["job_title"],
				'rl' => @$assessment->member->role["name"]
			],
			'assessor' => [
				'id' => (int)$assessment["assessor_id"],
				'fn' => $assessment->assessor["first_name"],
				'ln' => $assessment->assessor["last_name"],
				'ri' => $assessment->assessor["role_id"],
				'jt' => $assessment->assessor["job_title"],
				'lv' => $assessment->assessor["level"],
				'rl' => @$assessment->assessor->role["name"]
			],
		];

		$total = 0;
		$nItems = 0;
		$responses = [];
		$records = $this->api->db->assessment_response()->where("assessment_id=?", $assessment["id"]);
		foreach ($records as $record) {
			if ($record["response"] > 0) {
				$nItems++;
				$total += (int)$record["response"];
			}
			$responses[] = [
				'id' => $record["id"],
				'qi' => $record["question_id"],
				'r'  => $record["response"],
				'ri' => $record["response_index"],
				'ec' => $record["assessor_comments"],
				'mc' => $record["member_comments"]
			];
		}
		if (!strstr($_SERVER["REQUEST_URI"], "/organization")) {
			if (empty($this->mapExcludes) || !in_array("responses", $this->mapExcludes)) {
				$associative["responses"] = $responses;
			}
		}
		$associative["sc"] = ($total > 0 && $nItems > 0 ? number_format($total / $nItems, 1) : 0);
		$associative["sr"] = round($associative["sc"]);
		return $associative;
	}
}