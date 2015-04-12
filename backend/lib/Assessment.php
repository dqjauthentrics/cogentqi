<?php
namespace App;
require_once("AssessmentResponse.php");


class Assessment extends Model {

	public function initializeRoutes() {
		$urlName = $this->urlName();

		/**
		 * Full, single assessment retrieval.  Save time and loading by assembling everything on server for a single request, and by using abbreviated field names.
		 */
		$this->api->get("/$urlName/:assessmentId", function ($assessmentId) use ($urlName) {
			$jsonRecords = [
				'id',
				'member'     => [],
				'assessor'   => [],
				'instrument' => '',
				'sections'   => []
			];
			$responses = [];
			$assessment = $this->api->db->assessment()->where("id=?", $assessmentId)->fetch();
			if (!empty($assessment)) {
				$jsonRecords = [
					'id'         => (int)$assessment["id"],
					'lm'         => Model::dateTime($assessment["last_modified"]),
					'ls'         => Model::dateTime($assessment["last_saved"]),
					'ac'         => $assessment["assessor_comments"],
					'mc'         => $assessment["member_comments"],
					'sc'         => $assessment["score"],
					'rk'         => $assessment["rank"],
					'es'         => $assessment["edit_status"],
					'vs'         => $assessment["view_status"],
					'member'     => [
						'id' => (int)$assessment["member_id"],
						'av' => $assessment->member["avatar"],
						'fn' => $assessment->member["first_name"],
						'ln' => $assessment->member["last_name"],
						'ri' => $assessment->member["role_id"],
						'jt' => $assessment->member["job_title"],
						'lv' => $assessment->member["level"],
						'rl' => @$assessment->member->role["name"]
					],
					'assessor'   => [
						'id' => (int)$assessment["assessor_id"],
						'av' => $assessment->assessor["avatar"],
						'fn' => $assessment->assessor["first_name"],
						'ln' => $assessment->assessor["last_name"],
						'ri' => $assessment->assessor["role_id"],
						'jt' => $assessment->assessor["job_title"],
						'rl' => @$assessment->assessor->role["name"]
					],
					'instrument' => [
						'id'       => (int)$assessment["instrument_id"],
						'max'      => (int)$assessment->instrument["max_range"],
						'min'      => (int)$assessment->instrument["min_range"],
						'nm'       => $assessment->instrument["name"],
						'sections' => [
						]
					]
				];
				foreach ($assessment->assessment_response() as $response) {
					$questionId = $response["question_id"];
					$responses[$questionId] = [
						'id' => (int)$response["id"],
						'r'  => $response["response"],
						'ri' => (int)$response["response_index"],
						'ac' => $response["assessor_comments"],
						'mc' => $response["member_comments"],
					];
				}
				$i = 0;
				$sections = $assessment->instrument->question_group();
				$sectionNames = [];
				foreach ($sections as $section) {
					$sectionNames[] = $section["tag"];
				}
				$nSections = count($sections);
				foreach ($sections as $section) {

					$nextPos = $i < $nSections - 1 ? $i + 1 : 0;
					$prevPos = $i > 0 ? $i - 1 : $nSections - 1;

					$next = ($nextPos + 1) . ". " . $sectionNames[$nextPos];
					$previous = ($prevPos + 1) . ". " . $sectionNames[$prevPos];

					$jsonSection = ['id' => $section["id"], 'number' => ($i + 1), 'name' => $section["tag"], 'next' => $next, 'previous' => $previous, 'questions' => []];
					foreach ($section->question() as $question) {
						$jsonSection['questions'][] = [
							'id'  => $question["id"],
							'nb'  => $question["number"],
							'nm'  => $question["name"],
							'sum' => $question["summary"],
							'dsc' => $question["description"],
							'rsp' => $responses[$question["id"]],
							'typ' => $question->question_type["name"]
						];
					}
					$i++;
					$jsonRecords['instrument']['sections'][] = $jsonSection;
				}
			}
			$this->api->sendResult($jsonRecords);
		});

		/**
		 * Save a single record, which is a full evaluation as returned by the get above.
		 */
		$this->api->post("/$urlName", function () {
			$jsonPostData = json_decode(file_get_contents('php://input'));
			$assessment = $jsonPostData->assessment;
			$assessmentRecord = $this->api->db->assessment()->where('id=?', $assessment->id)->fetch();
			if (!empty($assessmentRecord)) {
				$assessmentRecord["score"] = $assessment->sc;
				$assessmentRecord["rank"] = $assessment->rk;
				$assessmentRecord["last_saved"] = "NOW()";
				$assessmentRecord["assessor_comments"] = $assessment->ac;
				$assessmentRecord["member_comments"] = $assessment->mc;
				$assessmentRecord["edit_status"] = $assessment->es;
				$assessmentRecord["view_status"] = $assessment->vs;
				$assessmentRecord->update();
				$sections = $assessment->instrument->sections;
				if (!empty($sections)) {
					foreach ($sections as $section) {
						if (!empty($section->questions)) {
							foreach ($section->questions as $question) {
								$record = $this->api->db->assessment_response()
									->where('assessment_id=? AND question_id=?', $jsonPostData->assessment->id, $question->id)
									->fetch();
								if (!empty($record)) {
									$record["response_index"] = (int)$question->rsp->ri;
									$record["response"] = $question->rsp->r;
									//secho "SET: " . $question->id . ":" . $record["response_index"] . ":" . $record["response"] . "\n";
									$record->update();
								}
							}
						}
					}
				}
				$this->api->sendResult("saved");
			}
			else {
				$this->api->sendResult("not saved");
			}
		});


		/**
		 * Get all assessments for an organization, ordered by most recent at top.
		 */
		$this->api->get("/$urlName/organization/:orgId", function ($organizationId = NULL) use ($urlName) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->assessment()->where("member_id IN (SELECT id FROM Member WHERE organization_id=?)", $organizationId)->order("last_modified DESC");
			foreach ($dbRecords as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});

		/**
		 * Get all assessments for a given member.
		 */
		$this->api->get("/$urlName/member/:memberId", function ($memberId) use ($urlName) {
			$jsonRecords = [];
			foreach ($this->api->db->assessment()->where("member_id=?", $memberId)->order("last_modified DESC") as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});

		/**
		 * Get a matrix of assessment values for all members in an organization.
		 */
		$this->api->get("/$urlName/matrix/:orgId/:instrumentId", function ($organizationId, $instrumentId) use ($urlName) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->assessment()->select('member_id,max(last_modified) as maxMod')
				->where('instrument_id=? AND member_id IN (SELECT id FROM member WHERE organization_id=?)', $instrumentId, $organizationId)
				->group('member_id');
			$maxes = [];
			foreach ($dbRecords as $dbRecord) {
				$maxes[$dbRecord["member_id"]] = $dbRecord["maxMod"];
			}

			$dbRecords = $this->api->db->assessment()->where("instrument_id=? AND member_id IN (SELECT id FROM member WHERE organization_id=?)", $instrumentId, $organizationId);
			foreach ($dbRecords as $dbRecord) {
				if ($dbRecord["last_modified"] == $maxes[$dbRecord["member_id"]]) {
					$responses = [];
					$memberId = $dbRecord["member_id"];
					/** @todo These are not sorted by question sortOrder!!! */
					$responseRecords = $this->api->db->assessment_response()->where("assessment_id=?", $dbRecord["id"]);
					foreach ($responseRecords as $responseRecord) {
						$responses[] = (int)$responseRecord["response_index"];
					}
					$jsonRecords[] = ['memberId' => $memberId, 'responses' => $responses];
				}
			}
			$this->api->sendResult($jsonRecords);
		});

		/**
		 * Get a matrix of values for all organizations, calculating average values over their members.
		 */
		$this->api->get("/$urlName/matrix/rollup/:organizationId/:instrumentId", function ($organizationId, $instrumentId) use ($urlName) {
			$jsonRecords = [];
			$instrumentId = (int)$instrumentId;
			$organizationId = (int)$organizationId;

			$sql = "SELECT m.organization_id, o.name, ar.question_id, AVG(ar.response_index) AS response
					FROM assessment_response ar, assessment a, member m, organization o, question q
					WHERE a.instrument_id=$instrumentId AND a.member_id=m.id AND
						m.organization_id IN (SELECT id FROM organization WHERE parent_id=$organizationId) AND ar.assessment_id=a.id AND m.organization_id=o.id
						AND q.id=ar.question_id
					GROUP BY m.organization_id, o.name, ar.question_id ORDER BY q.sort_order";
			$dbRecords = $this->api->pdo->query($sql);
			$responseSets = [];
			$orgNames = [];
			if (!empty($dbRecords)) {
				foreach ($dbRecords as $dbRecord) {
					$orgId = $dbRecord["organization_id"];
					if (empty($responseSets[$orgId])) {
						$responseSets[$orgId] = [];
						$orgNames[$orgId] = '';
					}
					$responseSets[$orgId][] = (double)number_format($dbRecord["response"], 1);
					$orgNames[$orgId] = $dbRecord["name"];
				}
				foreach ($responseSets as $orgId => $responses) {
					$jsonRecords[] = ['organizationId' => $orgId, 'name' => $orgNames[$orgId], 'responses' => $responses];
				}
			}
			echo json_encode($jsonRecords);
		});
	}

