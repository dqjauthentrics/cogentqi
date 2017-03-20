<?php
namespace App\Models;

class AlgorithmUsage extends AppModel {
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
		$this->hasMany('id', 'Instrument', 'usage_id', ['alias' => 'Instrument']);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'algorithm_usage';
	}

}
