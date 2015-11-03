<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Presenters;

use App\Components\AjaxResult;
use ResourcesModule\BasePresenter;

class MessagePresenter extends BasePresenter {

	public function actionRead($id, $mode = self::MODE_LISTING) {
		echo "message";
		exit();
	}

	public function actionCreate() {
		$result = new AjaxResult();
		try {
			$data = @$_POST;
			$memberId = @$data["memberId"];
			$message = @$data["message"];
			if (!empty($memberId) && !empty($message)) {
				$member = $this->database->table('member')->get($memberId);
				if (TRUE || !empty($member)) {
					if (TRUE || (!empty($member["mobile"]) && !empty($member["message_format"]))) {
						$number = str_replace('{n}', $member["mobile"], $member["message_format"]);
						$number = '6072277351@vtext.com'; //@todo dqj hard-coded text messaging
						$headers = "From: dqj@cogentqi.com \r\n";
						if (mail($number, NULL, $message, $headers)) {
							$result->data = "The text message has been sent. ($message)";
							$result->status = AjaxResult::STATUS_OKAY;
						}
						else {
							$result->data = "Unable to send the text message.";
						}
					}
					else {
						$result->data = "Unable to locate the member in the database.";
					}
				}
				else {
					$result->data = "The member does not have a mobile number or provider specified.";
				}
			}
		}
		catch (\Exception $exception) {
			$result->data = "Unable to send text message: " . $exception->getMessage();
		}
		$this->sendResult($result);
		exit();
	}

}