<?php
namespace App\Presenters;

use Nette,
	ResourcesModule\BasePresenter,
	App\Components\AjaxException,
	App\Model\MemberNote,
	Nette\Database\Table\ActiveRow;

class MemberNotePresenter extends BasePresenter {

	/**
	 */
	public function actionUpdate() {
		$result = [];
		try {
			$data = @$this->getInput()->getData();
			if (!empty($data["note"])) {
				$noteForm = $data["note"];
				if (!empty($noteForm) && is_array($noteForm)) {
					$note = $this->database->unmap($noteForm, 'member_note');
					$note['creator_id'] = $this->user->id;
					if (empty($note["id"])) {
						$noteRow = $this->database->table('member_note')->insert($note);
					}
					else {
						$noteRow = $this->database->table('member_note')->where('id=?', $note["id"])->fetch();
						$noteRow->update($note);
					}
					$result = MemberNote::map($this->database, $noteRow);
				}
			}
		}
		catch (\Exception $exception) {
			throw new AjaxException($exception->getMessage());
		}
		$this->sendResult($result);
	}
}
