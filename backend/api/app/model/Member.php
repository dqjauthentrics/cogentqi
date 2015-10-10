<?php
namespace App\Model;

class Member extends BaseModel {
	var $id;
	var $first_name;
	var $last_name;
	var $organization_id;
	var $role_id;
	var $job_title;
	var $email;
	var $username;
	var $password;
	var $avatar;
	var $level;
	var $is_assessable;
	var $address;
	var $phone;
	var $mobile;
}