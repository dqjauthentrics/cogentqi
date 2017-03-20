<?php

namespace App\Controllers;

use App\Components\Result;
use App\Models\Organization;
use App\Models\PlanItem;

class PlanItemController extends ControllerBase {

    /**
     * Return a list.
     */
    public function listAction($organizationId, $memberId = 0) {
        $data = [];
        $model = new Organization();
        $orgIds = $model->getDescendantIds($organizationId);

        $member = new PlanItem();
        $sql = "SELECT pi.id, pi.plan_item_status_id, r.name, r.id AS resourceId, r.description, m.id AS moduleId, 
					b.image AS badgeImage, b.name AS badgeName, b.id AS badgeId,
					m.first_name, m.middle_name, m.last_name, m.id AS memberId, m.role_id
			FROM plan_item pi, member AS m, module AS md, resource r
			LEFT OUTER JOIN badge AS b ON (b.id=r.badge_id)
			WHERE pi.status_stamp >= DATE_SUB(NOW(), INTERVAL 1 YEAR) AND md.resource_id=r.id AND m.id=pi.member_id AND pi.module_id=md.id";
        if (empty($memberId)) {
            $sql .= " AND m.organization_id IN ($orgIds)";
            $dbRecords = $member->getReadConnection()->query($sql)->fetchAll();
        }
        else {
            $sql .= " AND m.id=$memberId";
            $dbRecords = $member->getReadConnection()->query($sql)->fetchAll();
        }
        if (!empty($dbRecords)) {
            foreach ($dbRecords as $rec) {
                $dataRec = [
                    'id'               => $rec['id'],
                    'statusStamp'      => $rec['status_stamp'],
                    'module'           => [
                        'id' => $rec['moduleId']
                    ],
                    'planItemStatusId' => $rec['plan_item_status_id'],
                    'badge'            => [
                        'id'    => $rec['badgeId'],
                        'image' => $rec['badgeImage'],
                    ],
                    'resource'         => [
                        'name'        => $rec['name'],
                        'id'          => $rec['resourceId'],
                        'description' => $rec['description'],
                    ],
                ];
                if (empty($memberId)) {
                    $dataRec['member'] = [
                        'id'         => $rec['memberId'],
                        'roleId'     => $rec['role_id'],
                        'firstName'  => $rec['first_name'],
                        'lastName'   => $rec['last_name'],
                        'middleName' => $rec['middle_name'],
                    ];
                }
                $data[] = $dataRec;
            }
        }
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
        $planItem = new PlanItem();
        $planItem = $planItem->get($id, FALSE);
        $planItem = $planItem->map();
        $result->sendNormal($planItem);
    }

    /**
     * @param int $memberId
     */
    public function forMemberAction($memberId) {
        $result = new Result($this);
        $data = $this->mapRecords(PlanItem::query()->where('member_id = :id:', ["id" => $memberId])->orderBy("status_stamp")->execute());
        $result->sendNormal($data);
    }

    /**
     * @param int $organizationId
     */
    public function yearAction($organizationId, $status = PlanItem::STATUS_COMPLETED) {
        $planItemModel = new PlanItem();
        $result = $planItemModel->getYear($organizationId, $status);
        $result->sendNormal();
    }
}