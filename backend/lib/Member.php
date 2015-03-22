<?php
namespace App;
require_once "../lib/Badge.php";

class Member extends Model {

	function __construct($api) {
		parent::__construct($api);

		$urlName = $this->urlName();
		$api->get("/$urlName/organization/:orgId/role/:roleId", function ($orgId = NULL, $role = NULL) use ($api, $urlName) {
			$jsonRecords = [];
			$dbRecords = $api->db->{$urlName}()->where("role_id=? AND organization_id=?", $role, $orgId);
			foreach ($dbRecords as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$api->sendResult($jsonRecords);
		});
		$api->get("/$urlName/organization/:orgId", function ($orgId = NULL) use ($api, $urlName) {
			$jsonRecords = [];
			foreach ($api->db->{$urlName}()->where("organization_id=?", $orgId) as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$api->sendResult($jsonRecords);
		});
	}

	function randomDate($start_date, $end_date) {
		$min = strtotime($start_date);
		$max = strtotime($end_date);
		$val = rand($min, $max);
		return date('Y-m-d H:i:s', $val);
	}

	/**
	 * @param array $member
	 * @param bool  $full
	 *
	 * @return array
	 */
	public function map($member, $full = TRUE) {
		$associative = parent::map($member);
		$associative["lastEvalStamp"] = $this->randomDate("2015-01-01", "2015-04-21");

		if ($full) {
			$badgeRecords = $this->api->db->member_badge()->where('member_id', $member["id"]);
			$jsonBadges = [];
			$badge = new Badge($this->api);
			foreach ($badgeRecords as $badgeRecord) {
				$jsonBadges[] = $badge->map($badgeRecord);
			}
			$associative["badges"] = $jsonBadges;
		}
		return $associative;
	}
}