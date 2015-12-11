<?php
namespace Cogent\Models;

use Cogent\Components\Result;
use Cogent\Components\Utility;
use Cogent\Controllers\ControllerBase;

/**
 * Class Assessment
 * @package Cogent\Models
 *
 * @method Instrument getInstrument()
 * @method Member getAssessee()
 * @method Member getAssessor()
 * @method \Phalcon\Mvc\Model\Resultset\Simple|AssessmentResponse[] getResponses()
 * @method InstrumentSchedule getSchedule()
 *
 * @property \Phalcon\Mvc\Model\Resultset\Simple|AssessmentResponse[] $responses
 * @property Member                                                   $assessor
 * @property Member                                                   $assessee
 * @property Instrument                                               $instrument
 * @property InstrumentSchedule                                       $schedule
 */
class Assessment extends CogentModel {
	const STATUS_ACTIVE = 'A';
	const STATUS_LOCKED = 'L';

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $instrument_id;

	/**
	 *
	 * @var integer
	 */
	public $member_id;

	/**
	 *
	 * @var integer
	 */
	public $assessor_id;

	/**
	 *
	 * @var string
	 */
	public $last_saved;

	/**
	 *
	 * @var string
	 */
	public $last_modified;

	/**
	 *
	 * @var string
	 */
	public $assessor_comments;

	/**
	 *
	 * @var string
	 */
	public $member_comments;

	/**
	 *
	 * @var string
	 */
	public $score;

	/**
	 *
	 * @var integer
	 */
	public $rank;

	/**
	 *
	 * @var string
	 */
	public $edit_status;

	/**
	 *
	 * @var string
	 */
	public $view_status;

