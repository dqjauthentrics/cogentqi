<?php
namespace App;

class Setting extends Model {

	public function initializeRoutes() {
		//parent::initializeRoutes();

		$this->api->get("/setting", function () {
			$settings = [
				['id' => 1, 'n' => 'setting1', 'v' => 42],
				['id' => 2, 'n' => 'setting2', 'v' => 'hello'],
				['id' => 3, 'n' => 'setting3', 'v' => 'there'],
				['id' => 4, 'n' => 'setting4', 'v' => 'dave'],
			];
			echo json_encode($settings);
		});
	}
}
