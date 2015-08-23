<?php
/**
 * Created by PhpStorm.
 * User: dqj
 * Date: 3/21/15
 * Time: 11:12 PM
 */

namespace App;

class QuestionChoice extends Model {

	public function mapList($choices) {
		$list = [];
		if (!empty($choices)) {
			foreach ($choices as $choice) {
				$list[] = $this->map($choice);
			}
		}
		return $list;
	}

	public function map($choice) {
		$mapped = [];
		if (!empty($choice)) {
			$mapped = ['n' => $choice['name'], 'r' => $choice['rubric'], 'i' => $choice['icon_prefix']];
		}
		return $mapped;
	}
}