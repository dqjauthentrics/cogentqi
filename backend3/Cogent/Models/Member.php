<?php
namespace Cogent\Models;

use Phalcon\Mvc\Model\Validator\Email as Email;

class Member extends CogentModel {

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
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'member';
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
		$this->hasMany('id', 'Cogent\Models\Assessment', 'member_id', ['alias' => 'Assessments']);
		$this->hasMany('id', 'Cogent\Models\Recommendation', 'member_id', ['alias' => 'Recommendations']);
		$this->hasMany('id', 'Cogent\Models\MemberBadge', 'member_id', ['alias' => 'MemberBadges']);
		$this->hasMany('id', 'Cogent\Models\Relationship', 'superior_id', ['alias' => 'Subordinates']);

		$this->belongsTo('role_id', 'Cogent\Models\Role', 'id', ['alias' => 'Role', 'foreignKey' => TRUE]);
		$this->belongsTo('organization_id', "Cogent\Models\Organization", 'id', ['alias' => 'Organization', 'foreignKey' => TRUE]);
	}

	/**
	 *
	 * @return array
	 */
	public function map($options = ['lastAssessment']) {
		$map = parent::map();
		$map['ari'] = $this->role->app_role_id;
		$map['role'] = $this->role->name;
		$map['rn'] = $this->role->name;
		if (in_array('badges', $options)) {
			$jsonBadges = [];
			foreach ($this->memberBadges as $badge) {
				$jsonBadges[] = $badge->map();
			}
			$map["badges"] = $jsonBadges;
		}
		if (in_array('assessments', $options)) {
			$jsonAssessments = [];
			foreach ($this->assessments as $assessment) {
				$jsonAssessments[] = $assessment->map();
			}
			$map["assessments"] = $jsonAssessments;
		}
		if (in_array('lastAssessment', $options)) {
			$map["lastAssessment"] = $this->mapLastAssessment();
		}
		return $map;
	}

	/**
	 * @return array
	 */
	public function mapLastAssessment() {
		$mapped = NULL;
		$lastAssessment = \Cogent\Models\Assessment::query()
			->where('member_id = :memberId:')
			->bind(['memberId' => $this->id])
			->orderBy('last_modified DESC')
			->execute()->getFirst();
		/** @var Assessment $lastAssessment */
		if (!empty($lastAssessment)) {
			$mapped = $lastAssessment->map();
			$mapped['instrument'] = $lastAssessment->instrument->map();
			$mapped['schedule'] = $lastAssessment->schedule->map();
		}
		return $mapped;
	}
}
