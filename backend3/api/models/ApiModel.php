<?php
namespace Api\Models;

class ApiModel extends \Phalcon\Mvc\Model {
	const TYPE_STRING = 0;
	const TYPE_DATE = 1;
	const TYPE_DATETIME = 2;
	const TYPE_INT = 3;
	const TYPE_REAL = 4;

	/** @var string[] $mapExcludes Exclude columns for this model, with respect to JSON encoding. */
	protected $mapExcludes = ['password'];

	/** @var string[] $dateTimeCols Some columns might require special save/restore/format processing. */
	protected $dateTimeCols = [];

	/** @var \PDO $pdo */
	protected $pdo = NULL;

	/**
	 * @var array $colName Map  Map column names to their abbreviations when transmitting via JSON.
	 */
	public static $colNameMap = [
		'ac'   => ['assessor_comments', self::TYPE_STRING],
		'ad'   => ['address', self::TYPE_STRING],
		'ae'   => ['active_end', self::TYPE_DATE],
		'ari'  => ['app_role_id', self::TYPE_STRING],
		'as'   => ['active_start', self::TYPE_DATE],
		'asb'  => ['is_assessable', self::TYPE_INT],
		'asi'  => ['assessor_id', self::TYPE_INT],
		'av'   => ['avatar', self::TYPE_STRING],
		'by'   => ['by_member_id', self::TYPE_STRING],
		'cid'  => ['creator_id', self::TYPE_INT],
		'cmi'  => ['calc_method_id', self::TYPE_STRING],
		'ct'   => ['content', self::TYPE_STRING],
		'cy'   => ['city', self::TYPE_STRING],
		'dpt'  => ['is_department', self::TYPE_INT],
		'dsc'  => ['description', self::TYPE_STRING],
		'dt'   => ['date' => self::TYPE_DATE],
		'ec'   => ['evaluator_comments', self::TYPE_STRING],
		'ef'   => ['event_factor', self::TYPE_REAL],
		'ei'   => ['evaluation_id', self::TYPE_INT],
		'em'   => ['email', self::TYPE_STRING],
		'en'   => ['ends', self::TYPE_DATETIME],
		'es'   => ['edit_status', self::TYPE_STRING],
		'ev'   => ['evaluated', self::TYPE_DATETIME],
		'evi'  => ['evaluator_id', self::TYPE_INT],
		'ew'   => ['event_weight', self::TYPE_INT],
		'fn'   => ['first_name', self::TYPE_STRING],
		'fx'   => ['fax', self::TYPE_STRING],
		'ii'   => ['instrument_id', self::TYPE_INT],
		'isi'  => ['instrument_schedule_id', self::TYPE_INT],
		'jt'   => ['job_title', self::TYPE_STRING],
		'lk'   => ['locked_on', self::TYPE_DATETIME],
		'lm'   => ['last_modified', self::TYPE_DATETIME],
		'lmi'  => ['module_id', self::TYPE_INT],
		'ln'   => ['last_name', self::TYPE_STRING],
		'loc'  => ['location', self::TYPE_STRING],
		'ls'   => ['last_saved', self::TYPE_DATETIME],
		'lv'   => ['level', self::TYPE_INT],
		'max'  => ['max_range', self::TYPE_INT],
		'mb'   => ['mobile', self::TYPE_STRING],
		'mc'   => ['member_comments', self::TYPE_STRING],
		'mfm'  => ['message_format', self::TYPE_STRING],
		'mi'   => ['member_id', self::TYPE_INT],
		'min'  => ['min_range', self::TYPE_INT],
		'mth'  => ['method', self::TYPE_STRING],
		'n'    => ['name', self::TYPE_STRING],
		'nmb'  => ['number', self::TYPE_STRING],
		'nwe'  => ['nag_window_end', self::TYPE_DATETIME],
		'nws'  => ['nag_window_start', self::TYPE_DATETIME],
		'occ'  => ['occurred', self::TYPE_DATETIME],
		'of'   => ['outcome_factor', self::TYPE_REAL],
		'oi'   => ['organization_id', self::TYPE_INT],
		'oti'  => ['outcome_id', self::TYPE_INT],
		'ow'   => ['outcome_weight', self::TYPE_INT],
		'ph'   => ['phone', self::TYPE_STRING],
		'pisi' => ['plan_item_status_id', self::TYPE_INT],
		'pli'  => ['plan_item_id', self::TYPE_INT],
		'pv'   => ['is_private', self::TYPE_INT],
		'qg'   => ['question_group_id', self::TYPE_INT],
		'qi'   => ['question_id', self::TYPE_INT],
		'qt'   => ['question_type_id', self::TYPE_INT],
		'r'    => ['role_id', self::TYPE_STRING],
		'rds'  => ['role_ids', self::TYPE_STRING],
		'rdx'  => ['response_index', self::TYPE_INT],
		'ri'   => ['resource_id', self::TYPE_INT],
		'rk'   => ['rank', self::TYPE_INT],
		'rp'   => ['response', self::TYPE_STRING],
		'rti'  => ['resource_type_id', self::TYPE_INT],
		'ru'   => ['rubric', self::TYPE_STRING],
		'rwt'  => ['rel_wt', self::TYPE_REAL],
		'sc'   => ['score', self::TYPE_REAL],
		'sct'  => ['sched_type', self::TYPE_STRING],
		'sh'   => ['is_shared', self::TYPE_INT],
		'sm'   => ['summary', self::TYPE_STRING],
		'so'   => ['sort_order', self::TYPE_INT],
		'sp'   => ['state', self::TYPE_STRING],
		'sr'   => ['starts', self::TYPE_DATETIME],
		'ss'   => ['status_stamp', self::TYPE_DATETIME],
		'st'   => ['status_id', self::TYPE_STRING],
		'ttl'  => ['title', self::TYPE_STRING],
		'un'   => ['username', self::TYPE_STRING],
		'v'    => ['value', self::TYPE_STRING],
		'vs'   => ['view_status', self::TYPE_STRING],
		'wt'   => ['weight', self::TYPE_REAL],
		'zc'   => ['postal', self::TYPE_STRING],
	];

