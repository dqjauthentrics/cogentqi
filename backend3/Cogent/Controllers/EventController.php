<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Event;
use Cogent\Models\EventAlignment;

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

	/**
	 * Update a single event record.
	 */
	public function actionUpdate() {
		$result = new Result();
		try {
			$data = $this->getInputData();
			$result->setNormal();
			$result->message = "TBD: Not yet implemented.";
		}
		catch (\Exception $exception) {
			$result->setError(Result::CODE_EXCEPTION, "Unable to send text message: " . $exception->getMessage());
		}
		$result->sendNormal();
	}

	/**
	 * Update a single event record.
	 */
	public function actionDelete() {
		$result = new Result();
		try {
			$data = $this->getInputData();
			$eventId = $data['eventId'];
			$event = Event::findFirst($eventId);
			if (!empty($event)) {
				$event->delete();
				$result->setNormal();
			}
			else {
				$result->setError(Result::CODE_NOT_FOUND);
			}
		}
		catch (\Exception $exception) {
			$result->setError(Result::CODE_EXCEPTION, "Unable to send text message: " . $exception->getMessage());
		}
		$result->sendNormal();
	}

	/**
	 * @param int              $eventId
	 * @param int              $questionId
	 * @param EventAlignment[] $alignments
	 *
	 * @return EventAlignment|null
	 */
	private function findAlignment($eventId, $questionId, $alignments) {
		if (!empty($alignments)) {
			foreach ($alignments as $alignment) {
				if ($alignment->question_id == $questionId && $alignment->event_id == $eventId) {
					return $alignment;
				}
			}
		}
		return NULL;
	}

	/**
	 * Save given alignments for given event record.
	 */
	public function saveAlignmentsAction() {
		$result = new Result($this);
		try {
			$data = $this->getInputData();
			if (!empty($data["eventId"]) && !empty($data["instrumentId"]) && !empty($data["alignments"])) {
				$eventId = $data["eventId"];
				$instrumentId = $data["instrumentId"];
				$formAlignments = $data["alignments"];
				if (!empty($formAlignments)) {
					/** @var EventAlignment[] $alignments */
					$alignments = EventAlignment::query()->where('event_id=:id:', ['id' => $eventId])->execute();
					foreach ($formAlignments as $questionId => $weight) {
						$dbRecord = $this->findAlignment($eventId, $questionId, $alignments);
						if (!empty($dbRecord)) {
							if (empty($weight)) {
								$dbRecord->delete();
							}
							else {
								$dbRecord->update(['weight' => $weight]);
							}
						}
						else {
							if (!empty($weight)) {
								$alignment = ['event_id' => $eventId, 'question_id' => $questionId, 'weight' => $weight];
								$dbRecord = new EventAlignment();
								$dbRecord->save($alignment);
							}
						}
					}
				}
				$result->setNormal();
			}
		}
		catch (\Exception $exception) {
			$result->sendError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal();
	}
}