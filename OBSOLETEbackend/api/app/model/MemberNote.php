<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext,
	ResourcesModule\BasePresenter;

class MemberNote extends BaseModel {
	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $note
	 * @param int                        $mode
	 *
	 * @return array
	 */
	public static function map($database, $note, $mode = BasePresenter::MODE_LISTING) {
		$map = $database->map($note);
		$map["creator"] = $database->map($note->ref('member', 'creator_id'));
		return $map;
	}

}