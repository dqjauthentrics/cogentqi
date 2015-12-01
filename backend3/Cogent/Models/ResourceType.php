<?php

class ResourceType extends Cogent\Models\CogentModel {

    /**
     *
     * @var string
     */
    public $id;

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
    public $description;

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return ResourceType[]
     */
    public static function find($parameters = NULL) {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     *
     * @return ResourceType
     */
    public static function findFirst($parameters = NULL) {
        return parent::findFirst($parameters);
    }

    /**
     * Initialize method for model.
     */
    public function initialize() {
        $this->hasMany('id', 'Resource', 'resource_type_id', ['alias' => 'Resource']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource() {
        return 'resource_type';
    }

}
