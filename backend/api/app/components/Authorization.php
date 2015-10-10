<?php
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
		$this->addResource('Sign');
		$this->addResource('Homepage');
		$this->addResource('Member');
		$this->addResource('Organization');
		$this->addResource('Recommendation');
		$this->addResource('Instrument');

		/**
		 * Rules and privileges, by role.
		 */
		$this->allow(self::ROLE_GUEST, ['Homepage', 'Sign'], self::ALL);
		$this->allow(self::ROLE_PROFESSIONAL, [
			'Sign',
			'Member',
			'Organization',
			'Recommendation',
			'Instrument'
		], self::ALL);

		# Admin has rights to everything
		$this->allow(self::ROLE_SYSADMIN, self::ALL, self::ALL);
	}
}
