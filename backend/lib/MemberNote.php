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
			/** @var \NotORM_Result $dbRecord */
			foreach ($this->api->db->{$this->tableName}->where('member_id=?', $memberId) as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$this->api->sendResult($jsonRecords);
		});
	}

	/**
	 * @param \NotORM_Result $note
	 *
	 * @return array
	 */
	function map($note) {
		$creator = $note->creator;
		$associative = [
			'id' => (int)$note["id"],
			'lm' => Model::dateTime($note["last_modified"]),
			'c'  => $note["content"],
			'p'  => $note["is_private"],
			'creator' => [
				'id' => (int)$note["creator_id"],
				'av' => $creator["avatar"],
				'fn' => $creator["first_name"],
				'ln' => $creator["last_name"],
				'ri' => $creator["role_id"],
				'jt' => $creator["job_title"],
				'rl' => @$creator->role["name"]
			],
		];
		return $associative;
	}
}