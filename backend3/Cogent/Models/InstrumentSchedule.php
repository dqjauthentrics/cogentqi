<?php
namespace Cogent\Models;

class InstrumentSchedule extends CogentModel {

    /**
     *
     * @var integer
     */
    public $id;

    /**
     *
     * @var integer
     */
    public $instrument_id;

    /**
     *
     * @var string
     */
    public $starts;

    /**
     *
     * @var string
     */
    public $ends;

    /**
     *
     * @var string
     */
    public $locked_on;

    /**
     *
     * @var integer
     */
    public $nag_window_start;

    /**
     *
     * @var integer
     */
    public $nag_window_end;

    /**
     *
     * @var integer
     */
    public $is_shared;

    /**
     *
     * @var string
     */
    public $status_id;

    /**
     *
     * @var string
     */
    public $name;

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return InstrumentSchedule[]
     */
    public static function find($parameters = NULL) {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return InstrumentSchedule
     */
    public static function findFirst($parameters = NULL) {
        return parent::findFirst($parameters);
    }

    /**
     * Initialize method for model.
     */
    public function initialize() {
        $this->hasMany('id', 'Assessment', 'instrument_schedule_id', ['alias' => 'Assessment']);
        $this->hasMany('id', 'Assessment', 'instrument_schedule_id', ['alias' => 'Assessment']);
        $this->hasMany('id', 'Assessment', 'instrument_schedule_id', ['alias' => 'Assessment']);
        $this->hasMany('id', 'InstrumentScheduleOperation', 'instrument_schedule_id', ['alias' => 'InstrumentScheduleOperation']);
        $this->belongsTo('instrument_id', 'Instrument', 'id', ['alias' => 'Instrument']);
        $this->belongsTo('instrument_id', 'Instrument', 'id', ['alias' => 'Instrument']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource() {
        return 'instrument_schedule';
    }

}
