<?php
namespace App\Models;

/**
 * Class Question
 * @package App\Models
 *
 * @method QuestionType getType()
 * @method QuestionGroup getGroup()
 * @method ResourceAlignment[] getResourceAlignments()
 * @method \Phalcon\Mvc\Model\Resultset\Simple|AssessmentResponse[] getResponses()
 *
 * @property QuestionType                                             $type
 * @property QuestionGroup                                            $group
 * @property \Phalcon\Mvc\Model\Resultset\Simple|ResourceAlignment[]  $resourceAlignments
 * @property \Phalcon\Mvc\Model\Resultset\Simple|AssessmentResponse[] $responses
 *
 */
class Question extends AppModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $question_group_id;

	/**
	 *
	 * @var integer
	 */
	public $question_type_id;

	/**
	 *
	 * @var integer
	 */
	public $sort_order;

	/**
	 *
	 * @var string
	 */
	public $number;

	/**
	 *
	 * @var string
	 */
	public $name;

	/**
	 *
	 * @var string
	 */
	public $full_text;

	/**
	 *
	 * @var integer
	 */
	public $importance;

	/**
	 *
	 * @var string
	 */
	public $outcome_threshold;

	/**
	 *
	 * @var string
	 */
	public $event_threshold;

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'App\Models\AssessmentResponse', 'question_id', ['alias' => 'Responses']);
		$this->hasMany('id', 'App\Models\OutcomeAlignment', 'question_id', ['alias' => 'OutcomeAlignments']);
		$this->hasMany('id', 'App\Models\ResourceAlignment', 'question_id', ['alias' => 'ResourceAlignments']);
		$this->belongsTo('question_group_id', 'App\Models\QuestionGroup', 'id', ['alias' => 'Group']);
		$this->belongsTo('question_type_id', 'App\Models\QuestionType', 'id', ['alias' => 'Type']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'question';
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = ['lastAssessment' => TRUE, 'badges' => TRUE, 'assessments' => FALSE, 'minimal' => FALSE]) {
		$map = parent::map();
		$map['type'] = $this->getType()->map();
		return $map;
	}
}
