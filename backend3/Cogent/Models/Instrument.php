<?php
namespace Cogent\Models;

/**
 * Class Instrument
 * @package Cogent\Models
 *
 * @method QuestionType getQuestionType()
 * @method Instrument|Instrument[] get($id = NULL, $mapIt = TRUE, $orderBy = 'id DESC', $where = '1=1', $whereParams = [])
 * @method \Phalcon\Mvc\Model\Resultset\Simple getSchedule()
 */
class Instrument extends CogentModel {

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
	 * @var string
	 */
	public $summary;

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
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Cogent\Models\Assessment', 'instrument_id', ['alias' => 'Assessments']);
		$this->hasMany('id', 'Cogent\Models\InstrumentSchedule', 'instrument_id', ['alias' => 'Schedule']);
		$this->hasMany('id', 'Cogent\Models\QuestionGroup', 'instrument_id', ['alias' => 'QuestionGroups']);
		$this->belongsTo('role_id', 'Cogent\Models\AppRole', 'id', ['alias' => 'AppRole']);
		$this->belongsTo('usage_id', 'Cogent\Models\AlgorithmUsage', 'id', ['alias' => 'AlgorithmUsage']);
		$this->belongsTo('question_type_id', 'Cogent\Models\QuestionType', 'id', ['alias' => 'QuestionType']);
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
	public function map($options = ['questions' => TRUE]) {
		$mapped = parent::map();
		if (!empty($options['questions'])) {
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

	/**
	 * @param int $instrumentId
	 * @param int $assessmentId
	 *
	 * @return array
	 */
	public static function createResponseTemplate($instrumentId, $assessmentId) {
		$questions = Question::query()
			->where('question_group_id IN (SELECT id FROM Cogent\Models\QuestionGroup WHERE instrument_id=:id:)', ['id' => $instrumentId])
			->orderBy('sort_order')
			->execute();
		$responses = [];
		foreach ($questions as $question) {
			$responseInfo = [
				'assessment_id'  => $assessmentId,
				'question_id'    => $question->id,
				'response'       => NULL,
				'response_index' => NULL,
			];
			$response = new AssessmentResponse();
			$responses[] = $response->update($responseInfo);
		}
		return $responses;
	}

}
