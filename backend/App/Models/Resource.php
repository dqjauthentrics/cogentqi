<?php
namespace App\Models;

/**
 * Class Resource
 * @package App\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple getAlignments()
 */
class Resource extends AppModel {
	const STATUS_ACTIVE = 'A';
	const STATUS_LOCKED = 'L';

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $badge_id;

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
	 *
	 * @var integer
	 */
	public $external_id;

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'App\Models\Module', 'resource_id', ['alias' => 'Modules']);
		$this->hasMany('id', 'App\Models\ResourceAlignment', 'resource_id', ['alias' => 'Alignments']);
		$this->belongsTo('resource_type_id', 'App\Models\ResourceType', 'id', ['alias' => 'ResourceType']);
		$this->belongsTo('creator_id', 'App\Models\Member', 'id', ['alias' => 'Creator']);
		$this->belongsTo('badge_id', 'App\Models\Badge', 'id', ['alias' => 'Badge']);
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
						'utility'  => $m->utility
					];
				}
				$jsonAlignments[] = $mappedAlignment;

			}
			$map["alignments"] = $jsonAlignments;
		}
		return $map;
	}
}
