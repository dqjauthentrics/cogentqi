<?php

class Assessment extends \Phalcon\Mvc\Model {

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
     * @var integer
     */
    public $member_id;

    /**
     *
     * @var integer
     */
    public $assessor_id;

    /**
     *
     * @var string
     */
    public $last_saved;

    /**
     *
     * @var string
     */
    public $last_modified;

    /**
     *
     * @var string
     */
    public $assessor_comments;

    /**
     *
     * @var string
     */
    public $member_comments;

    /**
     *
     * @var string
     */
    public $score;

    /**
     *
     * @var integer
     */
    public $rank;

    /**
     *
     * @var string
     */
    public $edit_status;

    /**
     *
     * @var string
     */
    public $view_status;

    /**
     *
     * @var integer
     */
    public $instrument_schedule_id;

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return Assessment[]
     */
    public static function find($parameters = NULL) {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return Assessment
     */
    public static function findFirst($parameters = NULL) {
        return parent::findFirst($parameters);
    }

    /**
     * Initialize method for model.
     */
    public function initialize() {
        $this->hasMany('id', 'AssessmentResponse', 'assessment_id', ['alias' => 'AssessmentResponse']);
        $this->hasMany('id', 'Recommendation', 'assessment_id', ['alias' => 'Recommendation']);
        $this->belongsTo('member_id', 'Member', 'id', ['alias' => 'Member']);
        $this->belongsTo('assessor_id', 'Member', 'id', ['alias' => 'Member']);
        $this->belongsTo('instrument_id', 'Instrument', 'id', ['alias' => 'Instrument']);
        $this->belongsTo('instrument_schedule_id', 'InstrumentSchedule', 'id', ['alias' => 'InstrumentSchedule']);
        $this->belongsTo('instrument_schedule_id', 'InstrumentSchedule', 'id', ['alias' => 'InstrumentSchedule']);
        $this->belongsTo('instrument_schedule_id', 'InstrumentSchedule', 'id', ['alias' => 'InstrumentSchedule']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource() {
        return 'assessment';
    }

}
