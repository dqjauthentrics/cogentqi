<?php
namespace App;

/**
 * Created by PhpStorm.
 * User: dqj
 * Date: 3/20/15
 * Time: 10:10 PM
 */
class Model {
	protected $debug = FALSE;

	/** @var Api $this ->api */
	protected $api = NULL;

	/** @var array $mapExcludes */
	protected $mapExcludes = [];

	protected $dateTimeCols = [];

	public $tableName = NULL;

	public $colNameMap = [
		'avatar'             => 'av',
		'by_member_id'       => 'by',
		'description'        => 'dsc',
		'email'              => 'em',
		'evaluation_id'      => 'ei',
		'evaluator_comments' => 'ec',
		'first_name'         => 'fn',
		'instrument_id'      => 'ii',
		'job_title'          => 'jt',
		'last_name'          => 'ln',
		'last_modified'      => 'lm',
		'last_saved'         => 'ls',
		'module_id'          => 'lmi',
		'level'              => 'lv',
		'location'           => 'loc',
		'member_comments'    => 'mc',
		'member_id'          => 'mi',
		'name'               => 'n',
		'number'             => 'nmb',
		'organization_id'    => 'oi',
		'outcome_id'         => 'oti',
		'plan_item_id'       => 'pli',
		'question_group_id'  => 'qg',
		'question_id'        => 'qi',
		'question_type_id'   => 'qt',
		'resource_id'        => 'ri',
		'resource_type_id'   => 'rti',
		'role_id'            => 'r',
		'rubric'             => 'ru',
		'score'              => 'sc',
		'rank'               => 'rk',
		'sort_order'         => 'so',
		'summary'            => 'sm',
		'value'              => 'v',
		'weight'             => 'wt',
	];

	/**
	 * @param Api $this ->api
	 */
	function __construct($api) {
		$this->api = $api;
		$this->tableName = $this->classNameToTableName();
		$this->initialize();
	}

	public static function dateTime($mysqlDateTime) {
		if (!empty($mysqlDateTime)) {
			return date("c", strtotime($mysqlDateTime));
		}
		return null;
	}

	public function initialize() {
		if ($this->debug) {
			echo get_class($this) . " initializing routes..." . $this->urlName() . "\n";
		}
		$this->initializeRoutes();
	}

	public function baseClassName() {
		$path = explode('\\', get_class($this));
		return array_pop($path);
	}

	/**
	 * @return string
	 */
	public function urlName() {
		$path = $this->baseClassName();
		$path[0] = strtolower($path[0]);
		return $path;
	}

	protected function classNameToTableName() {
		$className = $this->baseClassName();
		$tableName = "";
		for ($i = 0; $i < strlen($className); $i++) {
			$ch = substr($className, $i, 1);
			if (ctype_upper($ch) && $i > 0) {
				$tableName .= "_";
			}
			$tableName .= $ch;
		}
		return strtolower($tableName);
	}

	protected function colNameToJsonName($colName) {
		$jsonName = "";
		for ($i = 0; $i < strlen($colName); $i++) {
			$ch = substr($colName, $i, 1);
			if ($ch == "_") {
				$i++;
				$ch = strtoupper(substr($colName, $i, 1));
			}
			$jsonName .= $ch;
		}
		return $jsonName;
	}

	/**
	 * @param array $dbRecord
	 *
	 * @return array
	 */
	public function map($dbRecord) {
		$jsonRecord = [];
		try {
			$columnNames = array_keys(iterator_to_array($dbRecord));
			for ($i = 0; $i < count($columnNames); $i++) {
				$colName = $columnNames[$i];
				if (empty($this->mapExcludes) || !in_array($colName, $this->mapExcludes)) {
					if (FALSE && !empty($this->colNameMap[$colName])) {
						$jsonName = $this->colNameMap[$colName];
					}
					else {
						$jsonName = $this->colNameToJsonName($colName);
					}
					if (in_array($colName, $this->dateTimeCols)) {
						$jsonRecord[$jsonName] = @$this->dateTime($dbRecord[$colName]);
					}
					else {
						$jsonRecord[$jsonName] = @$dbRecord[$colName];
					}
				}
			}
		}
		catch (\Exception $exception) {
			var_dump($exception);
		}
		return $jsonRecord;
	}

	/**
	 */
	public function initializeRoutes() {
		$urlName = $this->urlName();
		$this->api->get("/$urlName", function ($parentId = NULL) use ($urlName) {
			$jsonRecords = [];
			foreach ($this->api->db->{$this->tableName}() as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});
		$this->api->get("/$urlName/children/:parentId", function ($parentId = NULL) use ($urlName) {
			$jsonRecords = [];
			foreach ($this->api->db->{$this->tableName}()->where("parent_id=?", $parentId) as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});
		$this->api->get("/$urlName/:id", function ($id) use ($urlName) {
			$dbRecord = $this->api->db->{$this->tableName}()->where("id", $id);
			if ($data = $dbRecord->fetch()) {
				$this->api->sendResult($this->map($data));
			}
			else {
				$this->api->sendResult("$urlName ID $id does not exist", Api::STATUS_ERROR);
			}
		});

		$this->api->post("/$urlName", function () use ($urlName) {
			$jsonPostData = $this->api->request()->post();
			$result = $this->api->db->{$this->tableName}->insert($jsonPostData);
			$this->api->sendResult(["id" => $result["id"]]);
		});

		$this->api->put("/$urlName/:id", function ($id) use ($urlName) {
			$dbRecord = $this->api->db->{$this->tableName}()->where("id", $id);
			if ($dbRecord->fetch()) {
				$post = $this->api->request()->put();
				$result = $dbRecord->update($post);
				$this->api->sendResult("$urlName updated.", (bool)$result);
			}
			else {
				$this->api->sendResult("$urlName id $id does not exist", Api::STATUS_ERROR);
			}
		});

		$this->api->delete("/$urlName/:id", function ($id) use ($urlName) {
			$dbRecord = $this->api->db->{$this->tableName}()->where("id", $id);
			if ($dbRecord->fetch()) {
				$result = $dbRecord->delete();
				$this->api->sendResult("$urlName deleted.");
			}
			else {
				$this->api->sendResult("$urlName id $id does not exist.", Api::STATUS_ERROR);
			}
		});
	}
}