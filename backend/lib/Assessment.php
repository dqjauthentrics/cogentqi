<?php
namespace App;
require_once("AssessmentResponse.php");


class Assessment extends Model {

	public function initialize() {
		$this->dateTimeCols = ['last_saved', 'lastModified'];
		parent::initialize();

		/** @var \NotORM $assessmentModel */
		$assessmentModel = $this->api->db->Assessment();

		$urlName = $this->urlName();
		$this->api->get("/$urlName/:assessmentId", function ($assessmentId) use ($urlName) {
			$jsonRecords = ['responses' => []];
			$assessment = $this->api->db->Assessment()->where("id=?)", $assessmentId)->fetch();
			if (!empty($assessment)) {
				foreach ($assessment->AssessmentResponse as $response) {
					$jsonRecords['responses'][] = [
						'id' => $response["id"],
						'r'  => $response["response"],
						'ri' => $response["responseIndex"],
						'ac' => $response["assessorComments"],
						'mc' => $response["memberComments"],
					];
				}
			}
			$this->api->sendResult($jsonRecords);
		});

		$this->api->get("/$urlName/organization/:orgId", function ($organizationId = NULL) use ($urlName) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->Assessment()->where("memberId IN (SELECT id FROM Member WHERE organizationId=?)", $organizationId)->order("lastModified DESC");
			foreach ($dbRecords as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});

		$this->api->get("/$urlName/member/:memberId", function ($memberId) use ($urlName) {
			$jsonRecords = [];
			foreach ($this->api->db->Assessment()->where("memberId=?", $memberId) as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});

		$this->api->get("/$urlName/matrix/:orgId/:instrumentId", function ($organizationId, $instrumentId) use ($urlName) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->Assessment()->select('memberId,max(lastModified) as maxMod')
				->where('instrumentId=? AND memberId IN (SELECT id FROM Member WHERE organizationId=?)', $instrumentId, $organizationId)
				->group('memberId');
			$maxes = [];
			foreach ($dbRecords as $dbRecord) {
				$maxes[$dbRecord["memberId"]] = $dbRecord["maxMod"];
			}

			$dbRecords = $this->api->db->Assessment()->where("instrumentId=? AND memberId IN (SELECT id FROM Member WHERE organizationId=?)", $instrumentId, $organizationId);
			foreach ($dbRecords as $dbRecord) {
				if ($dbRecord["lastModified"] == $maxes[$dbRecord["memberId"]]) {
					$responses = [];
					$memberId = $dbRecord["memberId"];
					/** @todo These are not sorted by question sortOrder!!! */
					$responseRecords = $this->api->db->AssessmentResponse()->where("assessmentId=?", $dbRecord["id"]);
					foreach ($responseRecords as $responseRecord) {
						$responses[] = (int)$responseRecord["responseIndex"];
					}
					$jsonRecords[] = ['memberId' => $memberId, 'responses' => $responses];
				}
			}
			$this->api->sendResult($jsonRecords);
		});

		$this->api->get("/$urlName/matrix/rollup/:orgId/:instrumentId", function ($organizationId, $instrumentId) use ($urlName) {
			$jsonRecords = [];

			$sql = "SELECT m.organizationId,o.name,er.questionId, avg(er.responseIndex) AS response
					FROM AssessmentResponse er, Assessment e, member m, organization o, Question q
					WHERE e.instrumentId=$instrumentId AND e.memberId=m.id AND
						m.organizationId IN (SELECT id FROM organization WHERE parentId=$organizationId) AND er.assessmentId=e.id AND m.organizationId=o.id AND q.id=er.questionId
					GROUP BY m.organizationId, o.name, er.questionId ORDER BY q.sortOrder";
			$dbRecords = $this->api->pdo->query($sql);
			$responseSets = [];
			$orgNames = [];
			foreach ($dbRecords as $dbRecord) {
				$organizationId = $dbRecord["organizationId"];
				if (empty($responseSets[$organizationId])) {
					$responseSets[$organizationId] = [];
					$orgNames[$organizationId] = '';
				}
				$responseSets[$organizationId][] = (double)number_format($dbRecord["response"], 1);
				$orgNames[$organizationId] = $dbRecord["name"];
			}
			foreach ($responseSets as $organizationId => $responses) {
				$jsonRecords[] = ['organizationId' => $organizationId, 'name' => $orgNames[$organizationId], 'responses' => $responses];
			}
			echo json_encode($jsonRecords);
		});
	}

	/**
	 * @param array $assessment
	 *
	 * @return array
	 */
	public function map($assessment) {
		$associative = parent::map($assessment);

		$total = 0;
		$nItems = 0;
		$responses = [];
		$records = $this->api->db->AssessmentResponse()->where("assessmentId=?", $assessment["id"]);
		foreach ($records as $record) {
			if ($record["response"] > 0) {
				$nItems++;
				$total += (int)$record["response"];
			}
			$response = new AssessmentResponse($this->api);
			$responseMapped = $response->map($record);
			unset($responseMapped["assessmentId"]);
			$responses[] = $responseMapped;
		}
		if (!strstr($_SERVER["REQUEST_URI"], "/organization")) {
			if (empty($this->mapExcludes) || !in_array("responses", $this->mapExcludes)) {
				$associative["responses"] = $responses;
			}
		}
		$associative["sc"] = ($total > 0 && $nItems > 0 ? number_format($total / $nItems, 1) : 0);
		$associative["sr"] = round($associative["sc"]);
		return $associative;
	}
}