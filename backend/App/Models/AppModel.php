<?php
namespace App\Models;

class AppModel extends \Phalcon\Mvc\Model {
	public $id = NULL; // syntactic sugar

	const TYPE_STRING = 2;
	const TYPE_DATE = 4;
	const TYPE_DATETIME = 4;
	const TYPE_INT = 0;
	const TYPE_CHAR = 5;
	const TYPE_REAL = 99; //@todo TBD

	/** @var \Phalcon\Db\AdapterInterface $dbif */
	private $dbif = NULL;

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
	 * @param array $jsonRecord
	 *
	 * @return array
	 */
	public static function genericUnmap($jsonRecord) {
		$unmapped = [];
		if (!empty($jsonRecord)) {
			foreach ($jsonRecord as $jsonColName => $value) {
				$unmapped[$jsonColName] = $value;
			}
		}
		return $unmapped;
	}

	/**
	 * @param string|null $dateTimeStr
	 *
	 * @return bool|string
	 */
	public static function dbDateTime($dateTimeStr = NULL) {
		if (empty($dateTimeStr)) {
			$dateTimeStr = date('m/d/Y h:i:s a', time());
		}
		$time = strtotime($dateTimeStr);
		$mysqlDate = date('Y-m-d H:i:s', $time);
		return $mysqlDate;
	}

	/**
	 * @return \Phalcon\Db\AdapterInterface
	 */
	public function getDBIF() {
		return $this->getReadConnection();
	}

	/**
	 * @param \Phalcon\Mvc\Model\Resultset\Simple|AppModel[]    $records
	 * @param                                                   $keyColName
	 *
	 * @return array
	 */
	public function recordsKeyed($records, $keyColName) {
		$keyed = [];
		if (!empty($records)) {
			foreach ($records as $record) {
				$keyed[$record->$keyColName] = $record;
			}
		}
		return $keyed;
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
	 * @return array
	 */
	public function getColNames() {
		return @$this->getModelsMetaData()->getAttributes($this);
	}

	/**
	 * @param null|int|string $id
	 * @param bool            $mapIt
	 * @param string          $orderBy
	 * @param string          $where
	 * @param array           $whereParams
	 *
	 * @return AppModel[]|AppModel|array|null
	 */
	public function get($id = NULL, $mapIt = TRUE, $orderBy = 'id', $where = '1=1', $whereParams = []) {
		$data = !empty($id) ? NULL : [];
		/** @var AppModel $record */
		if (empty($id)) {
			$records = $this->query()->where($where, $whereParams)->orderBy($orderBy)->execute();
			if ($mapIt) {
				foreach ($records as $record) {
					$data[] = $record->map();
				}
			}
			else {
				$data = $records;
			}
		}
		else {
			$record = $this->findFirst($id);
			$data = $mapIt ? $record->map() : $record;
		}
		return $data;
	}

	/**
	 * @param AppModel[] $records
	 * @param int        $id
	 *
	 * @return AppModel|null
	 */
	public static function findRecord($records, $id) {
		if (!empty($records)) {
			foreach ($records as $record) {
				if ($record->id == $id) {
					return $record;
				}
			}
		}
		return NULL;
	}

	/**
	 * @param array[] $array
	 * @param string  $key
	 *
	 * @return array
	 */
	public static function getArrayColumn($array, $key) {
		$colValues = [];
		foreach ($array as $element) {
			if (isset($element[$key])) {
				$colValues[] = $element[$key];
			}
		}
		return $colValues;
	}

	/**
	 * @param \Phalcon\Mvc\Model\Resultset $records
	 * @param string                       $colName
	 *
	 * @return array
	 */
	public static function getColumn($records, $colName) {
		$colValues = [];
		if (!empty($records)) {
			foreach ($records as $record) {
				$colValues[] = $record->$colName;
			}
		}
		return $colValues;
	}

	/**
	 * @param string $separator
	 *
	 * @return string
	 */
	public function errorMessagesAsString($separator = '<br/>') {
		$msgString = '';
		$messages = $this->getMessages();
		if (!empty($messages)) {
			foreach ($messages as $message) {
				if (strlen($msgString) > 0) {
					$msgString .= $separator;
				}
				$msgString .= $message;
			}
		}
		return $msgString;
	}

	/**
	 * @param string $colName
	 *
	 * @return string
	 */
	protected function jsonifyName($colName) {
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
	 * @param string $jsonColName
	 *
	 * @return string
	 */
	public function unJsonifyName($jsonColName) {
		$unJson = '';
		for ($i = 0; $i < strlen($jsonColName); $i++) {
			$ch = substr($jsonColName, $i, 1);
			if (ctype_upper($ch)) {
				$unJson .= '_';
			}
			$unJson .= strtolower($ch);
		}
		return $unJson;
	}

	/**
	 * @param array    $jsonRecord
	 * @param AppModel $dbRecord
	 *
	 */
	public function unmap($jsonRecord, &$dbRecord) {
		$tblCols = $this->getColNames();
		if (!empty($jsonRecord) && !empty($dbRecord)) {
			foreach ($jsonRecord as $jsonColName => $value) {
				$dbColName = $this->unJsonifyName($jsonColName);
				if (in_array($dbColName, $tblCols)) {
					$dbRecord->$dbColName = $value;
				}
			}
		}
	}

	/**
	 * @param $value
	 * @param $dataType
	 *
	 * @return float|int
	 */
	public static function value($value, $dataType = self::TYPE_STRING) { //@todo get col type
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
	 * @param AppModel[] $records
	 *
	 * @return array
	 */
	public function mapRecords($records) {
		$jsonRecords = [];
		foreach ($records as $dbRecord) {
			$mapped = $dbRecord->map();
			if ($mapped !== NULL) {
				$jsonRecords[] = $mapped;
			}
		}
		return $jsonRecords;
	}

	public function getSingleValue($queryStr) {
		$row = $this->getReadConnection()->query($queryStr)->fetch();
		if ($row) {
			return $row[0];
		}
		return null;
	}

	/**
	 * @param string $childTable
	 * @param string $foreignKeyName
	 * @param string $orderBy
	 * @param array  $options
	 *
	 * @return array
	 */
	public function mapChildren($childTable, $foreignKeyName, $orderBy = 'id DESC', $options = []) {
		$children = [];
		/**
		 * @var AppModel   $childTable
		 * @var AppModel[] $records
		 */
		$records = $childTable::query()->where("$foreignKeyName = :id:")->bind(['id' => $this->id])->orderBy($orderBy)->execute();
		if (!empty($records)) {
			foreach ($records as $record) {
				$children[] = $record->map($options);
			}
		}
		return $children;
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = []) {
		$jsonRecord = [];
		$metaData = $this->getModelsMetaData();
		$dataTypes = $metaData->getDataTypes($this);
		$columnNames = $metaData->getAttributes($this);
		for ($i = 0; $i < count($columnNames); $i++) {
			$colName = strtolower(trim($columnNames[$i]));
			$jsonColName = $this->jsonifyName($colName);
			$jsonRecord[$jsonColName] = self::value($this->{$colName}, $dataTypes[$colName]);
		}
		return $jsonRecord;
	}
}
