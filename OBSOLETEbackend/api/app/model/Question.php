<?php
/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext;
use ResourcesModule\BasePresenter;

class Question extends BaseModel {

	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $event
	 * @param int                        $mode
	 *
	 * @return array
	 */
	public static function map($database, $question, $mode = BasePresenter::MODE_LISTING) {
		$map = $database->map($question);
		return $map;
	}
}