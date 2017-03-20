<?php

namespace App\Controllers;

use App\Components\Result;
use App\Models\AppModel;
use App\Models\Instrument;
use App\Models\Question;
use App\Models\QuestionGroup;

class InstrumentController extends ControllerBase {
    /**
     * Return a list.
     */
    public function listAction() {
        $instrument = new Instrument();
        $data = $instrument->get(NULL, TRUE, 'sort_order');
        $result = new Result($this);
        $result->sendNormal($data);
    }

    /**
     * Return a single record.
     *
     * @param int $id
     */
    public function getAction($id) {
        $result = new Result($this);
        $instrument = new Instrument();
        $instrument = $instrument->get($id, FALSE);
        if (!empty($instrument)) {
            $instrument = $instrument->map();
        }
        else {
            $result->setError(Result::CODE_NOT_FOUND);
        }
        $result->sendNormal($instrument);
    }

    /**
     * @todo Replace getAction() call above when moved to I2/A2.
     */
    public function singleAction($id) {
        $this->getAction($id);
    }

    /**
     * @param int $groupId
     */
    public function questionGroupsAction($groupId = NULL) {
        $result = new Result($this);
        if (empty($groupId)) {
            $groups = QuestionGroup::query()->orderBy("instrument_id,sort_order")->execute();
        }
        else {
            $groups = QuestionGroup::query()->where('instrument_id = :id:', ["id" => $groupId])->orderBy("sort_order")->execute();
        }
        $groupsArray = $this->mapRecords($groups);
        $result->setNormal($groupsArray);
        $result->sendNormal();
    }

    /**
     * @param QuestionGroup[] $questionGroups
     * @param int             $questionGroupId
     *
     * @return QuestionGroup|null
     */
    private function findGroup($questionGroups, $questionGroupId) {
        $group = NULL;
        if (!empty($questionGroups)) {
            foreach ($questionGroups as $group) {
                if ($group->id == $questionGroupId) {
                    return $group;
                }
            }
        }
        return $group;
    }

    /**
     * Save the given alignments for this resource.
     */
    public function saveAction() {
        $result = new Result($this);
        $transaction = $this->transactionManager->getOrCreateTransaction();
        try {
            $data = @$this->getInputData();
            if (!empty($data["instrument"])) {
                $formInstrument = $data["instrument"];
                $instrumentId = $formInstrument['id'];
                $instrumentRecord = Instrument::findFirst($instrumentId);
                /** @var \App\Models\Instrument $resource */
                if (!$instrumentRecord->update(['description' => $formInstrument['dsc']])) {
                    throw new \Exception($resource->errorMessagesAsString());
                }
                $formGroups = $formInstrument["questionGroups"];
                if (!empty($formGroups)) {
                    $groupRecords = QuestionGroup::query()->where('instrument_id=:id:', ['id' => $instrumentId])->execute();
                    /** @var QuestionGroup[] $groupRecords */
                    foreach ($formGroups as $formGroup) {
                        $groupRecord = AppModel::findRecord($groupRecords, $formGroup['id']);
                        if (!empty($groupRecord)) {
                            $groupRecord->update([
                                    'name'        => $formGroup['name'],
                                    'number'      => $formGroup['number'],
                                    'description' => $formGroup['description']
                                ]
                            );
                            $questionRecords = Question::query()->where('question_group_id=:id:', ['id' => $groupRecord->id])->execute();
                            /** @var Question[] $questionRecords */
                            if (!empty($formGroup['questions'])) {
                                foreach ($formGroup['questions'] as $formQuestion) {
                                    $questionRecord = AppModel::findRecord($questionRecords, $formQuestion['id']);
                                    if (!empty($questionRecord)) {
                                        $questionRecord->update([
                                                'name'      => $formQuestion['name'],
                                                'number'    => $formQuestion['number'],
                                                'full_text' => $formQuestion['fullText']
                                            ]
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
                $transaction->commit();
                $result->setNormal();
            }
        }
        catch (\Exception $exception) {
            $transaction->rollback();
            $result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
        }
        $result->send();
    }

}