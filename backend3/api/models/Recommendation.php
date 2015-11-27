<?php

class Recommendation extends \Phalcon\Mvc\Model {

    /**
     *
     * @var integer
     */
    public $id;

    /**
     *
     * @var integer
     */
    public $member_id;

    /**
     *
     * @var string
     */
    public $created_on;

    /**
     *
     * @var integer
     */
    public $assessment_id;

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return Recommendation[]
     */
    public static function find($parameters = NULL) {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return Recommendation
     */
    public static function findFirst($parameters = NULL) {
        return parent::findFirst($parameters);
    }

    /**
     * Initialize method for model.
     */
    public function initialize() {
        $this->hasMany('id', 'PlanItem', 'recommendation_id', ['alias' => 'PlanItem']);
        $this->belongsTo('member_id', 'Member', 'id', ['alias' => 'Member']);
        $this->belongsTo('assessment_id', 'Assessment', 'id', ['alias' => 'Assessment']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource() {
        return 'recommendation';
    }

}
