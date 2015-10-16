<?php
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext;
use ResourcesModule\BasePresenter;

class Outcome extends BaseModel {

	/**
	 * @param \App\Components\DbContext  $db
	 * @param \Nette\Database\Table\IRow $outcome
	 * @param bool                       $brief
	 *
	 * @return array
	 */
	public static function map($db, $outcome, $singleOrganizationId = NULL, $brief = TRUE) {
		$map = $db->map($outcome);
		$jsonAlignments = [];
		foreach ($db->table('outcome_alignment')->where('outcome_id', $outcome["id"]) as $alignmentRecord) {
			$jsonAlignments[] = $db->map($alignmentRecord);
		}
		$map["alignments"] = $jsonAlignments;

		$jsonOutcomeLevels = [];
		if (!empty($singleOrganizationId)) {
			$dbRecords = $db->table('organization_outcome')->where('organization_id=?', $singleOrganizationId)->fetchAll(); //->order('outcomeId');
			foreach ($dbRecords as $dbRecord) {
				$outId = (int)$dbRecord["outcome_id"];
				$jsonOutcomeLevels[$outId] = (int)$dbRecord["level"];
			}
		}
		else {
			$dbRecords = $db->table('organization_outcome')->fetchAll(); //->order('organizationId,outcomeId');
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