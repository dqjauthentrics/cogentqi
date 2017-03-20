<?php
namespace App\Models;

class ResourceType extends AppModel {

	/**
	 *
	 * @var string
	 */
	public $id;

	/**
	 *
	 * @var string
	 */
	public $name;

	/**
	 *
	 * @var string
	 */
	public $description;

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		$this->hasMany('id', 'Resource', 'resource_type_id', ['alias' => 'Resource']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'resource_type';
	}

}
