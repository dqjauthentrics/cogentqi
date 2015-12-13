<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Model;

use Nette\Database\Table\IRow,
	ResourcesModule\BasePresenter;

class Organization extends BaseModel {

	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $member
	 * @param int                        $mode
	 *
	 * @return array
	 */
	public static function map($database, $member, $mode = BasePresenter::MODE_LISTING) {
		return $database->map($member);
	}
}