	/**
	 *
	 * @var integer
	 */
	public $instrument_schedule_id;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Assessment[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Assessment
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Cogent\Models\AssessmentResponse', 'assessment_id', ['alias' => 'Responses']);
		$this->hasMany('id', 'Cogent\Models\Recommendation', 'assessment_id', ['alias' => 'Recommendation']);
		$this->belongsTo('member_id', 'Cogent\Models\Member', 'id', ['alias' => 'Assessee']);
		$this->belongsTo('assessor_id', 'Cogent\Models\Member', 'id', ['alias' => 'Assessor']);
		$this->belongsTo('instrument_id', 'Cogent\Models\Instrument', 'id', ['alias' => 'Instrument']);
		$this->belongsTo('instrument_schedule_id', 'Cogent\Models\InstrumentSchedule', 'id', ['alias' => 'Schedule']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'assessment';
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = ['instrument' => FALSE, 'schedule' => FALSE, 'responses' => FALSE, 'verbose' => FALSE]) {
		$map = parent::map();
		if (empty($options['verbose'])) {
			$map = Utility::arrayRemoveByKey("ac", $map);
			$map = Utility::arrayRemoveByKey("mc", $map);
		}
		if (!empty($options['instrument'])) {
			$map['instrument'] = $this->instrument->map(['questions' => FALSE]);
		}
		if (!empty($options['schedule'])) {
			$schedule = $this->getInstrument()->getSchedule();
			if (!empty($schedule)) {
				$map['schedule'] = [];
				foreach ($schedule as $item) {
					/** @var InstrumentSchedule $item */
					$map['schedule'][] = $item->map();
				}
			}
		}
		$map['responses'] = [];
		if (!empty($options['responses'])) {
			foreach ($this->responses as $response) {
				$map['responses'][$response->question_id] = $response->map();
			}
		}
		$map['typ'] = $this->getInstrument()->getQuestionType()->name;
		$map['member'] = $this->getAssessee()->map(['minimal' => TRUE]);
		$map['assessor'] = $this->getAssessor()->map(['minimal' => TRUE]);
		return $map;
	}

	/**
	 * @param ControllerBase $controller
	 * @param array          $formAssessment
	 *
	 * @return \Cogent\Components\Result
	 */
	public static function saveExisting($controller, $formAssessment) {
		$result = new Result($controller);
		$transacted = FALSE;
		try {
			if (!empty($formAssessment)) {
				$assessment = Assessment::findFirst($formAssessment["id"]);
				if (!empty($dbAssessment)) {
					$controller->beginTransaction($assessment);
					$transacted = TRUE;
					$saveDateTime = $assessment->dateTme();
					$simpleRec = [
						"member_id"         => $formAssessment["member"]["id"],
						"score"             => $formAssessment["sc"],
						"rank"              => $formAssessment["rk"],
						"last_saved"        => $saveDateTime,
						"last_modified"     => $saveDateTime,
						"assessor_comments" => $formAssessment["ac"],
						"member_comments"   => $formAssessment["mc"],
						"edit_status"       => $formAssessment["es"],
						"view_status"       => $formAssessment["vs"]
					];
					$assessment->update($simpleRec);
					$formSections = $formAssessment['instrument']['sections'];
					if (!empty($formSections)) {
						foreach ($formSections as $formSection) {
							$formQuestions = $formSection['questions'];
							if (!empty($formQuestions)) {
								foreach ($formQuestions as $formQuestion) {
									$formResponse = $formQuestion["rsp"];
									$response = AssessmentResponse::query()->where('id=' . $formResponse['id']);
									/** @var AssessmentResponse $response */
									if (!empty($response)) {
										$responseUpdater = [
											"response_index"    => (int)$formResponse["rdx"],
											"response"          => !empty($formResponse["rp"]) ? $formResponse["rp"] : NULL,
											"assessor_comments" => $formResponse["ac"],
											"member_comments"   => $formResponse["mc"]
										];
										$response->update($responseUpdater);
									}
								}
							}
						}
					}
				}
				Recommendation::createRecommendationsForAssessment($assessment->id);
				$controller->commitTransaction();
				$result->setNormal();
			}
			else {
				$result->setError();
			}
		}
		catch (\Exception $exception) {
			if ($transacted) {
				$controller->rollbackTransaction();
			}
			$result->setException($exception);
		}
		return $result;
	}

	/**
	 * Create a new assessment.
	 *
	 * @param ControllerBase $controller
	 * @param int            $assessorId
	 * @param int            $memberId
	 *
	 * @return Result
	 */
	public static function createNew($controller, $assessorId, $memberId) {
		$result = new Result();
		$assessment = new Assessment();
		$controller->beginTransaction($assessment);
		try {
			$member = Member::findFirst($memberId);
			$scheduleItem = InstrumentSchedule::latest($member->role_id, InstrumentScheduleOperation::OP_EXEXUTE);
			if (empty($scheduleItem)) {
				throw new \Exception("No valid schedule for which to create assessment.");
			}
			$assessmentInfo = [
				'id'                     => NULL,
				'member_id'              => $memberId,
				'assessor_id'            => $assessorId,
				'instrument_id'          => $scheduleItem["instrument_id"],
				'instrument_schedule_id' => $scheduleItem["id"],
				'edit_status'            => self::STATUS_ACTIVE,
				'view_status'            => self::STATUS_ACTIVE,
			];
			$assessment->update($assessmentInfo);
			$responses = Instrument::createResponseTemplate($scheduleItem->instrument_id, $assessment->id);
			if (!empty($responses)) {
				//@todo GREG Recommendation::recommend($assessment["id"]);
			}
			else {
				throw new \Exception("Unable to create assessment responses.");
			}
			$result->setNormal($assessment);
			$controller->commitTransaction();
		}
		catch (\Exception $exception) {
			$controller->rollbackTransaction();
		}
		return $result;
	}

	/**
	 * @param int $organizationId
	 * @param int $instrumentId
	 *
	 * @return Result
	 */
	public function organizationProgressByMonth($organizationId, $instrumentId) {
		$result = new Result();
		$orgModel = new Organization();
		$graphData = ['labels' => [], 'series' => [[], [], [], [], [], [], [], [], [], [], [], [], []]];
		$orgIds = $orgModel->getDescendantIds($organizationId);

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
		$dbRecords = $this->getDBIF()->query($aSql)->fetchAll();
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
		$dbRecords = $this->getDBIF()->query($oSql)->fetchAll();
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
		$dbRecords = $this->getDBIF()->query($sql)->fetchAll();
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
		$dbRecords = $this->getDBIF()->query($aSql);
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
		$dbRecords = $this->getDBIF()->query($oSql)->fetchAll();
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
		$dbRecords = $this->getDBIF()->query($sql)->fetchAll();
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
		$result->setNormal($graphData);
		return $result;
	}

	/**
	 * @param int $memberId
	 *
	 * @return Result
	 */
	public function memberProgressByMonthAction($memberId) {
		$result = new Result();
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
		$dbRecords = $this->getDBIF()->query($aSql)->fetchAll();
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
		$dbRecords = $this->getDBIF()->query($oSql)->fetchAll();
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
		$dbRecords = $this->getDBIF()->query($sql)->fetchAll();
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
		$dbRecords = $this->getDBIF()->query($aSql)->fetchAll();
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
		$dbRecords = $this->getDBIF()->query($oSql)->fetchAll();
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
		$dbRecords = $this->getDBIF()->query($sql)->fetchAll();
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
		$result->setNormal($graphData);
		return $result;
	}

	/**
	 * Retrieve and return a set of assessment IDs that are the most recent across multiple instruments, for a given member.
	 *
	 * @param int $memberId
	 *
	 * @return mixed
	 */
	public function getLatestIds($memberId) {
		$row = parent::getReadConnection()
			->query("SELECT MAX(id) AS latest FROM assessment WHERE member_id=? GROUP BY instrument_id", ['memberId' => $memberId])
			->fetchAll();
		$orgIds = $row["orgIds"];
		return $orgIds;
	}

	/**
	 * @param int $memberId
	 *
	 * @return array
	 */
	public function getLatestAssessmentIds($memberId) {
		$latest = $this->getLatestIds($memberId);
		$assessmentIds = $this->getColumn($latest, 'latest');
		return $assessmentIds;
	}
}
