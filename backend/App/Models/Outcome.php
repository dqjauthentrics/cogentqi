<?php
namespace App\Models;

use App\Components\Result;

class Outcome extends AppModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var string
	 */
	public $number;

	/**
	 *
	 * @var string
	 */
	public $name;

	/**
	 *
	 * @var string
	 */
	public $summary;

	/**
	 *
	 * @var string
	 */
	public $calc_method_id;

	/**
	 *
	 * @var string
	 */
	public $method;

	/**
	 *
	 * @var integer
	 */
	public $sort_order;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Outcome[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Outcome
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'App\Models\OrganizationOutcome', 'outcome_id', ['alias' => 'OrganizationOutcomes']);
		$this->hasMany('id', 'App\Models\OutcomeAlignment', 'outcome_id', ['alias' => 'Alignments']);
		$this->hasMany('id', 'App\Models\OutcomeEvent', 'outcome_id', ['alias' => 'Events']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'outcome';
	}

	/**
	 * @var array $options
	 * @return array
	 */
	public function map($options = ['alignments' => TRUE, 'singleOrgId' => NULL]) {
		$map = parent::map();
		if ($options['alignments']) {
			$jsonAlignments = [];
			/**
			 * @var OutcomeAlignment $alignmentRecord
			 */
			foreach ($this->getAlignments() as $alignmentRecord) {
				$jsonAlignments[] = $alignmentRecord->map();
			}
			$map["alignments"] = $jsonAlignments;
		}
		$jsonOutcomeLevels = [];
		if (!empty($options['singleOrgId'])) {
			$dbRecords = OrganizationOutcome::query()->where('organization_id=:id:', ['id' => $options['singleOrgId']])->orderBy('outcomeId')->execute();
			foreach ($this->$dbRecords() as $dbRecord) {
				$outId = (int)$dbRecord->outcome_id;
				$jsonOutcomeLevels[$outId] = (int)$dbRecord->level;
			}
			$map["levels"] = $jsonOutcomeLevels;
		}
		/**
		 * else {
		 * $dbRecords = $database->table('organization_outcome')->fetchAll(); //->order('organizationId,outcomeId');
		 * foreach ($dbRecords as $dbRecord) {
		 * $organizationId = (int)$dbRecord["organization_id"];
		 * $outId = (int)$dbRecord["outcome_id"];
		 * if (empty($jsonOutcomeLevels[$organizationId])) {
		 * $jsonOutcomeLevels[$organizationId] = [];
		 * }
		 * $jsonOutcomeLevels[$organizationId][$outId] = (int)$dbRecord["level"];
		 * }
		 * $map["levels"] = $jsonOutcomeLevels;
		 * }
		 **/
		return $map;
	}

	/**
	 * @param int $organizationId
	 *
	 * @return Result
	 */
	public function getTrends($organizationId) {
		$result = new Result();
		$graphData = ['labels' => [], 'series' => [[], [], [], [], [], [], [], [], [], [], [], [], []]];
		$now = time();
		$yearAgo = strtotime("-1 year", $now);
		$thisYr = (int)date("Y", $now);
		$thisMo = (int)date("m", $now);
		$startYr = (int)date("Y", $yearAgo);
		$startMo = (int)date("m", $yearAgo);

		$seriesNames = ['Outcomes'];

		/** Get series names for outcomes.
		 */
		$oSql = "SELECT ot.name, YEAR(oo.evaluated) AS yr, DATE_FORMAT(oo.evaluated, '%m') AS mo, AVG(oo.level) AS average
					FROM outcome AS ot, organization_outcome AS oo
					WHERE oo.organization_id=" . ((int)$organizationId) . " AND ot.id=oo.outcome_id
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

		/**
		 * Append multiple outcomes.
		 */
		$dbRecords = $this->getDBIF()->query($oSql)->fetchAll();
		if (!empty($dbRecords)) {
			$colorIdx = 0;
			foreach ($dbRecords as $rec) {
				$yrMo = $rec["yr"] . '-' . $rec["mo"];
				$seriesPos = array_search($rec["name"], $seriesNames);
				$dataPos = array_search($yrMo, $graphData["labels"]);
				if ($seriesPos !== FALSE && $dataPos !== FALSE) {
					$seriesPos = (int)$seriesPos;
					$dataPos = (int)$dataPos;
					if (empty($graphData['series'][$seriesPos])) {
						$graphData['series'][$seriesPos] = [
							'name'     => $rec["name"],
							'yAxis'    => 0,
							'class'    => 'outcomes',
							"grouping" => 1,
							'visible'  => FALSE,
							'data'     => array_fill(0, count($graphData["labels"]), NULL),
						];
						$colorIdx++;
					}
					$graphData['series'][$seriesPos]['data'][$dataPos] = (double)number_format($rec["average"], 2);
				}
			}
		}

		/**
		 * Append the single overall outcomes series.
		 */
		$sql = "SELECT YEAR(oo.evaluated) AS yr, DATE_FORMAT(oo.evaluated, '%m') AS mo, AVG(oo.level) AS average
					FROM outcome AS ot, organization_outcome AS oo
					WHERE oo.organization_id=" . ((int)$organizationId) . " AND oo.evaluated >= DATE_SUB(NOW(),INTERVAL 1 YEAR)
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
					$dataPos = (int)$dataPos;
					if (empty($graphData['series'][$seriesPos])) {
						$graphData['series'][$seriesPos] = [
							'yAxis'     => 0,
							'name'      => 'Average',
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
		for ($i=0; $i < count($graphData['series']); $i++ ) {
			if (empty($graphData['series'][$i])) {
				array_splice($graphData['series'], $i, 1);
				$i--;
			}
		}
		$result->setNormal($graphData);
		return $result;
	}
}
