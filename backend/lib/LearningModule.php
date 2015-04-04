<?php
namespace App;

class LearningModule extends Model {
	public function initialize() {
		$this->dateTimeCols = ['starts', 'ends'];
		parent::initialize();
	}

}
