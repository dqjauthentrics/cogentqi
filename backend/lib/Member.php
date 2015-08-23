<?php
namespace App;
require_once "../lib/Assessment.php";
require_once "../lib/Badge.php";
require_once "../lib/OutcomeEvent.php";
require_once "../lib/PlanItem.php";

class Member extends Model {

	function initialize() {
		parent::initialize();

		$urlName = $this->urlName();
		$this->api->get("/$urlName/organization/:organizationId", function ($organizationId = NULL) use ($urlName) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->{$this->tableName}()->where("organization_id=?", $organizationId);
			foreach ($dbRecords as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});
	}

	/**
	 * @param array $member
	 *
	 * @return array
	 */
	public function map($member) {
		$this->mapExcludes = ["username", "password"];
		$associative = parent::map($member);
		$associative['role'] = $member->role["name"];

		$badgeRecords = $this->api->db->member_badge()->where('member_id', $member["id"]);
		$jsonBadges = [];
		$badge = new Badge($this->api);
		foreach ($badgeRecords as $badgeRecord) {
			$jsonBadges[] = $badge->map($badgeRecord);
		}
		$associative["badges"] = $jsonBadges;

		if (!strstr($_SERVER["REQUEST_URI"], "/organization")) {
			$evalRecords = $this->api->db->assessment()->where('member_id', $member["id"])->order('last_modified DESC');
			$jsonEvals = [];
			$eval = new Assessment($this->api);
			foreach ($evalRecords as $evalRecord) {
				//$eval->mapExcludes = ["responses"];
				$jsonEvals[] = $eval->map($evalRecord);
			}
			$associative["assessments"] = $jsonEvals;

			$eventRecords = $this->api->db->outcome_event()->where('member_id', $member["id"])->order('occurred DESC');
			$jsonEvents = [];
			foreach ($eventRecords as $eventRecord) {
				$jsonEvents[] = [
					'id'       => $eventRecord["id"],
					'occurred' => $this->dateTime($eventRecord["occurred"]),
					'outId'    => $eventRecord["outcome_id"],
					'name'     => $eventRecord["name"],
					'cat'      => $eventRecord["category"]
				];
			}
			$associative["events"] = $jsonEvents;

			$planRecords = $this->api->db->plan_item()->where('member_id', $member["id"])->order('status_stamp DESC');
			$jsonPlanItems = [];
			$planItem = new PlanItem($this->api);
			foreach ($planRecords as $planRecord) {
				$jsonPlanItems[] = $planItem->map($planRecord);
			}
			$associative["planItems"] = $jsonPlanItems;
		}
		else {
			$lastAssessment = $this->api->db->assessment()->where('member_id', $member["id"])->order('last_modified DESC')->fetch();
			if (!empty($lastAssessment)) {
				$associative["lastAssessment"] = [
					'id'  => (int)$lastAssessment["id"],
					'lm'  => Model::dateTime($lastAssessment["last_modified"]),
					'ls'  => Model::dateTime($lastAssessment["last_saved"]),
					'ac'  => $lastAssessment["assessor_comments"],
					'mc'  => $lastAssessment["member_comments"],
					'sc'  => $lastAssessment["score"],
					'rk'  => $lastAssessment["rank"],
					'es'  => $lastAssessment["edit_status"],
					'vs'  => $lastAssessment["view_status"],
					'typ' => @$lastAssessment->instrument->question_type["name"],
				];
			}
			else {
				$associative["lastAssessment"] = NULL;
			}
		}

		return $associative;
	}
}