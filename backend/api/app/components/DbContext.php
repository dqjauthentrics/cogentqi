<?php
namespace App\Components;

use Nette\Database\Context,
	Nette\Database\Connection,
	Nette\Database\Table\IRow,
	Nette\Database\IStructure;

class DbContext extends Context {
	/** @var string[] $mapExcludes Exclude columns for this model, with respect to JSON encoding. */
	protected $mapExcludes = [];

	/** @var string[] $dateTimeCols Some columns might require special save/restore/format processing. */
	protected $dateTimeCols = [];

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
	 * @param \Nette\Database\Connection $connection
	 * @param \Nette\Database\IStructure $structure
	 * @param null                       $conventions
	 * @param null                       $cacheStorage
	 */
	function __construct(Connection $connection, IStructure $structure, $conventions = NULL, $cacheStorage = NULL) {
		parent::__construct($connection, $structure, $conventions, $cacheStorage);
	}

	/**
	 * @param string|null $dateTimeStr
	 *
	 * @return bool|string
	 */
	public static function dateTme($dateTimeStr = NULL) {
		if (empty($dateTimeStr)) {
			$dateTimeStr = date('m/d/Y h:i:s a', time());
		}
		$time = strtotime($dateTimeStr);
		$mysqlDate = date('Y-m-d H:i:s', $time);
		return $mysqlDate;
	}

	/**
	 * @return string
	 */
	public static function tableName($className) {
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
	 * @param IRow $dbRecord
	 *
	 * @return array
	 */
	public function map($dbRecord) {
		$jsonRecord = [];
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
		return $jsonRecord;
	}

	/**
	 * @param \NotORM_Result[] $records
	 *
	 * @return array
	 */
	public function mapRecords($records) {
		$jsonRecords = [];
		$tableName = $this->tableName($this->baseClassName());
		foreach ($this->api->db->{$tableName}() as $dbRecord) {
			$mapped = $this->map($dbRecord);
			if ($mapped !== NULL) {
				$jsonRecords[] = $mapped;
			}
		}
		return $jsonRecords;
	}
}