	/**
	 * @param object $record
	 * @param array  $mappedColumns
	 *
	 * @return array
	 */
	public function mapColumns($record, $mappedColumns) {
		$map = [];
		foreach ($mappedColumns as $colName => $dataType) {
			$value = $this->value(@$record[$colName], $dataType);
			$jsonCol = $this->jsonCol($colName);
			$map[$jsonCol[0]] = $value;
		}
		return $map;
	}

	/**
	 * @param string|null $dateTimeStr
	 *
	 * @return bool|string
	 */
	public function dateTme($dateTimeStr = NULL) {
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
	 * @param string $colName
	 *
	 * @return array|bool
	 */
	public function searchColMap($colName) {
		foreach (self::$colNameMap as $abbrev => $info) {
			if (@$info[0] == $colName) {
				return [$abbrev, $info[1]];
			}
		}
		return FALSE;
	}

	/**
	 * @param string $colName
	 *
	 * @return mixed|string
	 */
	public function jsonCol($colName) {
		$pos = $this->searchColMap($colName);
		if ($pos !== FALSE) {
			$jsonCol = $pos;
		}
		else {
			$jsonCol = [$this->colNameToJsonName($colName), self::TYPE_STRING];
		}
		return $jsonCol;
	}

	/**
	 * @param string $mysqlDateTime
	 *
	 * @return bool|null|string
	 */
	public static function presentationDateTime($mysqlDateTime) {
		if (!empty($mysqlDateTime)) {
			return date("c", strtotime($mysqlDateTime));
		}
		return NULL;
	}

	/**
	 * @param $value
	 * @param $dataType
	 *
	 * @return float|int
	 */
	public static function value($value, $dataType) {
		if ($dataType == self::TYPE_INT) {
			$value = (int)@$value;
		}
		elseif ($dataType == self::TYPE_DATETIME) {
			$value = self::presentationDateTime($value);
		}
		elseif ($dataType == self::TYPE_DATE) {
			$value = self::presentationDateTime($value);
		}
		elseif ($dataType == self::TYPE_REAL) {
			$value = (double)$value;
		}
		return $value;
	}

	/**
	 * @return array
	 */
	public function map() {
		$jsonRecord = [];
		// Get Phalcon\Mvc\Model\Metadata instance
		$metaData   = $this->getModelsMetaData();

		// Get robots fields names
		$columnNames = $metaData->getAttributes($this);
		for ($i = 0; $i < count($columnNames); $i++) {
			$colName = strtolower(trim($columnNames[$i]));
			if (empty($this->mapExcludes) || !in_array($colName, $this->mapExcludes)) {
				$jsonCol = $this->jsonCol($colName);
				$jsonRecord[$jsonCol[0]] = self::value($this->{$colName}, $jsonCol[1]);
			}
		}
		return $jsonRecord;
	}

	/**
	 * @param string $tableName
	 *
	 * @return array
	 */
	public function getColNames($tableName) {
		$q = $this->pdo->prepare("DESCRIBE $tableName");
		$q->execute();
		$colNames = $q->fetchAll(\PDO::FETCH_COLUMN);
		return $colNames;
	}

	/**
	 * @param array  $jsonRecord
	 * @param string $tableName
	 *
	 * @return array
	 */
	public function unmap($jsonRecord, $tableName) {
		$tblCols = $this->getColNames($tableName);
		$newData = [];
		if (!empty($jsonRecord)) {
			foreach ($jsonRecord as $jsonColName => $value) {
				$fullName = @self::$colNameMap[$jsonColName][0];
				if (empty($fullName)) {
					$fullName = $jsonColName;
				}
				if (in_array($fullName, $tblCols)) {
					$newData[$fullName] = $value;
				}
			}
		}
		return $newData;
	}

	/**
	 * @param \Phalcon\Mvc\Model\Criteria $records
	 *
	 * @return array
	 */
	public function mapRecords($records) {
		$jsonRecords = [];
		foreach ($records as $dbRecord) {
			$mapped = $this->map($dbRecord);
			if ($mapped !== NULL) {
				$jsonRecords[] = $mapped;
			}
		}
		return $jsonRecords;
	}
}