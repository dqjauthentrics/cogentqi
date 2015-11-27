<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Components;

use Nette;
use Nette\Security\AuthenticationException;
use Nette\Security\Identity;
use Nette\Security\Passwords;


/**
 * Users management.
 */
class UserManager extends Nette\Object implements Nette\Security\IAuthenticator {
	/** @var Nette\Database\Context */
	private $database;

	public function __construct(Nette\Database\Context $database) {
		$this->database = $database;
	}

	/**
	 * Performs an authentication.
	 * @return Nette\Security\Identity
	 * @throws Nette\Security\AuthenticationException
	 */
	public function authenticate(array $credentials) {
		list($username, $password) = $credentials;

		$row = $this->database->table('member')->where('username', $username)->fetch();
		if (!$row) {
			throw new AuthenticationException('The username is incorrect.', self::IDENTITY_NOT_FOUND);
		}
		elseif (md5($password) !== $row['password']) {
			throw new AuthenticationException('The password is incorrect.', self::INVALID_CREDENTIAL);
		}

		/**
		 * elseif (!Passwords::verify($password, $row[self::COLUMN_PASSWORD_HASH])) {
		 * throw new AuthenticationException('The password is incorrect.', self::INVALID_CREDENTIAL);
		 * }
		 * elseif (Passwords::needsRehash($row[self::COLUMN_PASSWORD_HASH])) {
		 * $row->update([self::COLUMN_PASSWORD_HASH => Passwords::hash($password)]);
		 * }
		 **/
		$appRole = $row->ref('app_role');
		$userData = [
			'id'             => $row["id"],
			'firstName'      => $row["first_name"],
			'lastName'       => $row["last_name"],
			'appRole'        => $appRole["app_role_id"],
			'roleId'         => $row["id"],
			'organizationId' => $row["organization_id"],
			'orgName'        => $row->organization["name"],
			'avatar'         => $row["avatar"],
			'jobTitle'       => $row["job_title"],
			'role'           => $appRole["name"],
		];
		return new Identity($row["id"], $appRole["app_role_id"], $userData);
	}

	/**
	 * Adds new user.
	 *
	 * @param  string $username
	 * @param  string $password
	 */
	public function add($username, $password) {
		$this->database->table('member')->insert(['username' => $username, 'password' => Passwords::hash($password)]);
	}
}
