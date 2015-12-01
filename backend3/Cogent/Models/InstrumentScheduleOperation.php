<?php

class InstrumentScheduleOperation extends Cogent\Models\CogentModel {

    /**
     *
     * @var integer
     */
    public $id;

    /**
     *
     * @var integer
     */
    public $instrument_schedule_id;

    /**
     *
     * @var string
     */
    public $role_id;

    /**
     *
     * @var string
     */
    public $operation_id;

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return InstrumentScheduleOperation[]
     */
    public static function find($parameters = NULL) {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return InstrumentScheduleOperation
     */
    public static function findFirst($parameters = NULL) {
        return parent::findFirst($parameters);
    }

    /**
     * Initialize method for model.
     */
    public function initialize() {
        $this->belongsTo('instrument_schedule_id', 'InstrumentSchedule', 'id', ['alias' => 'InstrumentSchedule']);
        $this->belongsTo('role_id', 'AppRole', 'id', ['alias' => 'AppRole']);
        $this->belongsTo('operation_id', 'Operation', 'id', ['alias' => 'Operation']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource() {
        return 'instrument_schedule_operation';
    }

}
