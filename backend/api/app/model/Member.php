<?php
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext,
	ResourcesModule\BasePresenter;

class Member extends BaseModel {
	/**
	 * @param \App\Components\DbContext  $db
	 * @param \Nette\Database\Table\IRow $member
	 * @param int                        $mode
	 *
	 * @return array
	 */
	public static function mapLastAssessment($db, $member, $mode = BasePresenter::MODE_LISTING) {
		$lastAssessment = $db->table('assessment')->where('member_id', $member["id"])->order('last_modified DESC')->fetch();
		$mapped = $db->map($lastAssessment);
		if (empty($mapped)) {
			$mappped = NULL;
		}
		return $mapped;
	}

	/**
	 * @param \App\Components\DbContext  $db
	 * @param \Nette\Database\Table\IRow $member
	 * @param int                        $mode
	 *
	 * @return array
	 */
	public static function map($db, $member, $mode = BasePresenter::MODE_LISTING) {
		$map = $db->map($member);
		$role = $member->ref('role');
		$map['role'] = $role["name"];
		$map['rn'] = $role["name"];
		$map['ari'] = $role["app_role_id"];
		$badgeRecords = $member->related('member_badge');
		$jsonBadges = [];
		/** @var IRow $badgeRecord */
		foreach ($badgeRecords as $badgeRecord) {
			$jsonBadges[] = MemberBadge::map($db, $badgeRecord);
		}
		$map["badges"] = $jsonBadges;
		$map["lastAssessment"] = self::mapLastAssessment($db, $member);
		if ($mode != BasePresenter::MODE_LISTING) {
			$jsonAssessments = [];
			foreach ($db->table('assessment')->where("member_id=?", $member["id"])->order("last_modified DESC") as $dbRecord) {
				$jsonAssessments[] = [
					'id'  => (int)$dbRecord["id"],
					'ii'  => (int)$dbRecord["instrument_id"],
					'asi' => (int)$dbRecord["assessor_id"],
					'isi' => (int)$dbRecord["instrument_schedule_id"],
					'mi'  => (int)$dbRecord["member_id"],
					'lm'  => $db->presentationDateTime($dbRecord["last_modified"]),
					'sc'  => (double)$dbRecord["score"],
					'rk'  => (int)$dbRecord["rank"],
					'es'  => $dbRecord["edit_status"],
					'vs'  => $dbRecord["view_status"],
				];
			}
			$map["assessments"] = $jsonAssessments;
		}
		return $map;
	}

}