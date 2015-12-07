<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Module;

class ModuleController extends ControllerBase {

	/**
	 * Return a list.
	 */
	public function indexAction() {
		$module = new Module();
		$data = $module->get();
		$result = new Result($this);
		$result->sendNormal($data);
	}

	/**
	 * Return a single record.
	 *
	 * @param int $id
	 */
	public function getAction($id) {
		$result = new Result($this);
		$module = new Module();
		$module = $module->get($id, FALSE);
		$module = $module->map();
		$result->sendNormal($module);
	}
}