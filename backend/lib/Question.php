<?php
/**
 * Created by PhpStorm.
 * User: dqj
 * Date: 3/21/15
 * Time: 11:12 PM
 */

namespace App;

class Question extends Model {

	/**
	 * @param \NotORM_Result $dbRecord
	 *
	 * @return array
	 */
	public function map($dbRecord) {
		$associative = parent::map($dbRecord);
		$qType = $dbRecord->question_type["entry_type"];
		$associative["typeName"] = $qType;
		return $associative;
	}
}