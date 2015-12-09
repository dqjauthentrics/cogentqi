<?php
/**
 * Created by PhpStorm.
 * User: Greg Emerson
 * Date: 12/1/15
 * Time: 4:57 PM
 */

namespace App\Presenters;

use App\Components\AjaxResult;
use Nette,
    Drahak\Restful\IResource,
    ResourcesModule\BasePresenter,
    App\Model\Event,
    ResourcesModule,
    Nette\Database\Table\IRow,
    App\Components\AjaxException;

class EventPresenter extends BasePresenter {

    /**
     * @param int $id
     * @param int $mode
     *
     * @throws \App\Components\AjaxException
     */
    public function actionRead($id, $mode = self::MODE_LISTING) {
        if (!$this->user->isAllowed('Event', 'read')) {
            throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
        }

        if (!empty($id)) {
            /** @var IRow $outcome */
            $event = $this->database->table('event')->get($id);
            if (empty($event)) {
                throw new AjaxException(AjaxException::ERROR_NOT_FOUND);
            }
            $jsonRec = Event::map($this->database, $event, $mode);
        }
        else {
            $events = $this->database->table('event')->fetchAll();
            $jsonRec = [];
            foreach ($events as $event) {
                $jsonRec[] = Event::map($this->database, $event, $mode);
            }
        }
        $this->sendResult($jsonRec);
    }

    private function getQuestions($events) {
        $questions = [];
        foreach ($events as $event) {

        }
    }

    public function actionUpdate() {
        $result = ['hello' => 'world'];
        $this->sendResult($result);
        try {
            $data = @$this->getInput()->getData();
        }
        catch (\Exception $exception) {
            throw new AjaxException(AjaxException::ERROR_FATAL, $exception->getMessage());
        }
        $this->sendResult($result);
    }
}