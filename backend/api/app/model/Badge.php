<?php
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext;

class Badge extends BaseModel {
	public $id;
	public $title;
	public $member_id;
	public $earned;

	public static $mappedColumns = ['id', 'title', 'earned'];

	/**
	 * @param \App\Components\DbContext $database
	 * @param                           $badge
	 *
	 * @return array
	 */
	public static function map($database, $badge) {
		$map = [];
		foreach (self::$mappedColumns as $colname) {
			$map[$database->jsonName($colname)] = @$badge['id'];
		}
		return $map;
	}
}
