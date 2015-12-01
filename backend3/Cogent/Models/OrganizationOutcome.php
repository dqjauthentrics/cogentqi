<?php

class OrganizationOutcome extends Cogent\Models\CogentModel {

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
     * @var integer
     */
    public $outcome_id;

    /**
     *
     * @var string
     */
    public $evaluated;

    /**
     *
     * @var integer
     */
    public $evaluator_id;

    /**
     *
     * @var string
     */
    public $evaluator_comments;

    /**
     *
     * @var integer
     */
    public $level;

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return OrganizationOutcome[]
     */
    public static function find($parameters = NULL) {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return OrganizationOutcome
     */
    public static function findFirst($parameters = NULL) {
        return parent::findFirst($parameters);
    }

    /**
     * Initialize method for model.
     */
    public function initialize() {
        $this->belongsTo('organization_id', 'Organization', 'id', ['alias' => 'Organization']);
        $this->belongsTo('outcome_id', 'Outcome', 'id', ['alias' => 'Outcome']);
        $this->belongsTo('evaluator_id', 'Member', 'id', ['alias' => 'Member']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource() {
        return 'organization_outcome';
    }

}
