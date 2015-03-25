<?php
namespace App;

/**
 * Created by PhpStorm.
 * User: dqj
 * Date: 3/20/15
 * Time: 10:10 PM
 */
class Model {
	/** @var Api $api */
	protected $api = NULL;

	/** @var array $mapExcludes */
	protected $mapExcludes = [];

	/**
	 * @param Api $api
	 */
	function __construct($api) {
		$this->api = $api;
		$this->initialize();
	}

	public function initialize() {
		$this->initializeRoutes($this->api);
	}

	/**
	 * @return string
	 */
	public function urlName() {
		$path = explode('\\', get_class($this));
		return strtolower(array_pop($path));
	}

	protected function colNameToJsonName($colName) {
		$jsonName = "";
		for ($i = 0; $i < strlen($colName); $i++) {
			$ch = substr($colName, $i, 1);
			if ($ch == "_") {
				$i++;
				$ch = strtoupper(substr($colName, $i, 1));
			}
			$jsonName .= $ch;
		}
		return $jsonName;
	}

	/**
	 * @param array $dbRecord
	 *
	 * @return array
	 */
	public function map($dbRecord) {
		$jsonRecord = [];
		try {
			$columnNames = array_keys(iterator_to_array($dbRecord));
			for ($i = 0; $i < count($columnNames); $i++) {
				$colName = $columnNames[$i];
				if (empty($this->mapExcludes) || !in_array($colName, $this->mapExcludes)) {
					$jsonName = $this->colNameToJsonName($colName);
					$jsonRecord[$jsonName] = $dbRecord[$colName];
				}
			}
		}
		catch (\Exception $exception) {
			var_dump($exception);
		}
		return $jsonRecord;
	}

	/**
	 * @param Api $api
	 */
	public function initializeRoutes($api) {
		$urlName = $this->urlName();
		$api->get("/$urlName/all", function ($parentId = NULL) use ($api, $urlName) {
			$jsonRecords = [];
			foreach ($api->db->{$urlName}() as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$api->sendResult($jsonRecords);
		});
		$api->get("/$urlName/children/:parentId", function ($parentId = NULL) use ($api, $urlName) {
			$jsonRecords = [];
			foreach ($api->db->{$urlName}()->where("parent_id=? or id=?", $parentId, $parentId) as $dbRecord) {
				$jsonRecords[] = $this->map($dbRecord);
			}
			$api->sendResult($jsonRecords);
		});
		$api->get("/$urlName/:id", function ($id) use ($api, $urlName) {
			$dbRecord = $api->db->{$urlName}()->where("id", $id);
			if ($data = $dbRecord->fetch()) {
				$api->sendResult($this->map($data));
			}
			else {
				$api->sendResult("$urlName ID $id does not exist", Api::STATUS_ERROR);
			}
		});

		$api->post("/$urlName", function () use ($api, $urlName) {
			$jsonPostData = $api->request()->post();
			$result = $api->db->{$urlName}->insert($jsonPostData);
			$api->sendResult(["id" => $result["id"]]);
		});

		$api->put("/$urlName/:id", function ($id) use ($api, $urlName) {
			$dbRecord = $api->db->{$urlName}()->where("id", $id);
			if ($dbRecord->fetch()) {
				$post = $api->request()->put();
				$result = $dbRecord->update($post);
				$api->sendResult("$urlName updated.", (bool)$result);
			}
			else {
				$api->sendResult("$urlName id $id does not exist", Api::STATUS_ERROR);
			}
		});

		$api->delete("/$urlName/:id", function ($id) use ($api, $urlName) {
			$dbRecord = $api->db->{$urlName}()->where("id", $id);
			if ($dbRecord->fetch()) {
				$result = $dbRecord->delete();
				$api->sendResult("$urlName deleted.");
			}
			else {
				$api->sendResult("$urlName id $id does not exist.", Api::STATUS_ERROR);
			}
		});
	}
}