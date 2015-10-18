<?php
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext,
	ResourcesModule\BasePresenter;

class Member extends BaseModel {
	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $member
	 * @param int                        $mode
	 *
	 * @return array
	 */
	public static function mapLastAssessment($database, $member, $mode = BasePresenter::MODE_LISTING) {
		$lastAssessment = $database->table('assessment')->where('member_id', $member["id"])->order('last_modified DESC')->fetch();
		$mapped = $database->map($lastAssessment);
		if (empty($mapped)) {
			$mappped = NULL;
		}
		return $mapped;
	}

	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $member
	 * @param int                        $mode
	 *
	 * @return array
	 */
	public static function map($database, $member, $mode = BasePresenter::MODE_LISTING) {
		$map = $database->map($member);
		$role = $member->ref('role');
		$map['role'] = $role["name"];
		$map['rn'] = $role["name"];
		$map['ari'] = $role["app_role_id"];
		$badgeRecords = $member->related('member_badge');
		$jsonBadges = [];
		/** @var IRow $badgeRecord */
		foreach ($badgeRecords as $badgeRecord) {
			$jsonBadges[] = MemberBadge::map($database, $badgeRecord);
		}
		$map["badges"] = $jsonBadges;
		$map["lastAssessment"] = self::mapLastAssessment($database, $member);
		if ($mode != BasePresenter::MODE_LISTING) {
			$jsonAssessments = [];
			foreach ($database->table('assessment')->where("member_id=?", $member["id"])->order("last_modified DESC") as $databaseRecord) {
				$jsonAssessments[] = [
					'id'       => (int)$databaseRecord["id"],
					'ii'       => (int)$databaseRecord["instrument_id"],
					'asi'      => (int)$databaseRecord["assessor_id"],
					'isi'      => (int)$databaseRecord["instrument_schedule_id"],
					'mi'       => (int)$databaseRecord["member_id"],
					'lm'       => $database->presentationDateTime($databaseRecord["last_modified"]),
					'sc'       => (double)$databaseRecord["score"],
					'rk'       => (int)$databaseRecord["rank"],
					'es'       => $databaseRecord["edit_status"],
					'vs'       => $databaseRecord["view_status"],
					'typ'      => @$databaseRecord->ref('instrument')->question_type["name"],
					'assessor' => $database->map($databaseRecord->ref('member', 'assessor_id'))
				];
			}
			$map["assessments"] = $jsonAssessments;
		}
		return $map;
	}

}