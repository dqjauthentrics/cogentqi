<?php
namespace App\Model;

use Nette\Database\Table\IRow,
	App\Components\DbContext,
	App\Instrument,
	App\InstrumentSchedule,
	ResourcesModule\BasePresenter,
	App\Model\Member;

class Assessment extends BaseModel {
	const STATUS_ACTIVE = 'A';
	const STATUS_LOCKED = 'L';

	public static $mappedColumns = [
		'id'                     => DbContext::TYPE_INT,
		'instrument_id'          => DbContext::TYPE_INT,
		'assessor_id'            => DbContext::TYPE_INT,
		'last_saved'             => DbContext::TYPE_DATETIME,
		'last_modified'          => DbContext::TYPE_DATETIME,
		'assessor_comments'      => DbContext::TYPE_STRING,
		'member_comments'        => DbContext::TYPE_STRING,
		'score'                  => DbContext::TYPE_REAL,
		'rank'                   => DbContext::TYPE_INT,
		'edit_status'            => DbContext::TYPE_STRING,
		'view_status'            => DbContext::TYPE_STRING,
		'instrument_schedule_id' => DbContext::TYPE_INT,
	];

	/**
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $assessment
	 * @param int                        $mode
	 *
	 * @return array
	 */
	public static function map($database, $assessment, $mode = BasePresenter::MODE_LISTING) {
		$map = [];
		if (!empty($assessment)) {
			switch ($mode) {
				case BasePresenter::MODE_LISTING:
					$map = parent::mapColumns($database, $assessment, self::$mappedColumns);
					$map['typ'] = @$assessment->ref('instrument')->question_type["name"];
					$member = $assessment->ref('member');
					$map['member'] = $database->map($member);
					$map["member"]["lastAssessment"] = Member::mapLastAssessment($database, $member, $mode);
					$map['assessor'] = $database->map($assessment->ref('member', 'assessor_id'));
					break;
				default:
					$map = self::full($database, $assessment);
			}
			$map['typ'] = @$assessment->ref('instrument')->question_type["name"];
			$member = $assessment->ref('member');
			$map['member'] = $database->map($member);
			$map["member"]["lastAssessment"] = Member::mapLastAssessment($database, $member, $mode);
			$map['assessor'] = $database->map($assessment->ref('member', 'assessor_id'));
		}
		return $map;
	}

	/**
	 * Fill and return a complete assessment record in JSON form using abbreviated column names to save transmission costs.
	 *
	 * @param \App\Components\DbContext  $database
	 * @param \Nette\Database\Table\IRow $assessment
	 *
	 * @return array
	 */
	private static function full($database, $assessment) {
		$map = parent::mapColumns($database, $assessment, self::$mappedColumns);
		$responses = [];
		if (!empty($assessment)) {
			/** @var IRow $instrument */
			$instrument = $assessment->ref('instrument');
			$map['instrument'] = $database->map($instrument);
			$responses = $assessment->related('assessment_response');
			foreach ($responses as $response) {
				$questionId = $response["question_id"];
				$typeId = $response->question->question_type["id"];
				$choiceRecords = $database->table('question_choice')->where('question_type_id=?', $typeId)->order('sort_order');
				/** @var IRow[] $choices */
				$choices = $database->mapRecords($choiceRecords);
				$responses[$questionId] = [
					'id' => (int)$response["id"],
					'r'  => $response["response"],
					'ri' => (int)$response["response_index"],
					'ac' => $response["assessor_comments"],
					'mc' => $response["member_comments"],
					'ch' => $choices
				];
			}
			$i = 0;
			$sections = $instrument->related('question_group');
			$sectionNames = [];
			foreach ($sections as $section) {
				$sectionNames[] = $section["tag"];
			}
			$nSections = count($sections);
			/** @var IRow $section */
			foreach ($sections as $section) {
				$nextPos = $i < $nSections - 1 ? $i + 1 : 0;
				$prevPos = $i > 0 ? $i - 1 : $nSections - 1;

				$next = ($nextPos + 1) . ". " . $sectionNames[$nextPos];
				$previous = ($prevPos + 1) . ". " . $sectionNames[$prevPos];

				$jsonSection = ['id' => $section["id"], 'number' => ($i + 1), 'name' => $section["tag"], 'next' => $next, 'previous' => $previous, 'questions' => []];
				$questions = $section->related('question');
				foreach ($questions as $question) {
					$jsonSection['questions'][] = [
						'id'  => $question["id"],
						'nmb' => $question["number"],
						'n'   => $question["name"],
						'sum' => $question["summary"],
						'dsc' => $question["description"],
						'rsp' => @$responses[$question["id"]],
						'typ' => $question->question_type["entry_type"],
						'mn'  => $question->question_type["min_range"],
						'mx'  => $question->question_type["max_range"],
					];
				}
				$i++;
				$map['instrument']['sections'][] = $jsonSection;
			}
		}
		return $map;
	}

	/**
	 * Create a new assessment.
	 *
	 * @param \App\Components\DbContext $database
	 * @param int                       $assessorId
	 * @param int                       $memberId
	 * @param InstrumentSchedule        $scheduleItem
	 *
	 * @return null
	 */
	private static function create($database, $assessorId, $memberId, $scheduleItem) {
		$assessment = NULL;
		$database->transaction = 'BEGIN';
		try {
			$data = [
				'id'                     => NULL,
				'member_id'              => $memberId,
				'assessor_id'            => $assessorId,
				'instrument_id'          => $scheduleItem["instrument_id"],
				'instrument_schedule_id' => $scheduleItem["id"],
				'edit_status'            => Assessment::STATUS_ACTIVE,
				'view_status'            => Assessment::STATUS_ACTIVE,
			];
			$assessment = $database->table('assessment')->insert($data);
			if (!empty($assessment)) {
				$responses = Instrument::createResponseTemplate($database, $scheduleItem["instrument_id"], $assessment["id"]);
				if (!empty($responses)) {
					$assessment = $database->table('assessment')->where("id=?", $assessment["id"])->fetch();
					if (!empty($assessment)) {
						$database->transaction = 'COMMIT';
					}
				}
				else {
					throw new \Exception("Unable to create assessment responses.");
				}
			}
			else {
				throw new \Exception(json_encode($database->pdo->errorInfo()));
			}
		}
		catch (\Exception $exception) {
			$database->transaction = 'ROLLBACK';
		}
		return $assessment;
	}

}
