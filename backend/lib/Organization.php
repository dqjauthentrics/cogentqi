<?php
namespace App;

class Organization extends Model {

	/**
	 * Add routes to default set for Organization.
	 */
	public function initializeRoutes() {
		$urlName = $this->urlName();
		$this->api->get("/$urlName/children/:parentId", function ($parentId = NULL) {
			$jsonRecords = [];
			$dbRecords = $this->api->db->{$this->tableName}()->select('*,nOrgChildren(id) AS nChildren')
				->where("id=? OR parent_id=?", $parentId, $parentId)
				->order('name');
			foreach ($dbRecords as $dbRecord) {
				if ($dbRecord["id"] == $parentId) {
					$parentJson = [
						'id'       => (int)$dbRecord["id"],
						'parentId' => (int)$dbRecord["parent_id"],
						'name'     => $dbRecord["name"],
						'summary'  => $dbRecord["summary"],
						'ph'       => $dbRecord["phone"],
						'fx'       => $dbRecord["fax"],
						'ad'       => $dbRecord["address"],
						'cy'       => $dbRecord["city"],
						'st'       => $dbRecord["state"],
						'zc'       => $dbRecord["postal"],
						'nc'       => (int)$dbRecord["nChildren"],
					];
				}
				else {
					$jsonRecords[] = [
						'id'       => (int)$dbRecord["id"],
						'parentId' => (int)$dbRecord["parent_id"],
						'name'     => $dbRecord["name"],
						'summary'  => $dbRecord["summary"],
						'ph'       => $dbRecord["phone"],
						'fx'       => $dbRecord["fax"],
						'ad'       => $dbRecord["address"],
						'cy'       => $dbRecord["city"],
						'st'       => $dbRecord["state"],
						'zc'       => $dbRecord["postal"],
						'nc'       => (int)$dbRecord["nChildren"],
					];
				}
			}
			if (!empty($parentJson)) {
				array_unshift($jsonRecords, $parentJson);
			}
			$this->api->sendResult($jsonRecords);
		});

		parent::initializeRoutes();
	}

}