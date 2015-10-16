<?php
namespace App\Model;

use \Nette\Database,
	\Nette\Database\Table\IRow,
	ResourcesModule\BasePresenter,
	App\Components\DbContext;

class BaseModel {


	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $record
	 * @param array                      $mappedColumns
	 *
	 * @return array
	 */
	public static function mapColumns($database, $record, $mappedColumns) {
		$map = [];
		foreach ($mappedColumns as $colName => $dataType) {
			$value = $database->value(@$record[$colName], $dataType);
			$jsonCol = $database->jsonCol($colName);
			$map[$jsonCol[0]] = $value;
		}
		return $map;
	}

}
