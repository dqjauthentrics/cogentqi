<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
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
		else {
			$instrument = $lastAssessment->ref('instrument');
			$schedule = $lastAssessment->ref('instrument_schedule');
			$mapped['instrument'] = $database->map($instrument);
			$mapped['schedule'] = $database->map($schedule);
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
			$assessments = $database->table('assessment')->where("member_id=?", $member["id"])->order("last_modified DESC")->fetchAll();
			foreach ($assessments as $databaseRecord) {
				$jsonAssessments[] = Assessment::map($database, $databaseRecord, BasePresenter::MODE_RELATED);
			}
			$map["assessments"] = $jsonAssessments;
		}
		return $map;
	}

}