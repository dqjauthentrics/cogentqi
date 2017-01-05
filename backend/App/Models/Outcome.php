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
		if (!empty($options['alignments'])) {
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
		$seriesNames = ['Average'];
		$graphData = $this->initializeYearGraphData();

		$oSql = "SELECT name, YEAR(rpt.evaluated) AS yr, DATE_FORMAT(rpt.evaluated, '%m') AS mo, ROUND(AVG(rpt.level)*100) AS level
					FROM outcome AS o, outcome_report AS rpt
					WHERE o.id=rpt.outcome_id AND rpt.evaluated >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
					GROUP BY name, YEAR(rpt.evaluated), DATE_FORMAT(rpt.evaluated, '%m'), name
					ORDER BY sort_order, name, YEAR(rpt.evaluated), DATE_FORMAT(rpt.evaluated, '%m');";
		$dbRecords = $this->getDBIF()->query($oSql)->fetchAll();
		foreach ($dbRecords as $rec) {
			$colorIdx = 0;
			$yrMo = $rec["yr"] . '-' . $rec["mo"];
			if (!in_array($rec["name"], $seriesNames)) {
				$seriesNames[] = $rec["name"];
			}
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
				$graphData['series'][$seriesPos]['data'][$dataPos] = (double)number_format($rec["level"], 2);
			}
		}

		/**
		 * Append the single overall outcomes series.
		 */
		$sql = "SELECT YEAR(rpt.evaluated) AS yr, DATE_FORMAT(rpt.evaluated, '%m') AS mo, ROUND(AVG(rpt.level)*100) AS level
					FROM outcome AS o, outcome_report AS rpt
					WHERE o.id=rpt.outcome_id AND rpt.evaluated >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
					GROUP BY YEAR(rpt.evaluated), DATE_FORMAT(rpt.evaluated, '%m'), name
					ORDER BY YEAR(rpt.evaluated), DATE_FORMAT(rpt.evaluated, '%m');";
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
					$graphData['series'][$seriesPos]['data'][$dataPos] = (double)number_format($rec["level"], 2);
				}
			}
		}
		for ($i = 0; $i < count($graphData['series']); $i++) {
			if (empty($graphData['series'][$i])) {
				array_splice($graphData['series'], $i, 1);
				$i--;
			}
		}
		$result->setNormal($graphData);
		return $result;
	}
}
