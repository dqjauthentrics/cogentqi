<?php
namespace App\Models;

class CogentModel extends \Phalcon\Mvc\Model {
	public $id = NULL; // syntactic sugar

	const TYPE_STRING = 0;
	const TYPE_DATE = 1;
	const TYPE_DATETIME = 2;
	const TYPE_INT = 3;
	const TYPE_REAL = 4;

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
	 * @param \Phalcon\Mvc\Model\Resultset\Simple|CogentModel[] $records
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
	 * @return CogentModel[]|CogentModel|array|null
	 */
	public function get($id = NULL, $mapIt = TRUE, $orderBy = 'id', $where = '1=1', $whereParams = []) {
		$data = !empty($id) ? NULL : [];
		/** @var CogentModel $record */
		if (empty($id)) {
			$records = $this->query()->where($where, $whereParams)->orderBy($orderBy)->execute();
			foreach ($records as $record) {
				$data[] = $record;
			}
		}
		else {
			$data = $this->findFirst($id);
		}
		return $data;
	}

	/**
	 * @param CogentModel[] $records
	 * @param int           $id
	 *
	 * @return CogentModel|null
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
}
