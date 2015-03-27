<?php
namespace App;
require_once "../lib/Evaluation.php";
require_once "../lib/Badge.php";

class Member extends Model {

	function initialize() {
		parent::initialize();

		$urlName = $this->urlName();
		$this->api->get("/$urlName/organization/:orgId/role/:roleId", function ($orgId = NULL, $role = NULL) use ($urlName) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->{$urlName}()->where("role_id=? AND organization_id=?", $role, $orgId);
			foreach ($dbRecords as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});
		$this->api->get("/$urlName/organization/:orgId", function ($orgId = NULL) use ($urlName) {
			$jsonRecords = [];
			foreach ($this->api->db->{$urlName}()->where("organization_id=?", $orgId) as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
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
	 *
	 * @return array
	 */
	public function map($member) {
		$associative = parent::map($member);

		$badgeRecords = $this->api->db->member_badge()->where('member_id', $member["id"]);
		$jsonBadges = [];
		$badge = new Badge($this->api);
		foreach ($badgeRecords as $badgeRecord) {
			$jsonBadges[] = $badge->map($badgeRecord);
		}
		$associative["badges"] = $jsonBadges;
		$evalRecords = $this->api->db->evaluation()->where('member_id', $member["id"])->order('last_modified DESC');
		$jsonEvals = [];
		$eval = new Evaluation($this->api);
		foreach ($evalRecords as $evalRecord) {
			$eval->mapExcludes = ["responses"];
			$jsonEvals[] = $eval->map($evalRecord);
		}
		$associative["evaluations"] = $jsonEvals;
		return $associative;
	}
}