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
	 * @var integer
	 */
	public $level;

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
	public $last_updated;

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
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'App\Models\OutcomeReport', 'outcome_id', ['alias' => 'OutcomeReports']);
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
		$oSql = "SELECT name, YEAR(last_updated) AS yr, DATE_FORMAT(last_updated, '%m') AS mo, AVG(level) AS average
					FROM outcome
					GROUP BY name, YEAR(last_updated), DATE_FORMAT(last_updated, '%m'), name
					ORDER BY sort_order, name, YEAR(last_updated), DATE_FORMAT(last_updated, '%m');";
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
		$sql = "SELECT YEAR(last_updated) AS yr, DATE_FORMAT(last_updated, '%m') AS mo, AVG(oo.level) AS average
					FROM outcome 
					GROUP BY YEAR(last_updated), DATE_FORMAT(last_updated, '%m')
					ORDER BY YEAR(last_updated), DATE_FORMAT(last_updated, '%m');";
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
