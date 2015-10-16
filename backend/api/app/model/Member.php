<?php
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext,
	ResourcesModule\BasePresenter;

class Member extends BaseModel {
	var $id;
	var $first_name;
	var $last_name;
	var $organization_id;
	var $role_id;
	var $job_title;
	var $email;
	var $username;
	var $password;
	var $avatar;
	var $level;
	var $is_assessable;
	var $address;
	var $phone;
	var $mobile;

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
		$map["lastAssessment"] = self::mapLastAssessment($db, $member, $mode);
		return $map;
	}

}