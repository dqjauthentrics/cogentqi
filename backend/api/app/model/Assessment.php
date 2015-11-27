<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Model;

use App\Components\AjaxException;
use App\Components\DbContext;
use Nette\Database\Table\IRow;
use ResourcesModule\BasePresenter;

class Assessment extends BaseModel {
	const STATUS_ACTIVE = 'A';
	const STATUS_LOCKED = 'L';

	public static $mappedColumns = [
		'id'                     => DbContext::TYPE_INT,
		'instrument_id'          => DbContext::TYPE_INT,
		'assessor_id'            => DbContext::TYPE_INT,
		'last_saved'             => DbContext::TYPE_DATETIME,
		'last_modified'          => DbContext::TYPE_DATETIME,
		'assessor_comments'      => DbContext::TYPE_STRING,
		'member_comments'        => DbContext::TYPE_STRING,
		'score'                  => DbContext::TYPE_REAL,
		'rank'                   => DbContext::TYPE_INT,
		'edit_status'            => DbContext::TYPE_STRING,
		'view_status'            => DbContext::TYPE_STRING,
		'instrument_schedule_id' => DbContext::TYPE_INT,
	];

	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $assessment
	 * @param int                        $mode
	 *
	 * @return array
	 */
	public static function map($database, $assessment, $mode = BasePresenter::MODE_LISTING) {
		$map = [];
		if (!empty($assessment)) {
			switch ($mode) {
				case BasePresenter::MODE_LISTING:
					$map = parent::mapColumns($database, $assessment, self::$mappedColumns);
					$instrument = $assessment->ref('instrument');
					$schedule = $assessment->ref('instrument_schedule');
					$map['instrument'] = $database->map($instrument);
					$map['schedule'] = $database->map($schedule);
					break;
				default:
					$map = self::full($database, $assessment);
			}
			$map['typ'] = @$assessment->ref('instrument')->question_type["name"];
			$member = $assessment->ref('member');
			$map['member'] = $database->map($member);
			$map["member"]["lastAssessment"] = Member::mapLastAssessment($database, $member, $mode);
			$role = $assessment->ref('member')->ref('app_role');
			$map["member"]['role'] = $role["name"];
			$map["member"]['rn'] = $role["name"];
			$map["member"]['ari'] = $role["app_role_id"];
			$assessor = $assessment->ref('member', 'assessor_id');
			$map['assessor'] = $database->map($assessor);
			$role = $assessor->ref('app_role');
			$map["assessor"]['role'] = $role["name"];
			$map["assessor"]['rn'] = $role["name"];
			$map["assessor"]['ari'] = $role["app_role_id"];
		}
		return $map;
	}

	/**
	 * Fill and return a complete assessment record in JSON form using abbreviated column names to save transmission costs.
	 *
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $assessment
	 *
	 * @return array
	 */
	private static function full($database, $assessment) {
		$map = parent::mapColumns($database, $assessment, self::$mappedColumns);
		$responses = [];
		if (!empty($assessment)) {
			/** @var IRow $instrument */
			$instrument = $assessment->ref('instrument');
			$schedule = $assessment->ref('instrument_schedule');
			$map['instrument'] = $database->map($instrument);
			$map['schedule'] = $database->map($schedule);
			$jsonResponses = [];
			$responses = $database->table('assessment_response')->where('assessment_id=?', $assessment["id"]); //@todo ORDER!
			foreach ($responses as $response) {
				$questionId = $response["question_id"];
				$typeId = $response->question->question_type["id"];
				$choiceRecords = $database->table('question_choice')->where('question_type_id=?', $typeId)->order('sort_order');
				/** @var IRow[] $choices */
				$choices = $database->mapRecords($choiceRecords);
				$jsonResponses[$questionId] = [
					'id'  => (int)$response["id"],
					'rp'  => $response["response"],
					'rdx' => (int)$response["response_index"],
					'ac'  => $response["assessor_comments"],
					'mc'  => $response["member_comments"],
					'ch'  => $choices
				];
				$rec = $jsonResponses[$questionId];
				$rec["qi"] = (int)$response["question_id"];
				$map["responses"][] = $rec;
			}
			$i = 0;
			$sections = $instrument->related('question_group');
			$sectionNames = [];
			foreach ($sections as $section) {
				$sectionNames[] = $section["tag"];
			}
			$nSections = count($sections);
			/** @var IRow $section */
			foreach ($sections as $section) {
				$nextPos = $i < $nSections - 1 ? $i + 1 : 0;
				$prevPos = $i > 0 ? $i - 1 : $nSections - 1;

				$next = ($nextPos + 1) . ". " . $sectionNames[$nextPos];
				$previous = ($prevPos + 1) . ". " . $sectionNames[$prevPos];

				$jsonSection = ['id' => $section["id"], 'nmb' => ($i + 1), 'n' => $section["tag"], 'nxt' => $next, 'prv' => $previous, 'questions' => []];
				$questions = $database->table('question')->where('question_group_id=?', $section["id"])->order('sort_order ASC');
				foreach ($questions as $question) {
					$jsonSection['questions'][] = [
						'id'  => $question["id"],
						'nmb' => $question["number"],
						'n'   => $question["name"],
						'sum' => $question["summary"],
						'dsc' => $question["description"],
						'rsp' => @$jsonResponses[$question["id"]],
						'typ' => $question->question_type["entry_type"],
						'min' => $question->question_type["min_range"],
						'max' => $question->question_type["max_range"],
					];
				}
				$i++;
				$map['instrument']['sections'][] = $jsonSection;
			}
		}
		return $map;
	}

