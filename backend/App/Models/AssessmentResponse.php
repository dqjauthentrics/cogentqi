<?php
namespace Cogent\Models;

/**
 * Class AssessmentResponse
 * @package Cogent\Models
 *
 * @method Question getQuestion()
 * @method Resource getResource
 * @method Assessment getAssessment
 *
 * @property Question   $question
 * @property Resource   $recommendedResource
 * @property Assessment $assessment
 *
 */
class AssessmentResponse extends CogentModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $assessment_id;

	/**
	 *
	 * @var integer
	 */
	public $question_id;

	/**
	 *
	 * @var string
	 */
	public $response;

	/**
	 *
	 * @var string
	 */
	public $assessor_comments;

	/**
	 *
	 * @var string
	 */
	public $member_comments;

	/**
	 *
	 * @var integer
	 */
	public $response_index;

	/**
	 *
	 * @var double
	 */
	public $outcome_value = 0.0;

	/**
	 *
	 * @var double
	 */
	public $event_value = 0.0;

	/**
	 *
	 * @var integer
	 */
	public $recommended_resource_id = NULL;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return AssessmentResponse[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return AssessmentResponse
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('recommended_resource_id', '\Cogent\Models\Resource', 'id', ['alias' => 'RecommendedResource']);
		$this->belongsTo('assessment_id', '\Cogent\Models\Assessment', 'id', ['alias' => 'Assessment']);
		$this->belongsTo('question_id', '\Cogent\Models\Question', 'id', ['alias' => 'Question']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'assessment_response';
	}

}