	/**
	 * Override base method to indicate which columns are date/time.
	 */
	public function initialize() {
		$this->dateTimeCols = ['last_saved', 'last_modified'];
		parent::initialize();
	}

	/**
	 * @todo This may/should be superfluous now.
	 *
	 * @param array $assessment
	 *
	 * @return array
	 */
	public function map($assessment) {
		$associative = [
			'id'       => (int)$assessment["id"],
			'lm'       => Model::dateTime($assessment["last_modified"]),
			'ls'       => Model::dateTime($assessment["last_saved"]),
			'ac'       => $assessment["assessor_comments"],
			'mc'       => $assessment["member_comments"],
			'sc'       => $assessment["score"],
			'rk'       => $assessment["rank"],
			'es'       => $assessment["edit_status"],
			'vs'       => $assessment["view_status"],
			'ii'       => $assessment["instrument_id"],
			'assessor' => [
				'id' => (int)$assessment["assessor_id"],
				'av' => $assessment->assessor["avatar"],
				'fn' => $assessment->assessor["first_name"],
				'ln' => $assessment->assessor["last_name"],
				'ri' => $assessment->assessor["role_id"],
				'jt' => $assessment->assessor["job_title"],
				'rl' => @$assessment->assessor->role["name"]
			],
		];

		$total = 0;
		$nItems = 0;
		$responses = [];
		$records = $this->api->db->assessment_response()->where("assessment_id=?", $assessment["id"]);
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