<?php

namespace App\Components;

use Nette,
	Nette\Security\AuthenticationException,
	Nette\Security\Identity,
	Nette\Security\Passwords;


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
		$userData = [
			'id'             => $row["id"],
			'firstName'      => $row["first_name"],
			'lastName'       => $row["last_name"],
			'appRole'        => $row->role["app_role_id"],
			'roleId'         => $row["role_id"],
			'organizationId' => $row["organization_id"],
			'orgName'        => $row->organization["name"],
			'avatar'         => $row["avatar"],
			'jobTitle'       => $row["job_title"],
			'role'           => $row->role["name"],
		];
		return new Identity($row["id"], $row->role["app_role_id"], $userData);
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
