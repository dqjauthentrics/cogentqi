<?php

class MemberBadge extends \Phalcon\Mvc\Model {

	/**
	 *
	 * @var integer
	 */
	public $id;

	/**
	 *
	 * @var string
	 */
	public $title;

	/**
	 *
	 * @var integer
	 */
	public $member_id;

	/**
	 *
	 * @var string
	 */
	public $earned;

	/**
	 * Allows to query a set of records that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return MemberBadge[]
	 */
	public static function find($parameters = NULL) {
		return parent::find($parameters);
	}

	/**
	 * Allows to query the first record that match the specified conditions
	 *
	 * @param mixed $parameters
	 *
	 * @return MemberBadge
	 */
	public static function findFirst($parameters = NULL) {
		return parent::findFirst($parameters);
	}

	/**
	 * Returns table name mapped in the model.
	 *
	 * @return string
	 */
	public function getSource() {
		return 'member_badge';
	}

}
