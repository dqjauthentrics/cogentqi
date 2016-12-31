<?php
namespace App\Models;

use App\Components\Utility;
use Phalcon\Mvc\Model\Validator\Email as Email;

/**
 * Class Member
 * @package App\Models
 *
 * @method \Phalcon\Mvc\Model\Resultset\Simple|PlanItem[]    getPlanItems($parameters = [])
 * @method \Phalcon\Mvc\Model\Resultset\Simple|MemberBadge[] getBadges($parameters = [])
 * @method \Phalcon\Mvc\Model\Resultset\Simple|MemberNote[]  getNotes($parameters = [])
 * @method \Phalcon\Mvc\Model\Resultset\Simple|Assessment[]  getAssessments($parameters = [])
 * @method \Phalcon\Mvc\Model\Resultset\Simple|MemberEvent[] getEvents($parameters = [])
 *
 * @property \Phalcon\Mvc\Model\Resultset\Simple|PlanItem[]    $planItems
 * @property \Phalcon\Mvc\Model\Resultset\Simple|MemberBadge[] $badges
 * @property \Phalcon\Mvc\Model\Resultset\Simple|MemberNote[]  $notes
 * @property \Phalcon\Mvc\Model\Resultset\Simple|Assessment[]  $assessments
 * @property \Phalcon\Mvc\Model\Resultset\Simple|MemberEvent[] $events
 *
 */
class Member extends AppModel {

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
	 *
	 * @var integer
	 */
	public $external_id;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Member[]|\Phalcon\Mvc\Model[]|\Phalcon\Mvc\Model\ResultInterface[]|\Phalcon\Mvc\Model\ResultsetInterface
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return Member|\Phalcon\Mvc\Model
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
		$this->hasMany('id', 'App\Models\PlanItem', 'member_id', ['alias' => 'PlanItems']);
		$this->hasMany('id', 'App\Models\Assessment', 'member_id', ['alias' => 'Assessments']);
		$this->hasMany('id', 'App\Models\Recommendation', 'member_id', ['alias' => 'Recommendations']);
		$this->hasMany('id', 'App\Models\MemberBadge', 'member_id', ['alias' => 'Badges']);
		$this->hasMany('id', 'App\Models\Relationship', 'superior_id', ['alias' => 'Subordinates']);
		$this->hasMany('id', 'App\Models\MemberNote', 'member_id', ['alias' => 'Notes']);
		$this->hasMany('id', 'App\Models\MemberEvent', 'member_id', ['alias' => 'Events']);

		$this->belongsTo('role_id', 'App\Models\Role', 'id', ['alias' => 'Role', 'foreignKey' => TRUE]);
		$this->belongsTo('organization_id', "App\Models\Organization", 'id', ['alias' => 'Organization', 'foreignKey' => TRUE]);
	}

	/**
	 * @param array $options
	 *
	 * @return array
	 */
	public function map($options = ['lastAssessment' => TRUE, 'badges' => TRUE, 'assessments' => TRUE, 'notes' => FALSE, 'events' => FALSE, 'minimal' => FALSE]) {
		$map = parent::map($options);
		unset($map['password']);
		if (!empty($options['badges'])) {
			$map["badges"] = $this->mapChildren('\App\Models\MemberBadge', 'member_id', 'earned DESC', ['minimal' => TRUE]);
		}
		if (!empty($options['notes'])) {
			$map["notes"] = $this->mapChildren('\App\Models\MemberNote', 'member_id', 'last_modified DESC', ['minimal' => TRUE]);
		}
		if (!empty($options['events'])) {
			$map['events'] = $this->mapChildren('\App\Models\MemberEvent', 'member_id', 'occurred DESC', ['minimal' => TRUE]);
		}
		if (!empty($options['assessments'])) {
			$map["assessments"] = $this->mapChildren('\App\Models\Assessment', 'member_id', 'last_modified DESC', ['minimal' => TRUE]);
		}
		if (!empty($options['lastAssessment'])) {
			$map["lastAssessment"] = $this->mapLastAssessment();
		}
		if (!empty($options['minimal'])) {
			$map['minimal'] = 1; // flag to indicate we're returning minimal info, in case of permission checking
			$map = Utility::arrayRemoveByKey('address', $map);
			$map = Utility::arrayRemoveByKey('city', $map);
			$map = Utility::arrayRemoveByKey('state', $map);
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
			$mapped['instrument'] = $lastAssessment->getInstrument()->map(['minimal' => TRUE]);
			$mapped['schedule'] = $lastAssessment->getSchedule()->map(['minimal' => TRUE]);
		}
		return $mapped;
	}
}
