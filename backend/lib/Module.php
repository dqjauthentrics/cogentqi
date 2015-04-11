<?php
namespace App;

class Module extends Model {
	public function initialize() {
		$this->dateTimeCols = ['starts', 'ends'];
		parent::initialize();
	}

}
