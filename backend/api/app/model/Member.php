<?php
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext;
use ResourcesModule\BasePresenter;

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
	 * @param bool                       $brief
	 *
	 * @return array
	 */
	public static function map($db, $member, $brief = TRUE) {
		$memberMap = $db->map($member);
		$memberMap['role'] = $member["role"]["name"];
		$memberMap['rn'] = $member["role"]["name"];
		$memberMap['ari'] = $member["role"]["app_role_id"];
		$badgeRecords = $db->table('member_badge')->where('member_id', $member["id"]);
		$jsonBadges = [];
		foreach ($badgeRecords as $badgeRecord) {
			$jsonBadges[] = Badge::map($db, $badgeRecord);
		}
		$memberMap["badges"] = $jsonBadges;
		$lastAssessment = $db->table('assessment')->where('member_id', $member["id"])->order('last_modified DESC')->fetch();
		$memberMap["lastAssessment"] = Assessment::map($db, $lastAssessment);
		return $memberMap;
	}

}