<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Components;

use Nette\Security\Permission;

class Authorization extends Permission {
	const ROLE_GUEST = 'guest';
	const ROLE_PROFESSIONAL = 'P';
	const ROLE_MANAGER = 'M';
	const ROLE_ADMINISTRATOR = 'A';
	const ROLE_SYSADMIN = 'S';

	public function __construct() {
		/**
		 * Recognized user roles
		 */
		$this->addRole(self::ROLE_GUEST);
		$this->addRole(self::ROLE_PROFESSIONAL);
		$this->addRole(self::ROLE_MANAGER, self::ROLE_PROFESSIONAL);
		$this->addRole(self::ROLE_ADMINISTRATOR, self::ROLE_MANAGER);
		$this->addRole(self::ROLE_SYSADMIN, self::ROLE_ADMINISTRATOR);

		/**
		 * Recognized resources.
		 */
		$this->addResource('Homepage');
		$this->addResource('Assessment');
		$this->addResource('Instrument');
		$this->addResource('InstrumentSchedule');
		$this->addResource('Member');
		$this->addResource('MemberNote');
		$this->addResource('Message');
		$this->addResource('Module');
		$this->addResource('Organization');
		$this->addResource('Outcome');
		$this->addResource('OutcomeAlignment');
		$this->addResource('Question');
		$this->addResource('QuestionChoice');
		$this->addResource('QuestionType');
		$this->addResource('Recommendation');
		$this->addResource('Recommendations');
		$this->addResource('Resource');
		$this->addResource('AppRole');
		$this->addResource('Setting');
		$this->addResource('Sign');

		/**
		 * Rules and privileges, by role.
		 */
		$this->allow(self::ROLE_GUEST, ['Homepage', 'Sign'], self::ALL);
		$this->allow(self::ROLE_PROFESSIONAL, [
			'Assessment',
			'Homepage',
			'Instrument',
			'InstrumentSchedule',
			'Member',
			'MemberNote',
			'Module',
			'Message',
			'Organization',
			'Outcome',
			'OutcomeAlignment', //@TBD
			'Question',
			'QuestionChoice',
			'QuestionType',
			'Recommendation',
			'Recommendations',
			'Resource',
			'AppRole',
			'Setting',
			'Sign',
		], self::ALL);

		$this->allow(self::ROLE_ADMINISTRATOR, [
			'OutcomeAlignment',
		], self::ALL);

		# Admin has rights to everything
		$this->allow(self::ROLE_SYSADMIN, self::ALL, self::ALL);
	}
}
