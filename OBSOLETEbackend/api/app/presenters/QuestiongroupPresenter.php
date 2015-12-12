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

class QuestiongroupPresenter extends BasePresenter {

    /**
     * @param int $groupId
     * @param int $mode
     *
     * @throws \App\Components\AjaxException
     */
    public function actionRead($groupId = NULL, $mode = self::MODE_LISTING) {
        if (!$this->user->isAllowed('Question', 'read')) {
            throw new AjaxException(AjaxException::ERROR_NOT_ALLOWED);
        }
        if (empty($groupId)) {
            $groups = $this->database->table('question_group');
        }
        else {
            $groups = [$this->database->table('question_group')->get($groupId)];
        }
        $groupsArray = [];
        foreach ($groups as $group) {
            $questions = $group->related('question');
            $questionsArray = [];
            foreach ($questions as $question) {
                $questionsArray[] =
                    $this->database->map($question);
            }
            $group = $this->database->map($group);
            $group['questions'] = $questionsArray;
            $groupsArray[] = $group;
        }
        $this->sendResult($groupsArray);
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