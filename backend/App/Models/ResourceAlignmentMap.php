<?php
namespace Cogent\Models;

class ResourceAlignmentMap extends CogentModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $resource_alignment_id;

	/**
	 *
	 * @var integer
	 */
	public $response;

	/**
	 *
	 * @var integer
	 */
	public $utility;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return ResourceAlignmentMap[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return ResourceAlignmentMap
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('resource_alignment_id', 'Cogent\Models\ResourceAlignment', 'id', ['alias' => 'Alignment']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'resource_alignment_map';
	}
}
