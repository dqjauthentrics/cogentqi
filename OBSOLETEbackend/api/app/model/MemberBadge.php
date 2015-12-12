<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext;

class MemberBadge extends BaseModel {
	public static $mappedColumns = ['id', 'title', 'earned'];

	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $badge
	 *
	 * @return array
	 */
	public static function map($database, $badge) {
		$map = [];
		foreach (self::$mappedColumns as $colname) {
			$jsonCol = $database->jsonCol($colname);
			$map[$jsonCol[0]] = @$badge[$colname];
		}
		return $map;
	}
}
