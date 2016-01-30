<?php
namespace Cogent\Models;

use Phalcon\Mvc\Model\Relation;

class ResourceAlignment extends CogentModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $resource_id;

	/**
	 *
	 * @var integer
	 */
	public $question_id;

	/**
	 *
	 * @var integer
	 */
	public $weight;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return ResourceAlignment[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return ResourceAlignment
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('resource_id', 'Cogent\Models\Resource', 'id', ['alias' => 'Resource']);
		$this->belongsTo('question_id', 'Cogent\Models\Question', 'id', ['alias' => 'Question']);
		$this->hasMany('id', 'Cogent\Models\ResourceAlignmentMap', 'resource_alignment_id', [
				'foreignKey' => ['action' => Relation::ACTION_CASCADE],
				'alias' => 'Mapping'
		]);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'resource_alignment';
	}

	/**
	 * Set weight for the response to utility mapping
	 *
	 * @param int $response
     */
	public function setUtilityByResponse($response) {
		$this->weight = 0;
		foreach ($this->mapping as $map) {
			if ($map->response == $response) {
				$this->weight = $map->utility;
				return;
			}
		}
	}
}