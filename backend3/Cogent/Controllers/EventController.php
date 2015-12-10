<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Event;

class EventController extends ControllerBase {
	/**
	 * Return a list.
	 */
	public function indexAction() {
		$event = new Event();
		$data = $event->get();
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
		$event = new Event();
		$event = $event->get($id, FALSE);
		$event = $event->map();
		$result->sendNormal($event);
	}

	private function getQuestions($events) {
		$questions = [];
		foreach ($events as $event) {

		}
	}

	public function actionUpdate() {
		$result = new Result();
		try {
			$data = $this->getInputData();
		}
		catch (\Exception $exception) {
				$result->setError(Result::CODE_EXCEPTION, "Unable to send text message: " . $exception->getMessage());
			}
		$result->sendNormal();
	}
}