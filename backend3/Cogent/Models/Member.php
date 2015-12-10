<?php
namespace Cogent\Models;

use Cogent\Components\Utility;
use Phalcon\Mvc\Model\Validator\Email as Email;

/**
 * Class Member
 * @package Cogent\Models
 *
 * @property \Phalcon\Mvc\Model\Resultset\Simple|PlanItem[]    $planItems
 * @property \Phalcon\Mvc\Model\Resultset\Simple|MemberBadge[] $badges
 * @property \Phalcon\Mvc\Model\Resultset\Simple|MemberNote[]  $notes
 * @property \Phalcon\Mvc\Model\Resultset\Simple|Assessment[]  $assessments
 */
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
		$this->hasMany('id', 'Cogent\Models\PlanItem', 'member_id', ['alias' => 'PlanItems']);
		$this->hasMany('id', 'Cogent\Models\Assessment', 'member_id', ['alias' => 'Assessments']);
		$this->hasMany('id', 'Cogent\Models\Recommendation', 'member_id', ['alias' => 'Recommendations']);
		$this->hasMany('id', 'Cogent\Models\MemberBadge', 'member_id', ['alias' => 'MemberBadges']);
		$this->hasMany('id', 'Cogent\Models\Relationship', 'superior_id', ['alias' => 'Subordinates']);
		$this->hasMany('id', 'Cogent\Models\MemberNote', 'member_id', ['alias' => 'Notes']);

		$this->belongsTo('role_id', 'Cogent\Models\Role', 'id', ['alias' => 'Role', 'foreignKey' => TRUE]);
		$this->belongsTo('organization_id', "Cogent\Models\Organization", 'id', ['alias' => 'Organization', 'foreignKey' => TRUE]);
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = ['lastAssessment' => TRUE, 'badges' => TRUE, 'assessments' => FALSE, 'notes' => FALSE, 'minimal' => FALSE]) {
		$map = parent::map();
		$map['ari'] = $this->role->app_role_id;
		$map['role'] = $this->role->name;
		$map['rn'] = $this->role->name;
		if (empty($options['minimal'])) {
			if (!empty($options['badges'])) {
				$jsonBadges = [];
				foreach ($this->memberBadges as $badge) {
					$jsonBadges[] = $badge->map();
				}
				$map["badges"] = $jsonBadges;
			}
			if (!empty($options['notes'])) {
				$jsonNotes = [];
				foreach ($this->notes as $note) {
					$jsonNotes[] = $note->map();
				}
				$map["notes"] = $jsonNotes;
			}
			if (!empty($options['assessments'])) {
				$jsonAssessments = [];
				foreach ($this->assessments as $assessment) {
					$jsonAssessments[] = $assessment->map([]);
				}
				$map["assessments"] = $jsonAssessments;
			}
			if (!empty($options['lastAssessment'])) {
				$map["lastAssessment"] = $this->mapLastAssessment();
			}
		}
		else {
			$map = Utility::arrayRemoveByKey('ad', $map);
			$map = Utility::arrayRemoveByKey('cy', $map);
			$map = Utility::arrayRemoveByKey('sp', $map);
		}
		return $map;
	}

	/**
	 * @return array
	 */
	public function mapLastAssessment() {
		$mapped = NULL;
		$lastAssessment = Assessment::query()
			->where('member_id = :memberId:')
			->bind(['memberId' => $this->id])
			->orderBy('last_modified DESC')
			->execute()->getFirst();
		/** @var Assessment $lastAssessment */
		if (!empty($lastAssessment)) {
			$mapped = $lastAssessment->map([]);
			$mapped['instrument'] = $lastAssessment->getInstrument()->map([]);
			$mapped['schedule'] = $lastAssessment->getSchedule()->map([]);
		}
		return $mapped;
	}
}
