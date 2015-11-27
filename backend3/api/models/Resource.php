<?php
namespace Api\Models;

class Resource extends ApiModel {
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
		$this->hasMany('id', 'Module', 'resource_id', ['alias' => 'Module']);
		$this->hasMany('id', 'ResourceAlignment', 'resource_id', ['alias' => 'ResourceAlignment']);
		$this->belongsTo('resource_type_id', 'ResourceType', 'id', ['alias' => 'ResourceType']);
		$this->belongsTo('creator_id', 'Member', 'id', ['alias' => 'Member']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'resource';
	}

}
