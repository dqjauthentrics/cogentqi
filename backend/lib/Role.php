<?php
namespace App;

class Role extends Model {
	const SYSADMIN = 'S';

	public function map($role) {
		$user = $this->api->user();
		if ($user["roleId"] != self::SYSADMIN && $role["id"] == self::SYSADMIN) {
			$associative = NULL;
		}
		else {
			$associative = ['id' => $role["id"], 'n' => $role["name"]];
		}
		return $associative;
	}
}
