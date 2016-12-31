<?php

namespace App\Models;

use App\Components\Result;

/**
 * Class Event
 * @package App\Models
 * @method \Phalcon\Mvc\Model\Resultset\Simple|EventAlignment[] getAlignments()
 * @method \Phalcon\Mvc\Model\Resultset\Simple|Member[] getMembers()
 *
 * @property \Phalcon\Mvc\Model\Resultset\Simple|EventAlignment[] $alignments
 * @property \Phalcon\Mvc\Model\Resultset\Simple|Member[]         $members
 *
 */
class Event extends AppModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var string
	 */
	public $name;

	/**
	 *
	 * @var string
	 */
	public $description;

	/**
	 *
	 * @var string
	 */
	public $category;

	/**
	 *
	 * @var integer
	 */
	public $threshold;

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'App\Models\EventAlignment', 'event_id', ['alias' => 'Alignments']);
		$this->hasMany('id', 'App\Models\MemberEvent', 'event_id', ['alias' => 'Members']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'event';
	}

	public function getTypes($organizationId) {
		$result = new Result();

		$graphData = ['series' => [['name' => 'Event Types', 'size' => '100%', 'data' => []]]];
		$eSql = "SELECT evt.name, COUNT(me.id) AS nEvents FROM event AS evt, member_event AS me
					WHERE me.event_id=evt.id AND me.member_id IN (SELECT id FROM member WHERE organization_id=$organizationId)
					GROUP BY evt.name ORDER BY evt.name";
		$dbRecords = $this->getDBIF()->query($eSql, ['oid' => $organizationId])->fetchAll();
		foreach ($dbRecords as $rec) {
			$graphData['series'][0]['data'][] = ['name' => $rec['name'], 'y' => $rec['nEvents']];
		}
		$result->setNormal($graphData);
		return $result;
	}

	public function getYear($organizationId) {
		$result = new Result();
		$seriesNames = [];
		$graphData = $this->initializeYearGraphData();

		/** Get series names for events.
		 */
		$eSql = "SELECT evt.name, YEAR(me.occurred) AS yr, DATE_FORMAT(me.occurred, '%m') AS mo, COUNT(me.id) AS nEvents
					FROM event AS evt, member_event AS me
					WHERE me.event_id=evt.id AND me.member_id IN (SELECT id FROM member WHERE organization_id=$organizationId)
					GROUP BY evt.name, YEAR(me.occurred), DATE_FORMAT(me.occurred, '%m')
					ORDER BY evt.name, YEAR(me.occurred), DATE_FORMAT(me.occurred, '%m');";
		$dbRecords = $this->getDBIF()->query($eSql, ['oid' => $organizationId])->fetchAll();
		$colorIdx = 0;
		foreach ($dbRecords as $rec) {
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
						'class'    => 'events',
						"grouping" => 1,
						'visible'  => TRUE,
						'data'     => array_fill(0, count($graphData["labels"]), NULL),
					];
					$colorIdx++;
				}
				$graphData['series'][$seriesPos]['data'][$dataPos] = (int)$rec["nEvents"];
			}
		}
		$result->setNormal($graphData);
		return $result;
	}

	public function getYearAverage($organizationId) {
		$result = new Result();
		$graphData = ['labels' => [], 'series' => [[]]];
		$now = time();
		$yearAgo = strtotime("-1 year", $now);

		for ($i = 1; $i <= 12; $i++) {
			$time = strtotime(date('Y-M-d', $yearAgo) . ' +' . $i . ' month');
			$yrMo = date("Y", $time) . '-' . date("m", $time);
			$graphData["labels"][] = $yrMo;
		}

		$sql = "SELECT YEAR(me.occurred) AS yr, DATE_FORMAT(me.occurred, '%m') AS mo, COUNT(me.id) AS nEvents
					FROM event AS evt, member_event AS me
					WHERE evt.id=me.event_id AND me.member_id IN (SELECT id FROM member WHERE organization_id=$organizationId) AND me.occurred >= DATE_SUB(NOW(),INTERVAL 1 YEAR)
					GROUP BY YEAR(me.occurred), DATE_FORMAT(me.occurred, '%m')
					ORDER BY YEAR(me.occurred), DATE_FORMAT(me.occurred, '%m');";
		$dbRecords = $this->getDBIF()->query($sql)->fetchAll();
		if (!empty($dbRecords)) {
			foreach ($dbRecords as $rec) {
				$yrMo = $rec["yr"] . '-' . $rec["mo"];
				$dataPos = array_search($yrMo, $graphData["labels"]);
				if ($dataPos !== FALSE) {
					$dataPos = (int)$dataPos;
					if (empty($graphData['series'][0])) {
						$graphData['series'][0] = [
							'yAxis'     => 0,
							'name'      => 'No. Events',
							'lineWidth' => 4,
							'class'     => 'events_overall',
							"grouping"  => 0,
							'visible'   => TRUE,
							'lineColor' => 'red',
							'color'     => 'red',
							'marker'    => ['radius' => 8],
							'data'      => array_fill(0, count($graphData["labels"]), NULL),
						];
					}
					$graphData['series'][0]['data'][$dataPos] = (int)$rec["nEvents"];
				}
			}
		}
		$result->setNormal($graphData);
		return $result;
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = []) {
		$map = parent::map();
		if (empty($options['minimal'])) {
			$jsonAlignments = [];
			foreach ($this->alignments as $alignment) {
				$jsonAlignments[] = $alignment->map();
			}
			$map["alignments"] = $jsonAlignments;
		}
		return $map;
	}

}