	/**
	 * Create a new assessment.
	 *
	 * @param \App\Components\DbContext $database
	 * @param int                       $assessorId
	 * @param int                       $memberId
	 *
	 * @return null
	 */
	public static function create($database, $assessorId, $memberId) {
		$assessment = NULL;
		$database->beginTransaction();
		try {
			$member = $database->table('member')->get($memberId);
			$scheduleItem = InstrumentSchedule::latest($database, $member["role_id"], BasePresenter::EXECUTE);
			if (empty($scheduleItem)) {
				throw new AjaxException(AjaxException::ERROR_FATAL, "No valid schedule for which to create assessment.");
			}
			$data = [
				'id'                     => NULL,
				'member_id'              => $memberId,
				'assessor_id'            => $assessorId,
				'instrument_id'          => $scheduleItem["instrument_id"],
				'instrument_schedule_id' => $scheduleItem["id"],
				'edit_status'            => Assessment::STATUS_ACTIVE,
				'view_status'            => Assessment::STATUS_ACTIVE,
			];
			$assessment = $database->table('assessment')->insert($data);
			if (!empty($assessment)) {
				$responses = Instrument::createResponseTemplate($database, $scheduleItem["instrument_id"], $assessment["id"]);
				if (!empty($responses)) {
					$assessment = $database->table('assessment')->where("id=?", $assessment["id"])->fetch();
					if (!empty($assessment)) {
						$database->commit();
						$assessment = Assessment::map($database, $assessment, BasePresenter::MODE_RELATED);
						Recommendation::recommend($database, $assessment["id"]);
					}
				}
				else {
					throw new \Exception("Unable to create assessment responses.");
				}
			}
			else {
				throw new \Exception(json_encode($database->pdo->errorInfo()));
			}
		}
		catch (\Exception $exception) {
			$database->rollBack();
		}
		return $assessment;
	}

	/**
	 * @param \PDO $pdo
	 * @param int  $organizationId
	 * @param int  $instrumentId
	 *
	 * @return array
	 */
	public static function progressByMonthOrganization($pdo, $organizationId, $instrumentId) {
		$graphData = ['labels' => [], 'series' => [[], [], [], [], [], [], [], [], [], [], [], [], []]];
		$row = $pdo->query("SELECT retrieveOrgDescendantIds($organizationId) AS orgIds")->fetch();
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
		$dbRecords = $pdo->query($aSql);
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
		$dbRecords = $pdo->query($oSql);
		$idx = 0;
		foreach ($dbRecords as $rec) {
			if ($idx == 0) {
				if ((int)$rec["yr"] < $startYr) {
					$startYr = (int)$rec["yr"];
					$startMo = (int)$rec["mo"];
				}
				if ($startYr == (int)$rec["yr"] && (int)$rec["mo"] < $thisMo) {
					$startMo = (int)$rec["mo"];
				}
			}
			$idx++;
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
					WHERE pi.plan_item_status_id='C' AND m.organization_id IN ($orgIds) AND pi.status_stamp >= DATE_SUB(NOW(), INTERVAL 1 YEAR) AND md.resource_id=r.id
						 AND m.id=pi.member_id AND pi.module_id=md.id
					GROUP BY YEAR(pi.status_stamp), DATE_FORMAT(pi.status_stamp, '%m')
					ORDER BY YEAR(pi.status_stamp), DATE_FORMAT(pi.status_stamp, '%m');";
		$dbRecords = $pdo->query($sql);
		if (!empty($dbRecords)) {
			$seriesPos = 0;
			foreach ($dbRecords as $rec) {
				$yrMo = $rec["yr"] . '-' . $rec["mo"];
				$dataPos = array_search($yrMo, $graphData["labels"]);
				if ($dataPos !== FALSE) {
					if (empty($graphData['series'][$seriesPos])) {
						$graphData['series'] = [];
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
		$dbRecords = $pdo->query($aSql);
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
		$dbRecords = $pdo->query($oSql);
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
		$dbRecords = $pdo->query($sql);
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
		return $graphData;
	}

	/**
	 * @param \PDO $pdo
	 * @param int  $memberId
	 *
	 * @return array
	 */
	public static function progressByMonthIndividual($pdo, $memberId) {
		$graphData = ['labels' => [], 'series' => [[], [], [], [], [], [], [], [], [], [], [], [], []]];
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
		$dbRecords = $pdo->query($aSql);
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
		$dbRecords = $pdo->query($oSql);
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
					WHERE pi.plan_item_status_id='C' AND pi.member_id=$memberId AND pi.status_stamp >= DATE_SUB(NOW(), INTERVAL 1 YEAR) AND md.resource_id=r.id
						AND pi.module_id=md.id
					GROUP BY YEAR(pi.status_stamp), DATE_FORMAT(pi.status_stamp, '%m')
					ORDER BY YEAR(pi.status_stamp), DATE_FORMAT(pi.status_stamp, '%m');";
		$dbRecords = $pdo->query($sql);
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
		$dbRecords = $pdo->query($aSql);
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
		$dbRecords = $pdo->query($oSql);
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
		$dbRecords = $pdo->query($sql);
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
		return $graphData;
	}
}
