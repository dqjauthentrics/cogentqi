<?php
namespace App;

class Setting extends Model {

	public function initializeRoutes() {
		//parent::initializeRoutes();

		$this->api->get("/setting", function () {
			$settings = [
				['id' => 1, 'n' => 'Enable Email Notifications for Me', 'v' => 0],
				['id' => 2, 'n' => 'Share My Development Badges on Facebook', 'v' => 1],
				['id' => 3, 'n' => 'Notify Me When Development Resources are Added or Updated', 'v' => 1],
			];
			echo json_encode($settings);
		});
	}
}
