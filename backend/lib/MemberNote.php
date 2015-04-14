<?php
/**
 */

namespace App;

class MemberNote extends Model {

	function initializeRoutes() {
		parent::initializeRoutes();

		$urlName = $this->urlName();
		$this->api->get("/$urlName/member/:memberId", function ($memberId = NULL) {
			$jsonRecords = [];
			foreach ($this->api->db->{$this->tableName}->where('member_id=?', $memberId) as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});
	}

	function map($note) {
		$associative = [
			'id' => (int)$note["id"],
			'lm' => Model::dateTime($note["last_modified"]),
			'c'  => $note["content"],
			'p'  => $note["is_private"],
			'creator' => [
				'id' => (int)$note["creator_id"],
				'av' => $note->creator["avatar"],
				'fn' => $note->creator["first_name"],
				'ln' => $note->creator["last_name"],
				'ri' => $note->creator["role_id"],
				'jt' => $note->creator["job_title"],
				'rl' => @$note->creator->role["name"]
			],
		];
		return $associative;
	}
}