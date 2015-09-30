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

	/** @var Api $this ->api The API object. */
	protected $api = NULL;

	/** @var string[] $mapExcludes Exclude columns for this model, with respect to JSON encoding. */
	protected $mapExcludes = [];

	/** @var string[] $dateTimeCols Some columns might require special save/restore/format processing. */
	protected $dateTimeCols = [];

	/** @var string $tableName The name of the associated table for this model. */
	public $tableName = NULL;

	/**
	 * @var array $colName Map  Map column names to their abbreviations when transmitting via JSON.
	 */
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
		'max_range'          => 'max',
		'min_range'          => 'min',
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

	/**
	 * @param string $mysqlDateTime
	 *
	 * @return bool|null|string
	 */
	public static function dateTime($mysqlDateTime) {
		if (!empty($mysqlDateTime)) {
			return date("c", strtotime($mysqlDateTime));
		}
		return NULL;
	}

	/**
	 * @param string|null $dateTimeStr
	 *
	 * @return bool|string
	 */
	public static function dbDateTme($dateTimeStr = NULL) {
		if (empty($dateTimeStr)) {
			$dateTimeStr = date('m/d/Y h:i:s a', time());
		}
		$time = strtotime($dateTimeStr);
		$mysqlDate = date('Y-m-d H:i:s', $time);
		return $mysqlDate;
	}

	/**
	 *
	 */
	public function initialize() {
		if ($this->debug) {
			echo get_class($this) . " initializing routes..." . $this->urlName() . "\n";
		}
		$this->initializeRoutes();
	}

	/**
	 * @return string
	 */
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

	/**
	 * @return string
	 */
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

	/**
	 * @param string $colName
	 *
	 * @return string
	 */
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
	 * @param \NotORM_Result $dbRecord
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
	 * @param \NotORM_Result[] $records
	 *
	 * @return array
	 */
	public function mapRecords($records) {
		$jsonRecords = [];
		foreach ($this->api->db->{$this->tableName}() as $dbRecord) {
			$mapped = $this->map($dbRecord);
			if ($mapped !== NULL) {
				$jsonRecords[] = $mapped;
			}
		}
		return $jsonRecords;
	}

	/**
	 */
	public function initializeRoutes() {
		$urlName = $this->urlName();
		$this->api->get("/$urlName", function ($parentId = NULL) use ($urlName) {
			$jsonRecords = $this->mapRecords($this->api->db->{$this->tableName}());
			$this->api->sendResult($jsonRecords);
		});
		$this->api->get("/$urlName/children/:parentId", function ($parentId = NULL) {
			$jsonRecords = $this->mapRecords($this->api->db->{$this->tableName}()->where("parent_id=?", $parentId));
			$this->api->sendResult($jsonRecords);
		});
		$this->api->get("/$urlName/:id", function ($id) use ($urlName) {
			/** @var \NotORM_Result $dbRecord */
			$dbRecord = $this->api->db->{$this->tableName}()->where("id", $id);
			$data = $dbRecord->fetch();
			if (!empty($data)) {
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
			/** @var \NotORM_Result $dbRecord */
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
			/** @var \NotORM_Result $dbRecord */
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