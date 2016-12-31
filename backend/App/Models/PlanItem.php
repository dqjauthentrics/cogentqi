<?php
namespace App\Models;

use App\Components\Result;

/**
 * Class PlanItem
 * @package App\Models
 *
 * @method Member getMember()
 * @method Module getModule()
 * @method Recommendation getRecommendation()
 * @method PlanItemStatus getStatus()
 *
 * @property Member         $member
 * @property Module         $module
 * @property Recommendation $recommendation
 * @property PlanItemStatus $status
 *
 */
class PlanItem extends AppModel {
	const STATUS_RECOMMENDED = 'R';
	const STATUS_ENROLLED = 'E';
	const STATUS_WITHDRAWN = 'W';
	const STATUS_COMPLETED = 'C';

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $module_id;

	/**
	 *
	 * @var string
	 */
	public $plan_item_status_id;

	/**
	 *
	 * @var string
	 */
	public $status_stamp;

	/**
	 *
	 * @var integer
	 */
	public $member_id;

	/**
	 *
	 * @var integer
	 */
	public $recommendation_id;

	/**
	 *
	 * @var double
	 */
	public $score;

	/**
	 *
	 * @var integer
	 */
	public $rank;

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('module_id', 'App\Models\Module', 'id', ['alias' => 'Module']);
		$this->belongsTo('member_id', 'App\Models\Member', 'id', ['alias' => 'Member']);
		$this->belongsTo('plan_item_status_id', 'App\Models\PlanItemStatus', 'id', ['alias' => 'Status']);
		$this->belongsTo('recommendation_id', 'App\Models\Recommendation', 'id', ['alias' => 'Recommendation']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'plan_item';
	}

	public function getYear($organizationId, $status = PlanItem::STATUS_COMPLETED) {
		$result = new Result();
		$seriesNames = [];
		$graphData = $this->initializeYearGraphData();

		/** Get series names for events.
		 */
		$eSql = "SELECT r.name, YEAR(pi.status_stamp) AS yr, DATE_FORMAT(pi.status_stamp, '%m') AS mo, COUNT(pi.id) AS nItems
					FROM resource AS r, plan_item AS pi, module AS m
					WHERE r.id=m.resource_id AND m.id=pi.module_id AND pi.plan_item_status_id = '$status' AND
						pi.member_id IN (SELECT id FROM member WHERE organization_id=$organizationId)
					GROUP BY r.name, YEAR(pi.status_stamp), DATE_FORMAT(pi.status_stamp, '%m')
					ORDER BY r.name, YEAR(pi.status_stamp), DATE_FORMAT(pi.status_stamp, '%m');";
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
						'class'    => 'modules',
						"grouping" => 1,
						'visible'  => TRUE,
						'data'     => array_fill(0, count($graphData["labels"]), NULL),
					];
					$colorIdx++;
				}
				$graphData['series'][$seriesPos]['data'][$dataPos] = (int)$rec["nItems"];
			}
		}
		$result->setNormal($graphData);
		return $result;
	}


	/**
	 * @param array $options
	 *
	 * @return array|null
	 */
	public function map($options = []) {
		$map = parent::map();
		$map['module'] = $this->module->map(['minimal' => TRUE, 'resource' => TRUE]);
		$map['resource'] = $this->module->resource->map(['minimal' => TRUE]);
		return $map;
	}

}
