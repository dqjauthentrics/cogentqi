<?php

namespace App\Controllers;

use App\Components\Result;
use App\Models\PlanItem;
use App\Models\Resource;
use App\Models\ResourceAlignment;
use App\Models\ResourceAlignmentMap;

class ResourceController extends ControllerBase {

    /**
     * @param int                             $resourceId
     * @param int                             $questionId
     * @param \App\Models\ResourceAlignment[] $alignments
     *
     * @return \App\Models\ResourceAlignment
     */
    private function find($resourceId, $questionId, $alignments) {
        foreach ($alignments as $alignment) {
            if ($alignment->question_id == $questionId && $alignment->resource_id == $resourceId) {
                return $alignment;
            }
        }
        return NULL;
    }

    /**
     * Return a list.
     */
    public function listAction() {
        $resource = new Resource();
        $data = $resource->get(NULL, TRUE, 'id', '1=1', [], ['alignments' => TRUE]);
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
        $resource = new Resource();
        $resource = $resource->get($id, FALSE);
        $resource = $resource->map();
        $result->sendNormal($resource);
    }

    /** @todo Replace getAction call above with this when moving to v2. */
    public function singleAction($id) {
        $this->getAction($id);
    }

    public function contentAction($siteDir, $number) {
        $result = new Result($this);
        try {
            $number = strtolower($number);
            $path = dirname(dirname(dirname(__DIR__))) . "/learning/$siteDir/$number.html";
            $content = @file_get_contents($path);
            $result->message = $path;
            $result->setNormal($content);
        }
        catch (\Exception $exception) {
            $result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
        }
        $result->send();
    }

    /**
     * Create a new record, storing the given form information.
     */
    public function createAction() {
        $result = new Result($this);
        try {
            $params = json_decode(file_get_contents('php://input'), TRUE);
            $resourceForm = $params["resource"];
            if (!empty($resourceForm) && is_array($resourceForm)) {
                $resource = new \App\Models\Resource();
                $resourceForm = $resource->unmap($resourceForm);
                $resourceForm['creator_id'] = $this->currentUser()->id;
                if (empty($resourceForm['resource_type_id'])) {
                    $resourceForm['resource_type_id'] = 'T'; //@todo Hard-coded default type
                }
                if (empty($resourceForm["id"])) {
                    $resource = $resource->update($resourceForm);
                }
                else {
                    $resource = Resource::findFirst($resourceForm["id"]);
                    /** @var \App\Models\Resource $resource */
                    if (!empty($resource)) {
                        $resource->update($resource);
                    }
                }
                $result->setNormal($resource->map());
            }
            else {
                $result->setError(Result::CODE_INVALID_REQUEST);
            }
        }
        catch (\Exception $exception) {
            $result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
        }
        $result->send();
    }

    private static function filterFormAlignments(&$formAlignments) {
        foreach ($formAlignments as $questionId => &$utilities) {
            for ($i = 0; $i < count($utilities); $i++) {
                if (empty($utilities[$i]['utility'])) {
                    unset($utilities[$i]);
                    break;
                }
            }
        }
    }

