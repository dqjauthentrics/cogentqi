<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\Member;
use App\Models\Message;

class MessageController extends ControllerBase {

	/**
	 * Return a list.
	 */
	public function indexAction() {
		$message = new Message();
		$data = $message->get();
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
		$message = new Message();
		$message = $message->get($id, FALSE);
		$message = $message->map();
		$result->sendNormal($message);
	}

	/**
	 * Send a message to the given user with the given contents.
	 */
	public function sendAction() {
		$result = new Result();
		try {
			$data = $this->getInputData();
			$memberId = @$data["memberId"];
			$message = @$data["message"];
			if (!empty($memberId) && !empty($message)) {
				$member = Member::findFirst($memberId);
				if (!empty($member)) {
					if ((!empty($member->mobile) && !empty($member->message_format))) {
						$number = str_replace('{n}', $member->mobile, $member->message_format);
						$number = '6072277351@vtext.com'; //@todo dqj hard-coded text messaging
						$headers = "From: dqj@cogentqi.com \r\n";
						if (mail($number, NULL, $message, $headers)) {
							$result->setNormal("The text message has been sent. ($message)");
						}
						else {
							$result->setError(Result::CODE_EXCEPTION, "Unable to send the text message.");
						}
					}
					else {
						$result->setError(Result::CODE_NOT_FOUND, "Unable to locate the member in the database.");
					}
				}
				else {
					$result->setError(Result::CODE_NOT_FOUND, "The member does not have a mobile number or provider specified.");
				}
			}
		}
		catch (\Exception $exception) {
			$result->setError(Result::CODE_EXCEPTION, "Unable to send text message: " . $exception->getMessage());
		}
		$result->sendNormal();
	}
}