<?php
namespace Api\Models;

use Phalcon\Mvc\Model\Validator\Email as Email;

class Member extends ApiModel {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var integer
	 */
	public $organization_id;

	/**
	 *
	 * @var string
	 */
	public $role_id;

	/**
	 *
	 * @var string
	 */
	public $first_name;

	/**
	 *
	 * @var string
	 */
	public $last_name;

	/**
	 *
	 * @var string
	 */
	public $job_title;

	/**
	 *
	 * @var string
	 */
	public $email;

	/**
	 *
	 * @var string
	 */
	public $username;

	/**
	 *
	 * @var string
	 */
	public $password;

	/**
	 *
	 * @var string
	 */
	public $avatar;

	/**
	 *
	 * @var integer
	 */
	public $level;

	/**
	 *
	 * @var integer
	 */
	public $is_assessable;

	/**
	 *
	 * @var string
	 */
	public $phone;

	/**
	 *
	 * @var string
	 */
	public $mobile;

	/**
	 *
	 * @var string
	 */
	public $address;

	/**
	 *
	 * @var string
	 */
	public $city;

	/**
	 *
	 * @var string
	 */
	public $state;

	/**
	 *
	 * @var string
	 */
	public $postal;

	/**
	 *
	 * @var string
	 */
	public $message_format;

	/**
	 *
	 * @var string
	 */
	public $active_start;

	/**
	 *
	 * @var string
	 */
	public $active_end;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Member[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Member
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Validations and business logic
	 *
	 * @return boolean
	 */
	public function validation() {
		$this->validate(new Email(['field' => 'email', 'required' => TRUE]));
		if ($this->validationHasFailed() == TRUE) {
			return FALSE;
		}
		return TRUE;
	}

	/**
	 * Initialize method for model.
	 */
	public function initialize() {
		/**
		 * $this->hasMany('id', 'Assessment', 'member_id', ['alias' => 'Assessment']);
		 * $this->hasMany('id', 'Assessment', 'assessor_id', ['alias' => 'Assessment']);
		 * $this->hasMany('id', 'MemberNote', 'member_id', ['alias' => 'MemberNote']);
		 * $this->hasMany('id', 'MemberNote', 'creator_id', ['alias' => 'MemberNote']);
		 * $this->hasMany('id', 'MemberNote', 'member_id', ['alias' => 'MemberNote']);
		 * $this->hasMany('id', 'MemberNote', 'creator_id', ['alias' => 'MemberNote']);
		 * $this->hasMany('id', 'OrganizationOutcome', 'evaluator_id', ['alias' => 'OrganizationOutcome']);
		 * $this->hasMany('id', 'OutcomeEvent', 'member_id', ['alias' => 'OutcomeEvent']);
		 * $this->hasMany('id', 'PlanItem', 'member_id', ['alias' => 'PlanItem']);
		 * $this->hasMany('id', 'Recommendation', 'member_id', ['alias' => 'Recommendation']);
		 * $this->hasMany('id', 'Resource', 'creator_id', ['alias' => 'Resource']);
		 **/
		$this->belongsTo('organization_id', 'Organization', 'id', ['alias' => 'Organization', 'foreignKey' => TRUE]);
		$this->belongsTo('role_id', 'Role', 'id', ['alias' => 'Role', 'foreignKey' => TRUE]);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'member';
	}

	/**
	 *
	 * @return array
	 */
	public function map() {
		$map = parent::map();
		$map['ari'] = $this->organization->name;
		return $map;
	}
}