    /**
     * Save the given alignments for this resource.
     */
    public function saveAlignmentsAction() {
        $result = new Result($this);
        $transaction = $this->transactionManager->getOrCreateTransaction();
        try {
            $data = @$this->getInputData();
            if (!empty($data["resource"]) && !empty($data["alignments"])) {
                $formResource = $data["resource"];
                $resourceId = $formResource["id"];
                $resourceRecord = Resource::findFirst($resourceId);
                /** @var \App\Models\Resource $resourceRecord */
                if (!$resourceRecord->update(['description' => $formResource['description'], 'description' => $formResource['description']])) {
                    throw new \Exception($resourceRecord->errorMessagesAsString());
                }
                $formAlignments = $data["alignments"];
                if (!empty($formAlignments)) {
                    self::filterFormAlignments($formAlignments);
                    $alignments = ResourceAlignment::query()->where('resource_id=:id:', ['id' => $resourceId])->execute();
                    /** @var \App\Models\ResourceAlignment[] $alignments
                     */
                    foreach ($formAlignments as $questionId => $utilities) {
                        $alignment = $this->find($resourceId, $questionId, $alignments);
                        if (!empty($alignment)) {
                            $total = 0;
                            $responseToUtility = [];
                            foreach ($utilities as $utility) {
                                $total += $utility['utility'];
                                $responseToUtility[$utility['response']] = $utility['utility'];
                            }
                            if ($total == 0) {
                                $alignment->delete();
                            }
                            else {
                                foreach ($alignment->mapping as $m) {
                                    /** @var ResourceAlignmentMap $m */
                                    $m->utility = $responseToUtility[$m->response];
                                    $m->save();
                                }
                            }
                        }
                        else {
                            $total = 0;
                            $mapping = [];
                            $alignment = new ResourceAlignment();
                            $alignment->resource_id = $resourceId;
                            $alignment->question_id = $questionId;
                            for ($i = 1; $i < count($utilities); $i++) {
                                $m = new ResourceAlignmentMap();
                                $mapping[] = $m;
                                $m->response = $utilities[$i]['response'];
                                $m->utility = $utilities[$i]['utility'];
                                $total += $utilities[$i]['utility'];
                            }
                            if ($total > 0) {
                                $alignment->mapping = $mapping;
                                $alignment->save();
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

    /**
     * Save an existing record from the given form.
     */
    public function saveAction() {
        $result = new Result($this);
        try {
            $formResource = @$this->getInputData('resource');
            if (!empty($formResource)) {
                $resource = Resource::findFirst($formResource['id']);
                /** @var \App\Models\Resource $resource */
                if (!empty($resource)) {
                    if ($resource->update($formResource)) {
                        $result->setNormal();
                    }
                }
            }
        }
        catch (\Exception $exception) {
            $result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
        }
        $result->send();
    }

    public function efficacyAction() {
        $result = new Result($this);
        try {
            $resources = Resource::find(['order' => 'name DESC']);
            $result = new Result($this);
            $data = [];
            foreach ($resources as $resource) {
                $priorResponseAverages = [];
                $subsequentResponseAverages = [];
                $questionLabels = [];
                $this->singleResourceEfficacy($resource, $priorResponseAverages, $subsequentResponseAverages, $questionLabels);
                $data[] = [
                    'name'                       => $resource->name,
                    'description'                => $resource->description,
                    'priorResponseAverages'      => $priorResponseAverages,
                    'subsequentResponseAverages' => $subsequentResponseAverages,
                    'questionLabels'             => $questionLabels
                ];
            }
            $result->setNormal($data);
        }
        catch (\Exception $exception) {
            $result->setError(Result::CODE_EXCEPTION, $exception->getMessage());
        }
        $result->send();
    }

    /**
     * @param $resource \App\Models\Resource
     */
    private function singleResourceEfficacy($resource, &$priorResponseAverages, &$subsequentResponseAverages, &$questionLabels) {
        /** @var \App\Models\ResourceAlignment[] $alignments */
        $alignments = $resource->alignments;
        $questionIds = [];
        $questionNames = [];
        $prior = [];
        $subsequent = [];
        /** @var \App\Models\ResourceAlignment $alignments */
        foreach ($alignments as $alignment) {
            $questionIds[] = $alignment->question->id;
            $questionNames[$alignment->question->id] = $alignment->question->name;
            $prior[$alignment->question->id] = [];
            $subsequent[$alignment->question->id] = [];
        }
        if (count($questionIds) === 0) {
            return;
        }
        // Get preceding and succeeding competency scores
        $modules = $resource->modules;
        foreach ($modules as $module) {
            $planItems = PlanItem::find([
                'conditions' => 'module_id = ?1 AND plan_item_status_id = ?2',
                'bind'       => [1 => $module->id, 2 => PlanItem::STATUS_COMPLETED]
            ]);
            foreach ($planItems as $planItem) {
                $this->getResponses($planItem->status_stamp, $planItem->member_id, $questionIds, $prior, $subsequent);
            }
        }
        $params = [];
        $params[] = [$prior, &$priorResponseAverages];
        $params[] = [$subsequent, &$subsequentResponseAverages];
        foreach ($params as $param) {
            foreach ($param[0] as $q => $rs) {
                if (count($rs) > 0) {
                    if (count($questionLabels) < count($questionNames)) {
                        $questionLabels[] = $questionNames[$q];
                    }
                    $param[1][] = bcdiv(array_sum($rs), count($rs), 1);
                }
            }
        }
    }

    /**
     * @param $timestamp
     * @param $memberId
     * @param $questionIds
     * @param $prior
     * @param $subsequent
     *
     * @throws \Exception
     */
    private function getResponses($timestamp, $memberId, $questionIds, &$prior, &$subsequent) {
        $questions = implode(',', $questionIds);
        $resource = new Resource();
        $template = "SELECT ar1.question_id, ar1.response
            FROM assessment_response ar1
              JOIN (
                SELECT question_id, ?minMax(time_stamp) AS time_stamp
                FROM assessment_response
                WHERE time_stamp ?orderOperator '$timestamp'
                  AND question_id IN ($questions)
                  AND assessment_id IN (SELECT id FROM assessment WHERE member_id = $memberId)
                GROUP BY question_id) AS ar2
              ON ar1.question_id = ar2.question_id AND ar1.time_stamp = ar2.time_stamp
            WHERE ar1.response IS NOT NULL AND ar1.assessment_id IN (SELECT id FROM assessment WHERE member_id = $memberId)";
        $pTemp = [];
        $sTemp = [];
        try {
            $sql = str_replace(['?orderOperator', '?minMax'], ['<', 'MAX'], $template);
            $results = $resource->getDBIF()->fetchAll($sql);
            foreach ($results as $result) {
                $pTemp[$result['question_id']] = $result['response'];
            }
            $sql = str_replace(['?orderOperator', '?minMax'], ['>', 'MIN'], $template);
            $results = $resource->getDBIF()->fetchAll($sql);
            foreach ($results as $result) {
                $sTemp[$result['question_id']] = $result['response'];
            }
        }
        catch (\Exception $exception) {
            throw $exception;
        }
        // Insure pTemp and sTemp reference the same questions to insure before and after symmetry
        foreach ($pTemp as $q => $r) {
            if (array_key_exists($q, $sTemp)) {
                $prior[$q][] = $r;
            }
        }
        foreach ($sTemp as $q => $r) {
            if (array_key_exists($q, $pTemp)) {
                $subsequent[$q][] = $r;
            }
        }
    }
}