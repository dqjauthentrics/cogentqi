<?php
namespace App\Controllers;

use App\Components\Result;
use App\Models\MemberEvent;
use App\Models\Organization;


class MemberEventController extends ControllerBase {
	/**
	 * Return a list.
	 */
	public function listAction($organizationId, $eventId) {
		$data = [];
		$model = new Organization();
		$orgIds = $model->getDescendantIds($organizationId);
		$typWhere = !empty($eventId)? "AND e.id=$eventId":"";
		$sql = "SELECT me.id, me.occurred, m.first_name, m.middle_name, m.last_name, m.id AS memberId, m.role_id, me.event_id
			FROM member_event me, event e, member m
			WHERE me.event_id=e.id AND me.member_id=m.id AND m.organization_id IN ($orgIds) $typWhere";
		$dbRecords = $model->getReadConnection()->query($sql)->fetchAll();
		if (!empty($dbRecords)) {
			foreach ($dbRecords as $dbRecord) {
				$dataRec = [
					'id'       => $dbRecord['id'],
					'eventId'  => $dbRecord['event_id'],
					'occurred' => $dbRecord['occurred'],
					'member'   => [
						'id'         => $dbRecord['memberId'],
						'roleId'     => $dbRecord['role_id'],
						'firstName'  => $dbRecord['first_name'],
						'lastName'   => $dbRecord['last_name'],
						'middleName' => $dbRecord['middle_name'],
					]
				];
				$data[] = $dataRec;
			}
		}
		$result = new Result($this);
		$result->sendNormal($data);
	}

	/**
	 * Return a single event.
	 *
	 * @param string $id
	 */
	public function singleAction($id) {
		$result = new Result($this);
		$event = new MemberEvent();
		$event = $event->get($id, FALSE);
		$event = $event->map();
		$result->sendNormal($event);
	}

	/**
	 * @param int $organizationId
	 */
	public function yearAction($organizationId) {
		$eventModel = new MemberEvent();
		$result = $eventModel->getYear($organizationId);
		$result->sendNormal();
	}

	/**
	 * @param int $organizationId
	 */
	public function yearAverageAction($organizationId) {
		$eventModel = new MemberEvent();
		$result = $eventModel->getYearAverage($organizationId);
		$result->sendNormal();
	}

	/**
	 * @param int $organizationId
	 * @param int $typeId
	 */
	public function typesAction($organizationId, $typeId=0) {
		$eventModel = new MemberEvent();
		$result = $eventModel->getTypes($organizationId, $typeId);
		$result->sendNormal();
	}
}