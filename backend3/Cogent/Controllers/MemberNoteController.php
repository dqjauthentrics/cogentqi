<?php
namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\MemberNote;

class MemberNoteController extends ControllerBase {
	/**
	 * Return a list.
	 */
	public function indexAction() {
		$role = new MemberNote();
		$data = $role->get();
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
		$role = new MemberNote();
		$role = $role->get($id, FALSE);
		$role = $role->map();
		$result->sendNormal($role);
	}

	/**
	 * @param int $memberId
	 */
	public function byMemberAction($memberId) {
		$result = new Result($this);
		$data = $this->mapRecords(MemberNote::query()->where('member_id = :id:', ["id" => $memberId])->orderBy("last_modified")->execute());
		$result->sendNormal($data);
	}

	/**
	 */
	public function updateAction() {
		$result = new Result();
		try {
			$noteForm = $this->getInputData('note');
			if (!empty($noteForm) && is_array($noteForm)) {
				$noteForm['creator_id'] = $this->user->id;
				if (empty($noteForm["id"])) {
					$note = new MemberNote();
				}
				else {
					$note = MemberNote::findFirst($noteForm["id"]);
				}
				if (!empty($note)) {
					$note->update($note->unmap($noteForm));
					$result->setNormal($note->map());
				}
				else {
					throw new \Exception("Unable to create or find note.");
				}
			}
		}
		catch (\Exception $exception) {
			$result->message = $exception->getMessage();
		}
		$result->sendNormal();
	}

}