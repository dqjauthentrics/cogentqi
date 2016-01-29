<?php
namespace Cogent\Models;

/**
 * Class Resource
 * @package Cogent\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple getAlignments()
 * @method \Cogent\Models\OutcomeAlignment[]|\Cogent\Models\OutcomeAlignment get($id = NULL, $mapIt = TRUE)
 */
class Resource extends CogentModel {
	const STATUS_ACTIVE = 'A';
	const STATUS_LOCKED = 'L';

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var string
	 */
	public $resource_type_id;

	/**
	 *
	 * @var string
	 */
	public $role_ids;

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
	public $location;

	/**
	 *
	 * @var string
	 */
	public $summary;

	/**
	 *
	 * @var string
	 */
	public $description;

	/**
	 *
	 * @var integer
	 */
	public $creator_id;

	/**
	 *
	 * @var string
	 */
	public $create_on;

	/**
	 *
	 * @var string
	 */
	public $last_modified;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Resource[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Resource
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Cogent\Models\Module', 'resource_id', ['alias' => 'Modules']);
		$this->hasMany('id', 'Cogent\Models\ResourceAlignment', 'resource_id', ['alias' => 'Alignments']);
		$this->belongsTo('resource_type_id', 'Cogent\Models\ResourceType', 'id', ['alias' => 'ResourceType']);
		$this->belongsTo('creator_id', 'Cogent\Models\Member', 'id', ['alias' => 'Creator']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'resource';
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = ['alignments' => TRUE]) {
		$map = parent::map();
		$map["rsc"] = 0;
		$map["sc"] = 0;
		if (!empty($options['alignments'])) {
			$alignments = $this->getAlignments();
			$jsonAlignments = [];
			/** @var OutcomeAlignment $alignment */
			foreach ($alignments as $alignment) {
                $mappedAlignment = $alignment->map();
				$mappedAlignment['mapping'] = [];
				foreach ($alignment->mapping as $m) {
					$mappedAlignment['mapping'][] = [
						'response' => $m->response,
						'utility' => $m->utility
					];
				}
				$jsonAlignments[] = $mappedAlignment;

			}
			$map["alignments"] = $jsonAlignments;
		}
		return $map;
	}
}
