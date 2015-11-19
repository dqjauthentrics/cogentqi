<?php

use Phalcon\Mvc\Model\Validator\Email as Email;

class Member extends \Phalcon\Mvc\Model
{

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
     * Validations and business logic
     *
     * @return boolean
     */
    public function validation()
    {
        $this->validate(
            new Email(
                array(
                    'field'    => 'email',
                    'required' => true,
                )
            )
        );

        if ($this->validationHasFailed() == true) {
            return false;
        }

        return true;
    }

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->hasMany('id', 'Assessment', 'member_id', array('alias' => 'Assessment'));
        $this->hasMany('id', 'Assessment', 'assessor_id', array('alias' => 'Assessment'));
        $this->hasMany('id', 'MemberNote', 'member_id', array('alias' => 'MemberNote'));
        $this->hasMany('id', 'MemberNote', 'creator_id', array('alias' => 'MemberNote'));
        $this->hasMany('id', 'MemberNote', 'member_id', array('alias' => 'MemberNote'));
        $this->hasMany('id', 'MemberNote', 'creator_id', array('alias' => 'MemberNote'));
        $this->hasMany('id', 'OrganizationOutcome', 'evaluator_id', array('alias' => 'OrganizationOutcome'));
        $this->hasMany('id', 'OutcomeEvent', 'member_id', array('alias' => 'OutcomeEvent'));
        $this->hasMany('id', 'PlanItem', 'member_id', array('alias' => 'PlanItem'));
        $this->hasMany('id', 'Recommendation', 'member_id', array('alias' => 'Recommendation'));
        $this->hasMany('id', 'Resource', 'creator_id', array('alias' => 'Resource'));
        $this->belongsTo('organization_id', 'Organization', 'id', array('alias' => 'Organization'));
        $this->belongsTo('role_id', 'Role', 'id', array('alias' => 'Role'));
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'member';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Member[]
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Member
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
