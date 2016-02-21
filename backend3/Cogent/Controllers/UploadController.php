<?php
/**
 * Created by PhpStorm.
 * User: amazatron
 * Date: 2/13/16
 * Time: 3:32 PM
 */

namespace Cogent\Controllers;

use Cogent\Components\Result;
use Cogent\Models\Organization;
use Cogent\Models\Member;
use Cogent\Models\Relationship;
use Nette\Neon\Exception;

class UploadController extends ControllerBase {

    public function uploadOrganizationsAction() {
        $result = new Result();
        $requiredFields = ["id","parent_id","name"];
        $forbiddenFields = [];
        $transaction = $this->transactionManager->getOrCreateTransaction();
        try {
            $table = self::getTableAsArray($requiredFields, $forbiddenFields);
            /** @var Organization[] $externalIdToOrg */
            $externalIdToOrg = [];
            // Create new orgs with null parents
            foreach ($table as $orgData) {
                $org = new Organization();
                $externalId = strval($orgData['id']);
                $externalParentId = strval($orgData['parent_id']);
                unset($orgData['id']);
                unset($orgData['parent_id']);
                $org->external_id = $externalId;
                foreach ($orgData as $column => $value) {
                    $org->$column = $value;
                }
                $orgData['id'] = $externalId;
                $orgData['parent_id'] = $externalParentId;
                if (!$org->save()) {
                    throw new \Exception($org->errorMessagesAsString());
                }
            }
            // Phalcon doesn't seem to be setting default value so re-getting orgs
            foreach ($table as $orgData) {
                $externalIdToOrg[$orgData['id']] =
                    self::getByExternalId('Organization', $orgData['id']);
            }
            // Set parents
            foreach ($table as $orgData) {
                $org = $externalIdToOrg[$orgData['id']];
                if (!empty($orgData['parent_id'])) {
                    $org->parent_id =
                        $externalIdToOrg[$orgData['parent_id']]->id;
                }
                else {
                    // Attach to top level
                    $org->parent_id = 1;
                }
                if (!$org->save()) {
                    throw new \Exception($org->errorMessagesAsString());
                }
            }
            $transaction->commit();
            $result->sendNormal();
        }
        catch (\Exception $exception) {
            $transaction->rollback();
            $result->sendError(Result::CODE_EXCEPTION, $exception->getMessage());
        }
    }

    public function uploadMembersAction() {
        $result = new Result();
        $requiredFields = ["id","organization_id","role_id","first_name","last_name","email"];
        $forbiddenFields = ["password"];
        $transaction = $this->transactionManager->getOrCreateTransaction();
        try {
            $table = self::getTableAsArray($requiredFields, $forbiddenFields);
            $orgExternalToInternal = [];
            $idToPassword = [];
            // Create new orgs with null parents
            foreach ($table as $memberData) {
                /** @var Member $member */
                $member = new Member();
                $member->external_id = $memberData['id'];
                unset($memberData['id']);
                $password = self::generatePassword(8);
                $member->password = md5($password);
                if (!array_key_exists($memberData['organization_id'],
                    $orgExternalToInternal)) {
                    $orgExternalToInternal[$memberData['organization_id']] =
                        self::getByExternalId("Organization", $memberData['organization_id'])->id;
                }
                $memberData['organization_id'] =
                    $orgExternalToInternal[$memberData['organization_id']];
                foreach ($memberData as $column => $value) {
                    $member->$column = $value;
                }
                if (!$member->save()) {
                    throw new \Exception($member->errorMessagesAsString());
                }
                $idToPassword[$member->id] = $password;
            }
            // Write new passwords to php temp directory
            $filePath = sys_get_temp_dir() . "/" . "passwords" . date("Y-m-d_H:i:s") . '.txt';
            $fileHandle = fopen($filePath, 'w');
            fwrite($fileHandle, "id,password\n");
            $count = 0;
            foreach ($idToPassword as $id => $password) {
                $count++;
                fwrite($fileHandle, $id . ',' . $password);
                if ($count < count($idToPassword)) {
                    fwrite($fileHandle, "\n");
                }
            }
            fclose($fileHandle);
            $transaction->commit();
            $result->sendNormal();
        }
        catch (\Exception $exception) {
            $transaction->rollback();
            $result->sendError(Result::CODE_EXCEPTION, $exception->getMessage());
        }
    }

    public function uploadRelationshipsAction() {
        $result = new Result();
        $requiredFields = ["superior_id","subordinate_id","relationship_type_id"];
        $forbiddenFields = [];
        $transaction = $this->transactionManager->getOrCreateTransaction();
        try {
            $table = self::getTableAsArray($requiredFields, $forbiddenFields);
            // Create new orgs with null parents
            foreach ($table as $relationshipData) {
                /** @var Relationship $relationship */
                $relationship = new Relationship();
                $relationship->superior_id = self::getByExternalId(
                    'Member', $relationshipData['superior_id'])->id;
                $relationship->subordinate_id = self::getByExternalId(
                    'Member', $relationshipData['subordinate_id'])->id;
                $relationship->relationship_type_id =
                    $relationshipData['relationship_type_id'];
                if (!$relationship->save()) {
                    throw new \Exception($relationship->errorMessagesAsString());
                }
            }
            $transaction->commit();
            $result->sendNormal();
        }
        catch (\Exception $exception) {
            $transaction->rollback();
            $result->sendError(Result::CODE_EXCEPTION, $exception->getMessage());
        }
    }

    private static function getByExternalId($model, $externalId) {
        $fullModel = 'Cogent\\Models\\' . $model;
        return $fullModel::findFirst([
            "conditions" => "external_id = :eId:",
            "bind"       => ['eId' => $externalId]
        ]);
    }

    private static function generatePassword($length) {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        $cl = strlen($characters) - 1;
        $password = '';
        for ($i = 0; $i < $length; $i++) {
            $password .= $characters[mt_rand(0, $cl)];
        }
        return $password;
    }

    /**
     *  Get uploaded table in array form
     */
    private static function getTableAsArray($requiredFields, $forbiddenFields) {
        $fileHandle = NULL;
        try {
            $table = [];
            $fileName = $_FILES['table']['tmp_name'];
            $fileHandle = fopen($fileName, 'r');
            $header = fgetcsv($fileHandle);
            foreach ($requiredFields as $field) {
                if (!in_array($field, $header)) {
                    throw new \Exception('Table does not contain column: ' . $field);
                }
            }
            $line = NULL;
            while ($line = fgetcsv($fileHandle)) {
                $row = [];
                for ($column = 0; $column < count($header); $column++) {
                    if (in_array($header[$column], $forbiddenFields)) {
                        continue;
                    }
                    $row[$header[$column]] = $line[$column];
                }
                $table[] = $row;
            }
            fclose($fileHandle);
            return $table;
        }
        catch (\Exception $exception) {
            if (!empty($fileHandle)) {
                fclose($fileHandle);
                throw $exception;
            }
        }
    }
}