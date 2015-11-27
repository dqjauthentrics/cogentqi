<?php

class OutcomeAlignment extends \Phalcon\Mvc\Model {

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
    public $question_id;

    /**
     *
     * @var integer
     */
    public $weight;

    /**
     *
     * @var string
     */
    public $rel_wt;

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return OutcomeAlignment[]
     */
    public static function find($parameters = NULL) {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return OutcomeAlignment
     */
    public static function findFirst($parameters = NULL) {
        return parent::findFirst($parameters);
    }

    /**
     * Initialize method for model.
     */
    public function initialize() {
        $this->belongsTo('outcome_id', 'Outcome', 'id', ['alias' => 'Outcome']);
        $this->belongsTo('question_id', 'Question', 'id', ['alias' => 'Question']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource() {
        return 'outcome_alignment';
    }

}
