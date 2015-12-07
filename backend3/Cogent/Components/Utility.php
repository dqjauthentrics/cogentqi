<?php
namespace Cogent\Components;

class Utility {

	public static function arrayRemoveByKey($removeKey, $arr) {
		$newArray = [];
		foreach ($arr as $key => $val) {
			if ($key != $removeKey) {
				$newArray[$key] = $val;
			}
		}
		return $newArray;
	}

}