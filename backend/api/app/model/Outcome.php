<?php
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext;
use ResourcesModule\BasePresenter;

class Outcome extends BaseModel {

	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $outcome
	 * @param int                        $mode
	 * @param int                        $singleOrganizationId
	 *
	 * @return array
	 */
	public static function map($database, $outcome, $mode = BasePresenter::MODE_LISTING, $singleOrganizationId = NULL) {
		$map = $database->map($outcome);
		$jsonAlignments = [];
		foreach ($database->table('outcome_alignment')->where('outcome_id', $outcome["id"]) as $alignmentRecord) {
			$jsonAlignments[] = $database->map($alignmentRecord);
		}
		$map["alignments"] = $jsonAlignments;
		$jsonOutcomeLevels = [];
		if (!empty($singleOrganizationId)) {
			$dbRecords = $database->table('organization_outcome')->where('organization_id=?', $singleOrganizationId)->fetchAll(); //->order('outcomeId');
			foreach ($dbRecords as $dbRecord) {
				$outId = (int)$dbRecord["outcome_id"];
				$jsonOutcomeLevels[$outId] = (int)$dbRecord["level"];
			}
		}
		else {
			$dbRecords = $database->table('organization_outcome')->fetchAll(); //->order('organizationId,outcomeId');
			foreach ($dbRecords as $dbRecord) {
				$organizationId = (int)$dbRecord["organization_id"];
				$outId = (int)$dbRecord["outcome_id"];
				if (empty($jsonOutcomeLevels[$organizationId])) {
					$jsonOutcomeLevels[$organizationId] = [];
				}
				$jsonOutcomeLevels[$organizationId][$outId] = (int)$dbRecord["level"];
			}
		}
		$map["levels"] = $jsonOutcomeLevels;
		return $map;
	}
}