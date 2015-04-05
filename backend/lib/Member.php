<?php
namespace App;
require_once "../lib/Evaluation.php";
require_once "../lib/Badge.php";
require_once "../lib/OutcomeEvent.php";

class Member extends Model {

	function initialize() {
		parent::initialize();

		$urlName = $this->urlName();
		$this->api->get("/$urlName/organization/:orgId", function ($orgId = NULL) use ($urlName) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->{$urlName}()->where("organization_id=?", $orgId);
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
		$associative = parent::map($member);

		$badgeRecords = $this->api->db->member_badge()->where('member_id', $member["id"]);
		$jsonBadges = [];
		$badge = new Badge($this->api);
		foreach ($badgeRecords as $badgeRecord) {
			$jsonBadges[] = $badge->map($badgeRecord);
		}
		$associative["badges"] = $jsonBadges;

		if (!strstr($_SERVER["REQUEST_URI"], "/organization")) {
			$evalRecords = $this->api->db->evaluation()->where('member_id', $member["id"])->order('last_modified DESC');
			$jsonEvals = [];
			$eval = new Evaluation($this->api);
			foreach ($evalRecords as $evalRecord) {
				$eval->mapExcludes = ["responses"];
				$jsonEvals[] = $eval->map($evalRecord);
			}
			$associative["evaluations"] = $jsonEvals;

			$eventRecords = $this->api->db->outcome_event()->where('member_id', $member["id"])->order('occurred DESC');
			$jsonEvents = [];
			foreach ($eventRecords as $eventRecord) {
				$eval->mapExcludes = ["responses"];
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
			foreach ($planRecords as $planRecord) {
				$moduleName = $planRecord->learning_module->resource["name"];
				$jsonPlanItems[] = [
					'm'  => $planRecord["learning_module_id"],
					's'  => $planRecord["status"],
					'dt' => $this->dateTime($planRecord["status_stamp"]),
					'n'  => $moduleName,
					'r'  => $planRecord->learning_module["resource_id"]
				];
			}
			$associative["planItems"] = $jsonPlanItems;
		}
		else {
			$lastEval = $this->api->db->evaluation()->where('member_id', $member["id"])->order('last_modified DESC')->fetch();
			$associative["lastEval"] = ["id" => $lastEval["id"],
										"dt" => $this->dateTime($lastEval["last_modified"]),
										"sr" => $lastEval["score_rank"],
										"sc" => $lastEval["score"],
										"i" => $lastEval["instrument_id"]
			];
		}

		return $associative;
	}
}