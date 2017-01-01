<?php
namespace App\Models;

class Organization extends AppModel {

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
	 *
	 * @var integer
	 */
	public $external_id;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Organization[]|\Phalcon\Mvc\Model[]|\Phalcon\Mvc\Model\ResultInterface[]|\Phalcon\Mvc\Model\ResultsetInterface
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Organization|\Phalcon\Mvc\Model
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
		$this->hasMany('id', 'OutcomeReport', 'organization_id', ['alias' => 'OutcomeReport']);
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

	/**
	 * @param int $id
	 *
	 * @return string
	 */
	public function getMemberIds($id) {
		$row = parent::getReadConnection()
			->query('SELECT GROUP_CONCAT(id) AS memberIds FROM member WHERE organization_id = :id', ['id' => $id])->fetch();
		return $row["memberIds"];
	}
}
