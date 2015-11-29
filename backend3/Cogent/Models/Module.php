<?php

class Module extends Cogent\Models\CogentModel {

    /**
     *
     * @var integer
     */
    public $id;

    /**
     *
     * @var integer
     */
    public $resource_id;

    /**
     *
     * @var string
     */
    public $ends;

    /**
     *
     * @var string
     */
    public $sched_type;

    /**
     *
     * @var string
     */
    public $starts;

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return Module[]
     */
    public static function find($parameters = NULL) {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return Module
     */
    public static function findFirst($parameters = NULL) {
        return parent::findFirst($parameters);
    }

    /**
     * Initialize method for model.
     */
    public function initialize() {
        $this->hasMany('id', 'PlanItem', 'module_id', ['alias' => 'PlanItem']);
        $this->belongsTo('resource_id', 'Resource', 'id', ['alias' => 'Resource']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource() {
        return 'module';
    }

}
