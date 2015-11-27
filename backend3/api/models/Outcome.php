<?php

class Outcome extends \Phalcon\Mvc\Model {

    /**
     *
     * @var integer
     */
    public $id;

    /**
     *
     * @var string
     */
    public $number;

    /**
     *
     * @var string
     */
    public $name;

    /**
     *
     * @var string
     */
    public $summary;

    /**
     *
     * @var string
     */
    public $calc_method_id;

    /**
     *
     * @var string
     */
    public $method;

    /**
     *
     * @var integer
     */
    public $sort_order;

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return Outcome[]
     */
    public static function find($parameters = NULL) {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return Outcome
     */
    public static function findFirst($parameters = NULL) {
        return parent::findFirst($parameters);
    }

    /**
     * Initialize method for model.
     */
    public function initialize() {
        $this->hasMany('id', 'OrganizationOutcome', 'outcome_id', ['alias' => 'OrganizationOutcome']);
        $this->hasMany('id', 'OutcomeAlignment', 'outcome_id', ['alias' => 'OutcomeAlignment']);
        $this->hasMany('id', 'OutcomeEvent', 'outcome_id', ['alias' => 'OutcomeEvent']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource() {
        return 'outcome';
    }

}
