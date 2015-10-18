<?php
namespace App\Presenters;

use ResourcesModule\BasePresenter;

class MessagePresenter extends BasePresenter {

	public function actionSend() {
		$result = NULL;
		try {
			$result = mail('6072277351@vtext.com', '', 'Hello from the CogentQI app!');
		}
		catch (\Exception $exception) {
			echo $exception->getMessage();
		}
		echo $result == TRUE ? 1 : 0;
		exit();
	}

}