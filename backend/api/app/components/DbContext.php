<?php
namespace App\Components;

use Nette\Database\Context,
	Nette\Database\Connection,
	Nette\Database\Table\IRow,
	Nette\Database\Table\Selection,
	Nette\Database\IStructure;

class DbContext extends Context {
	const TYPE_STRING = 0;
	const TYPE_DATE = 1;
	const TYPE_DATETIME = 2;
	const TYPE_INT = 3;
	const TYPE_REAL = 4;

	/** @var string[] $mapExcludes Exclude columns for this model, with respect to JSON encoding. */
	protected $mapExcludes = ['password'];

	/** @var string[] $dateTimeCols Some columns might require special save/restore/format processing. */
	protected $dateTimeCols = [];

	/**
	 * @var array $colName Map  Map column names to their abbreviations when transmitting via JSON.
	 */
	public static $colNameMap = [
		'ac'   => ['assessor_comments', self::TYPE_STRING],
		'asi'  => ['assessor_id', self::TYPE_INT],
		'ad'   => ['address', self::TYPE_STRING],
		'ari'  => ['app_role_id', self::TYPE_STRING],
		'asb'  => ['is_assessable', self::TYPE_INT],
		'av'   => ['avatar', self::TYPE_STRING],
		'by'   => ['by_member_id', self::TYPE_STRING],
		'cmi'  => ['calc_method_id', self::TYPE_STRING],
		'ct'   => ['content', self::TYPE_STRING],
		'cy'   => ['city', self::TYPE_STRING],
		'dt'   => ['date' => self::TYPE_DATE],
		'dpt'  => ['is_department', self::TYPE_INT],
		'dsc'  => ['description', self::TYPE_STRING],
		'ec'   => ['evaluator_comments', self::TYPE_STRING],
		'ei'   => ['evaluation_id', self::TYPE_INT],
		'ev'   => ['evaluated', self::TYPE_DATETIME],
		'evi'  => ['evaluator_id', self::TYPE_INT],
		'em'   => ['email', self::TYPE_STRING],
		'en'   => ['ends', self::TYPE_DATETIME],
		'es'   => ['edit_status', self::TYPE_STRING],
		'fn'   => ['first_name', self::TYPE_STRING],
		'fx'   => ['fax', self::TYPE_STRING],
		'ii'   => ['instrument_id', self::TYPE_INT],
		'isi'  => ['instrument_schedule_id', self::TYPE_INT],
		'jt'   => ['job_title', self::TYPE_STRING],
		'lm'   => ['last_modified', self::TYPE_DATETIME],
		'lmi'  => ['module_id', self::TYPE_INT],
		'ln'   => ['last_name', self::TYPE_STRING],
		'loc'  => ['location', self::TYPE_STRING],
		'lk'   => ['locked_on', self::TYPE_DATETIME],
		'ls'   => ['last_saved', self::TYPE_DATETIME],
		'lv'   => ['level', self::TYPE_INT],
		'max'  => ['max_range', self::TYPE_INT],
		'mb'   => ['mobile', self::TYPE_STRING],
		'mc'   => ['member_comments', self::TYPE_STRING],
		'mi'   => ['member_id', self::TYPE_INT],
		'min'  => ['min_range', self::TYPE_INT],
		'mth'  => ['method', self::TYPE_STRING],
		'n'    => ['name', self::TYPE_STRING],
		'nws'  => ['nag_window_start', self::TYPE_DATETIME],
		'nwe'  => ['nag_window_end', self::TYPE_DATETIME],
		'nmb'  => ['number', self::TYPE_STRING],
		'occ'  => ['occurred', self::TYPE_DATETIME],
		'oi'   => ['organization_id', self::TYPE_INT],
		'oti'  => ['outcome_id', self::TYPE_INT],
		'ph'   => ['phone', self::TYPE_STRING],
		'pli'  => ['plan_item_id', self::TYPE_INT],
		'pisi' => ['plan_item_status_id', self::TYPE_INT],
		'qg'   => ['question_group_id', self::TYPE_INT],
		'qi'   => ['question_id', self::TYPE_INT],
		'qt'   => ['question_type_id', self::TYPE_INT],
		'r'    => ['role_id', self::TYPE_STRING],
		'rds'  => ['role_ids', self::TYPE_STRING],
		'ri'   => ['resource_id', self::TYPE_INT],
		'rk'   => ['rank', self::TYPE_INT],
		'rti'  => ['resource_type_id', self::TYPE_INT],
		'ru'   => ['rubric', self::TYPE_STRING],
		'sc'   => ['score', self::TYPE_REAL],
		'sct'  => ['sched_type', self::TYPE_STRING],
		'sh'   => ['is_shared', self::TYPE_INT],
		'sm'   => ['summary', self::TYPE_STRING],
		'sr'   => ['starts', self::TYPE_DATETIME],
		'st'   => ['status_id', self::TYPE_STRING],
		'ss'   => ['status_stamp', self::TYPE_DATETIME],
		'sp'   => ['state', self::TYPE_STRING],
		'so'   => ['sort_order', self::TYPE_INT],
		'ttl'  => ['title', self::TYPE_STRING],
		'un'   => ['username', self::TYPE_STRING],
		'v'    => ['value', self::TYPE_STRING],
		'vs'   => ['view_status', self::TYPE_STRING],
		'wt'   => ['weight', self::TYPE_REAL],
		'zc'   => ['postal', self::TYPE_STRING],
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
		if ($dataType == DbContext::TYPE_INT) {
			$value = (int)@$value;
		}
		elseif ($dataType == DbContext::TYPE_DATETIME) {
			$value = self::presentationDateTime($value);
		}
		elseif ($dataType == DbContext::TYPE_DATE) {
			$value = self::presentationDateTime($value);
		}
		elseif ($dataType == DbContext::TYPE_REAL) {
			$value = (double)$value;
		}
		return $value;
	}

	/**
	 * @param IRow $dbRecord
	 *
	 * @return array
	 */
	public function map($dbRecord) {
		$jsonRecord = [];
		if (!empty($dbRecord)) {
			$columnNames = array_keys(iterator_to_array($dbRecord));
			for ($i = 0; $i < count($columnNames); $i++) {
				$colName = strtolower(trim($columnNames[$i]));
				if (empty($this->mapExcludes) || !in_array($colName, $this->mapExcludes)) {
					$jsonCol = $this->jsonCol($colName);
					$jsonRecord[$jsonCol[0]] = self::value($dbRecord[$colName], $jsonCol[1]);
				}
			}
		}
		return $jsonRecord;
	}

	/**
	 * @param IRow[]|Selection $records
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