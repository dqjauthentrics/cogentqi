<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext,
	ResourcesModule\BasePresenter;

class Resource extends BaseModel {
	const STATUS_ACTIVE = 'A';
	const STATUS_LOCKED = 'L';

	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $resource
	 * @param int                        $mode
	 *
	 * @return array
	 */
	public static function map($database, $resource, $mode = BasePresenter::MODE_LISTING) {
		$map = $database->map($resource);
		$map["rsc"] = 0;
		$map["sc"] = 0;
		if ($mode !== BasePresenter::MODE_LISTING) {
			$alignmentRecords = $resource->related('resource_alignment');
			$jsonAlignments = [];
			foreach ($alignmentRecords as $alignmentRecord) {
				$mapped = $database->map($alignmentRecord);
				$jsonAlignments[] = $mapped;
			}
			$map["alignments"] = $jsonAlignments;
		}
		return $map;
	}
}
