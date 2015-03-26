<?php
/**
 * Created by PhpStorm.
 * User: dqj
 * Date: 3/21/15
 * Time: 11:12 PM
 */

namespace App;

class Question extends Model {

	public function map($dbRecord) {
		$jsonRecord = [];
		try {
			$columnNames = array_keys(iterator_to_array($dbRecord));
			for ($i = 0; $i < count($columnNames); $i++) {
				$colName = $columnNames[$i];
				if (empty($this->mapExcludes) || !in_array($colName, $this->mapExcludes)) {
					$jsonName = $this->colNameToJsonName($colName);

					//if (iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($dbRecord[$colName])) !== $dbRecord[$colName]) {
					//	echo "COLUMN: $colName"; exit();
					//}

					//$jsonRecord[$jsonName] = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($dbRecord[$colName]));
					$jsonRecord[$jsonName] = $dbRecord[$colName];
				}
			}
		}
		catch (\Exception $exception) {
			var_dump($exception);
		}
		return $jsonRecord;
	}

}