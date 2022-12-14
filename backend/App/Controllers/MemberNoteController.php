<?php

namespace App\Controllers;

use App\Components\Result;
use App\Models\MemberNote;

class MemberNoteController extends ControllerBase {
	/**
	 * Return a list.
	 */
	public function listAction() {
		$note = new MemberNote();
		$data = $note->get();
		$result = new Result($this);
		$result->sendNormal($data);
	}

	/**
	 * Return a single record.
	 *
	 * @param string $id
	 */
	public function singleAction($id) {
		$result = new Result($this);
		$note = new MemberNote();
		$note = $note->get($id, FALSE);
		$note = $note->map();
		$result->sendNormal($role);
	}

	/**
	 * @param int $memberId
	 */
	public function forMemberAction($memberId) {
		$result = new Result($this);
		$data = $this->mapRecords(MemberNote::query()->where('member_id = :id:', ["id" => $memberId])->orderBy("last_modified DESC")->execute());
		$result->sendNormal($data);
	}

	/**
	 * @param int $creatorId
	 */
	public function byCreatorAction($creatorId) {
		$result = new Result($this);
		$data = $this->mapRecords(MemberNote::query()->where('creator_id = :id:', ["id" => $creatorId])->orderBy("last_modified DESC")->execute());
		$result->sendNormal($data);
	}

	/**
	 */
	public function updateAction() {
		$result = new Result();
		try {
			$noteForm = $this->getInputData('data');
			if (!empty($noteForm) && is_array($noteForm)) {
				$noteForm['creator_id'] = $this->currentUser()->id;
				if (empty($noteForm["id"])) {
					$note = new MemberNote();
				}
				else {
					$note = MemberNote::findFirst($noteForm["id"]);
				}
				if (!empty($note)) {
					$note->unmap($noteForm, $note);
					if ($note->save()) {
						$result->setNormal($note->map());
					}
					else {
						throw new \Exception($note->errorMessagesAsString());
					}
				}
				else {
					throw new \Exception("Unable to create or find note.");
				}
			}
		}
		catch (\Exception $exception) {
			$result->setException($exception);
		}
		$result->sendNormal();
	}

	/**
	 */
	public function deleteAction($memberNoteId) {
		$result = new Result();
		$memberNote = new MemberNote();
		$this->beginTransaction($memberNote);
		try {
			$memberNote = MemberNote::findFirst($memberNoteId);
			if (!empty($memberNote)) {
				if ($memberNote->delete()) {
					$result->setNormal($memberNote, 'Record deleted.');
					$this->commitTransaction();
				}
				else {
					$result->setError(Result::CODE_EXCEPTION, $memberNote->errorMessagesAsString());
				}
			}
			else {
				$result->setError(Result::CODE_NOT_FOUND);
			}
		}
		catch (\Exception $exception) {
			$this->rollbackTransaction();
			$result->setException($exception);
		}
		$result->sendNormal();
	}
}