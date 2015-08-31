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
		$associative = parent::map($dbRecord);
		$qType = $dbRecord->question_type["entry_type"];
		$associative["typeName"] = $qType;
		return $associative;
	}
}