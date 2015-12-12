<?php
/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext;
use ResourcesModule\BasePresenter;

class Event extends BaseModel {

	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $event
	 * @param int                        $mode
	 *
	 * @return array
	 */
	public static function map($database, $event, $mode = BasePresenter::MODE_LISTING) {
		$map = $database->map($event);
		$jsonAlignments = [];
		foreach ($database->table('event_alignment')->where('event_id', $event["id"]) as $alignmentRecord) {
			$jsonAlignments[] = $database->map($alignmentRecord);
		}
		$map["alignments"] = $jsonAlignments;
		return $map;
	}
}