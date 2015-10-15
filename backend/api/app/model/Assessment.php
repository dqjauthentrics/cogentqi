<?php
namespace App\Model;

use Nette\Database\Table\IRow,
	PDO,
	App\Components\DbContext;
use ResourcesModule\BasePresenter;

class Assessment extends BaseModel {

	public static $mappedColumns = [
		'id'                     => DbContext::TYPE_INT,
		'instrument_id'          => DbContext::TYPE_INT,
		'assessor_id'            => DbContext::TYPE_INT,
		'last_saved'             => DbContext::TYPE_DATETIME,
		'last_modified'          => DbContext::TYPE_DATETIME,
		'assessor_comments'      => DbContext::TYPE_STRING,
		'member_comments'        => DbContext::TYPE_STRING,
		'score'                  => DbContext::TYPE_REAL,
		'rank'                   => DbContext::TYPE_INT,
		'edit_status'            => DbContext::TYPE_STRING,
		'view_status'            => DbContext::TYPE_STRING,
		'instrument_schedule_id' => DbContext::TYPE_INT,
	];

	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $assessment
	 * @param bool                       $brief
	 *
	 * @return array
	 */
	public static function map($database, $assessment, $brief = TRUE) {
		$map = [];
		if (!empty($assessment)) {
			$map = parent::mapColumns($database, $assessment, self::$mappedColumns);
			$map['typ'] = @$assessment->instrument->question_type["name"];
		}
		return $map;
	}
}
