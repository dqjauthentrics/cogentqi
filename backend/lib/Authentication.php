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

	function __construct($api) {
		if (!isset($_SESSION)) {
			session_start();
		}
		$urlName = $this->urlName();
		$api->post("/authentication", function () use ($api, $urlName) {
			$args = $api->request()->post();
			$record = $api->db->member()->where('username=?', $args["username"])->fetch();
			$user = null;
			if (!empty($record)) {
				$member = new Member($api);
				$user = $member->map($record);
			}
			$this->set($user);
			$api->sendResult($user);
		});
	}

	private function set($user) {
		$_SESSION["user"] = $user;
	}

	function __destruct() {
		//if (isset($_SESSION)) {
		//	session_destroy();
		//}
	}

	function check() {
		$uri = $_SERVER["REQUEST_URI"];
		if (!empty($_SESSION["user"])) {
			return $_SESSION["user"];
		}
		return NULL;
	}
}