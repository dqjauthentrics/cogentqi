<?php

class OutcomeEvent extends Cogent\Models\CogentModel {

    /**
     *
     * @var integer
     */
    public $id;

    /**
     *
     * @var integer
     */
    public $outcome_id;

    /**
     *
     * @var integer
     */
    public $member_id;

    /**
     *
     * @var string
     */
    public $occurred;

    /**
     *
     * @var string
     */
    public $name;

    /**
     *
     * @var string
     */
    public $category;

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return OutcomeEvent[]
     */
    public static function find($parameters = NULL) {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return OutcomeEvent
     */
    public static function findFirst($parameters = NULL) {
        return parent::findFirst($parameters);
    }

    /**
     * Initialize method for model.
     */
    public function initialize() {
        $this->belongsTo('outcome_id', 'Outcome', 'id', ['alias' => 'Outcome']);
        $this->belongsTo('member_id', 'Member', 'id', ['alias' => 'Member']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource() {
        return 'outcome_event';
    }

}
