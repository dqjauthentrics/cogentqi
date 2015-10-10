<?php

namespace App\Components;

use Nette;
use Nette\Application\Routers\RouteList;
use Nette\Application\Routers\Route;


class RouterFactory {

	/**
	 * @return Nette\Application\IRouter
	 */
	public static function createRouter() {
		$router = new RouteList;
		$router[] = new Route('<presenter>/<action>[/<id>]', 'Homepage:default');
		$router[] = new Route('<presenter>/<action=dependents>[/<id>]');
		$router[] = new Route('<presenter=Sign>/<action=in>/<username>/<password>');
		return $router;
	}

}
