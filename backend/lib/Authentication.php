<?php
/**
 * Created by PhpStorm.
 * User: dqj
 * Date: 3/21/15
 * Time: 12:58 PM
 */
namespace App;

require_once "../lib/Member.php";

class Authentication extends Model {
	public $cookie_time = 14400;

	function initialize() {
		if (!isset($_SESSION)) {
			session_start();
		}
		$urlName = $this->urlName();
		$this->api->post("/authentication", function () use ($urlName) {
			$args = $this->api->request()->post();
			$record = $this->api->db->member()->where('username=?', $args["username"])->fetch();
			$user = NULL;
			if (!empty($record)) {
				$user = [
					'id'             => $record["id"],
					'firstName'      => $record["first_name"],
					'lastName'       => $record["last_name"],
					'roleId'         => $record["role_id"],
					'organizationId' => $record["organization_id"],
					'orgName'        => $record->organization["name"],
					'avatar'         => $record["avatar"],
				];
			}
			$this->set($user);
			$this->api->sendResult($user);
		});
	}

	private function set($user) {
		$_SESSION["user"] = $user;
	}

	function check() {
		if (!empty($_SESSION["user"])) {
			return $_SESSION["user"];
		}
		return NULL;
	}
}