<?php
namespace Cogent\Plugins;

use Cogent\Models\Role;
use Phalcon\Acl;
use Phalcon\Acl\Adapter\Memory as AclList;
use Phalcon\Acl\Resource;
use Phalcon\Events\Event;
use Phalcon\Mvc\Dispatcher;
use Phalcon\Mvc\User\Plugin;

/**
 * SecurityPlugin
 *
 * Controls user access to modules.
 */
class SecurityPlugin extends Plugin {
	var $resourcePermissions = [
		'index'   => [
			'index' => NULL,
		],
		'session' => [
			'index'  => NULL,
			'login'  => NULL,
			'logout' => NULL,
		],
		'member'  => [
			'index'  => NULL,
			'get'    => NULL,
			'save'   => NULL,
			'create' => NULL,
			'delete' => NULL
		],
	];

	/**
	 * Returns an existing or new access control list
	 *
	 * @returns AclList
	 */
	public function getAcl() {
		if (1 || !isset($this->persistent->acl)) {
			$acl = new AclList();
			$acl->setDefaultAction(Acl::DENY);
			foreach (Role::$ROLES as $role) {
				$acl->addRole($role);
			}
			foreach ($this->resourcePermissions as $resource => $actions) {
				$acl->addResource(new Resource($resource), array_keys($actions));
				foreach ($actions as $action => $roles) {
					if ($roles === NULL) {
						$roles = Role::$ROLES;
					}
					if (!empty($roles)) {
						foreach ($roles as $role) {
							$acl->allow($role, $resource, $action);
						}
					}
				}
			}
			$this->persistent->acl = $acl;
		}
		return $this->persistent->acl;
	}

	/**
	 * This action is executed before execute any action in the application
	 *
	 * @param Event      $event
	 * @param Dispatcher $dispatcher
	 *
	 * @return bool
	 */
	public function beforeDispatch(Event $event, Dispatcher $dispatcher) {
		$auth = $this->session->get('auth');
		if (!$auth) {
			$role = Role::GUEST;
		}
		else {
			$role = $auth['ari'];
		}
		$controller = $dispatcher->getControllerName();
		$action = $dispatcher->getActionName();
		if (!in_array($controller, ['error', 'index'])) {
			$acl = $this->getAcl();
			$allowed = $acl->isAllowed($role, $controller, $action);
			if ($allowed != Acl::ALLOW) {
				$this->session->destroy();
				return FALSE;
			}
		}
		return TRUE;
	}
}
