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
            // Phalcon doesn't seem to be setting default value so regetting orgs
            foreach ($table as $orgData) {
                $externalIdToOrg[$orgData['id']] = Organization::findFirst([
                    "conditions" => "external_id = :eId:",
                    "bind"       => ['eId' => $orgData['id']]
                ]);
            }
            // Set parents
            foreach ($table as $orgData) {
                if (!empty($orgData['parent_id'])) {
                    $externalIdToOrg[$orgData['id']]->parent_id =
                        $externalIdToOrg[$orgData['parent_id']]->id;
                }
                else {
                    $externalIdToOrg[$orgData['id']]->parent_id = 1;
                }
                if (!$externalIdToOrg[$orgData['id']]->save()) {
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