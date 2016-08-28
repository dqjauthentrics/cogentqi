<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\Event;
use App\Models\EventAlignment;
use App\Models\MemberEvent;
use Phalcon\Exception;

class EventController extends ControllerBase {
	/**
	 * Return a list.
	 */
	public function listAction() {
		$event = new Event();
		$data = $event->get();
		$result = new Result($this);
		$result->sendNormal($data);
	}

	/**
	 * Return a single event.
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
	 * Get alignments for event.
	 *
	 * @param int $eventId
	 */
	public function alignmentsAction($eventId) {
		$result = new Result($this);
		$event = new Event();
		$event = $event->get($eventId, FALSE);
		$alignments = [];
		foreach ($event->alignments as $alignment) {
			$alignments[] = $alignment->map();
		}
		$result->sendNormal($alignments);
	}

	/**
	 * Update a single event record.
	 */
	public function updateAction() {
		$result = new Result();
		try {
			$event = new Event();
			$data = $event->unmap($this->getInputData());
			if (array_key_exists('id', $data)) {
				$event = Event::findFirst($data['id']);
			}
			else {
				$event->id = NULL;
				$event->name = 'New Event';
				$event->description = 'description';
			}
			foreach ($data as $key => $value) {
				$event->$key = $value;
			}
			$success = $event->save();
			if ($success) {
				$result->setNormal();
				$result->data = ['id' => $event->id];
				$result->message = "Event updated.";
			}
			else {
				throw new Exception($event->errorMessagesAsString());
			}
		}
		catch (\Exception $exception) {
			$result->setError(Result::CODE_EXCEPTION, "Event create/update error: " . $exception->getMessage());
		}
		$result->sendNormal();
	}

	/**
	 * Update a single event record.
	 */
	public function actionDelete($eventId) {
		$result = new Result();
		try {
			$data = $this->getInputData();
			$eventId = $data['eventId'];
			$event = Event::findFirst($eventId);
			if (!empty($event)) {
				$eventAlignments = EventAlignment::find([
					'conditions' => 'event_id = ?eId',
					'bind'       => ['eId' => $data['eventId']]
				]);
				foreach ($eventAlignments as $alignment) {
					$alignment->delete();
				}
				$memberEvents = MemberEvent::find([
					'conditions' => 'event_id = ?eId',
					'bind'       => ['eId' => $data['eventId']]
				]);
				foreach ($memberEvents as $memberEvent) {
					$memberEvent->delete();
				}
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
	 * Save given alignments for given event record.
	 */
	public function saveAlignmentsAction() {
		$result = new Result($this);
		try {
			$ea = new EventAlignment();
			$data = $this->getInputData();
			$eventId = $data['eventId'];
			$oldAlignments = EventAlignment::find([
				['event_id = :eId'],
				'bind' => ['eId' => $eventId]
			]);
			$newAlignments = [];
			foreach ($data['alignments'] as $alignment) {
				$newAlignments[] = $ea->unmap($alignment);
			}
			$updateIndex = 0;
			$deleteCount = count($oldAlignments) - count($newAlignments);
			for ($oldIndex = 0; $oldIndex < count($oldAlignments); $oldIndex++) {
				$alignment = $oldAlignments[$oldIndex];
				if ($deleteCount > 0) {
					$alignment->delete();
					$deleteCount--;
				}
				else {
					$new = $newAlignments[$updateIndex];
					$alignment->increment = $new['increment'];
					$alignment->question_id = $new['question_id'];
					$alignment->save();
					$updateIndex++;
				}
			}
			for ($newIndex = $updateIndex; $newIndex < count($newAlignments); $newIndex++) {
				$alignment = new EventAlignment();
				$new = $newAlignments[$newIndex];
				$alignment->increment = $new['increment'];
				$alignment->question_id = $new['question_id'];
				$alignment->event_id = $eventId;
				$alignment->save();
			}
			$result->setNormal();
		}
		catch (\Exception $exception) {
			$result->sendError(Result::CODE_EXCEPTION, $exception->getMessage());
		}
		$result->sendNormal();
	}
}