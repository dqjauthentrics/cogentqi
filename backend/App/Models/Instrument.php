<?php
namespace App\Models;

/**
 * Class Instrument
 * @package App\Models
 *
 */
class Instrument extends AppModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var string
	 */
	public $name;

	/**
	 *
	 * @var string
	 */
	public $role_id;

	/**
	 *
	 * @var string
	 */
	public $usage_id;

	/**
	 *
	 * @var string
	 */
	public $description;

	/**
	 *
	 * @var integer
	 */
	public $is_uniform;

	/**
	 *
	 * @var integer
	 */
	public $question_type_id;

	/**
	 *
	 * @var integer
	 */
	public $max_range;

	/**
	 *
	 * @var integer
	 */
	public $min_range;

	/**
	 *
	 * @var integer
	 */
	public $sort_order;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Instrument[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Instrument
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * @param int|null $id
	 * @param bool     $mapIt
	 * @param string   $orderBy
	 * @param string   $where
	 * @param array    $whereParams
	 *
	 * @return array|\App\Models\AppModel|\App\Models\AppModel[]|null
	 */
	public function get($id = NULL, $mapIt = TRUE, $orderBy = 'id', $where = "status='A'", $whereParams = []) {
		return parent::get($id, $mapIt, $orderBy, $where, $whereParams);
	}

	/**
	 * @param int $instrumentId
	 * @param int $assessmentId
	 *
	 * @return array
	 */
	public static function createResponseTemplate($instrumentId, $assessmentId) {
		$questionGroups = QuestionGroup::find(['conditions' => 'instrument_id=:id:', 'bind' => ['id' => $instrumentId], 'order' => 'sort_order']);
		$responses = [];
		foreach ($questionGroups as $questionGroup) {
			$questions = $questionGroup->getQuestions(['order' => 'sort_order']);
			if (!empty($questions)) {
				foreach ($questions as $question) {
					$responseInfo = [
						'assessment_id'  => $assessmentId,
						'question_id'    => $question->id,
						'response'       => NULL,
						'response_index' => NULL,
					];
					$response = new AssessmentResponse();
					$responses[] = $response->save($responseInfo);
				}
			}
		}
		return $responses;
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'App\Models\Assessment', 'instrument_id', ['alias' => 'Assessments']);
		$this->hasMany('id', 'App\Models\InstrumentSchedule', 'instrument_id', ['alias' => 'Schedule']);
		$this->hasMany('id', 'App\Models\QuestionGroup', 'instrument_id', ['alias' => 'QuestionGroups']);
		$this->belongsTo('role_id', 'App\Models\AppRole', 'id', ['alias' => 'AppRole']);
		$this->belongsTo('usage_id', 'App\Models\AlgorithmUsage', 'id', ['alias' => 'AlgorithmUsage']);
		$this->belongsTo('question_type_id', 'App\Models\QuestionType', 'id', ['alias' => 'QuestionType']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'instrument';
	}

	/**
	 * @return array
	 */
	public function map($options = ['minimal' => FALSE]) {
		$mapped = parent::map();
		if (empty($options['minimal'])) {
			$choices = QuestionChoice::query()->where('question_type_id=:qtid:', ['qtid' => $this->question_type_id])->orderBy('sort_order')->execute();
			$jsonQuestionChoices = [];
			/** @var QuestionChoice $choice */
			foreach ($choices as $choice) {
				$jsonQuestionChoices[] = $choice->map();
			}
			$mapped["questionChoices"] = $jsonQuestionChoices;

			$groups = QuestionGroup::query()->where('instrument_id=:id:', ['id' => $this->id])->orderBy('sort_order')->execute();
			$jsonGroups = [];
			$jsonQuestions = [];
			$jsonAligns = [];
			/** @var QuestionGroup $group */
			foreach ($groups as $group) {
				$jsonGroups[] = $group->map();
				$questions = $group->getQuestions(); //@todo ->order('sort_order');
				/** @var Question $question */
				foreach ($questions as $question) {
					$jsonQuestions[] = $question->map();
					$resAlignments = $question->getResourceAlignments();
					/** @var ResourceAlignment $resAlignment */
					foreach ($resAlignments as $resAlignment) {
						$jsonAligns[] = $resAlignment->map();
					}
				}
			}
			$mapped["questionGroups"] = $jsonGroups;
			$mapped["questions"] = $jsonQuestions;
			$mapped["alignments"] = $jsonAligns;
		}
		$mapped["typeName"] = $this->getQuestionType()->name;
		return $mapped;
	}

}
