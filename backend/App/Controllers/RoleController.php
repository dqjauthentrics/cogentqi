<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\Role;

class RoleController extends ControllerBase {

	/**
	 * Return a list.
	 */
	public function listAction() {
		$role = new Role();
		$data = [];
		$roles = $role->get(null,false,'id','1=1',[],[]);
		foreach ($roles as $role) {
			$data[$role->id] = ['appRoleId' => $role->app_role_id, 'name' => $role->name];
		}
		$result = new Result($this);
		$result->sendNormal($data);
	}

	/**
	 * Return a single record.
	 *
	 * @param string $id
	 */
	public function getAction($id) {
		$result = new Result($this);
		$role = new Role();
		$role = $role->get($id, FALSE);
		$role = $role->map();
		$result->sendNormal($role);
	}
}