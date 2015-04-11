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
			$dbRecords = $this->api->db->{$urlName}()->where("OrganizationId=?", $organizationId);
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

		$badgeRecords = $this->api->db->MemberBadge()->where('memberId', $member["id"]);
		$jsonBadges = [];
		$badge = new Badge($this->api);
		foreach ($badgeRecords as $badgeRecord) {
			$jsonBadges[] = $badge->map($badgeRecord);
		}
		$associative["badges"] = $jsonBadges;

		if (!strstr($_SERVER["REQUEST_URI"], "/organization")) {
			$evalRecords = $this->api->db->Assessment()->where('memberId', $member["id"])->order('lastModified DESC');
			$jsonEvals = [];
			$eval = new Assessment($this->api);
			foreach ($evalRecords as $evalRecord) {
				//$eval->mapExcludes = ["responses"];
				$jsonEvals[] = $eval->map($evalRecord);
			}
			$associative["assessments"] = $jsonEvals;

			$eventRecords = $this->api->db->OutcomeEvent()->where('memberId', $member["id"])->order('occurred DESC');
			$jsonEvents = [];
			foreach ($eventRecords as $eventRecord) {
				$jsonEvents[] = [
					'id'       => $eventRecord["id"],
					'occurred' => $this->dateTime($eventRecord["occurred"]),
					'outId'    => $eventRecord["outcomeId"],
					'name'     => $eventRecord["name"],
					'cat'      => $eventRecord["category"]
				];
			}
			$associative["events"] = $jsonEvents;

			$planRecords = $this->api->db->PlanItem()->where('memberId', $member["id"])->order('status_stamp DESC');
			$jsonPlanItems = [];
			$planItem = new PlanItem($this->api);
			foreach ($planRecords as $planRecord) {
				$jsonPlanItems[] = $planItem->map($planRecord);
			}
			$associative["planItems"] = $jsonPlanItems;
		}
		else {
			$lastEval = $this->api->db->Assessment()->where('memberId', $member["id"])->order('lastModified DESC')->fetch();
			$associative["lastEval"] = ["id" => $lastEval["id"],
										"dt" => $this->dateTime($lastEval["lastModified"]),
										"sr" => $lastEval["rank"],
										"sc" => $lastEval["score"],
										"i" => $lastEval["instrumentId"]
			];
		}

		return $associative;
	}
}