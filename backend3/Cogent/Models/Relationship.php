<?php
namespace Cogent\Models;

class Relationship extends CogentModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $superior_id;

	/**
	 *
	 * @var integer
	 */
	public $subordinate_id;

	/**
	 *
	 * @var string
	 */
	public $relationship_type_id;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Relationship[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Relationship
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->belongsTo('superior_id', 'Member', 'id', ['alias' => 'Superior', 'foreignKey' => TRUE]);
		$this->belongsTo('subordinate_id', "Member", 'id', ['alias' => 'Subordinate', 'foreignKey' => TRUE]);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'relationship';
	}

}
