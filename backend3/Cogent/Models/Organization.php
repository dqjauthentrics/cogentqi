<?php
namespace Cogent\Models;

class Organization extends CogentModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $parent_id;

	/**
	 *
	 * @var string
	 */
	public $name;

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
	 * @var string
	 */
	public $address;

	/**
	 *
	 * @var string
	 */
	public $phone;

	/**
	 *
	 * @var string
	 */
	public $fax;

	/**
	 *
	 * @var string
	 */
	public $city;

	/**
	 *
	 * @var string
	 */
	public $state;

	/**
	 *
	 * @var string
	 */
	public $postal;

	/**
	 *
	 * @var integer
	 */
	public $is_department;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Organization[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Organization
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Member', 'organization_id', ['alias' => 'Member']);
		$this->hasMany('id', 'Organization', 'parent_id', ['alias' => 'Organization']);
		$this->hasMany('id', 'OrganizationOutcome', 'organization_id', ['alias' => 'OrganizationOutcome']);
		$this->belongsTo('parent_id', 'Organization', 'id', ['alias' => 'Organization']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'organization';
	}

	/**
	 * Retrieve and return a set of organization IDs, comma-delimited.
	 *
	 * @param int $id
	 *
	 * @return mixed
	 */
	public function getDescendantIds($id) {
		$row = parent::getReadConnection()->query("SELECT retrieveOrgDescendantIds($id) AS orgIds")->fetch();
		$orgIds = $row["orgIds"];
		return $orgIds;
	}
}
