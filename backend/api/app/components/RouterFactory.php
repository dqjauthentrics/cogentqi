<?php

namespace App\Components;

use Nette,
	Nette\Application\Routers\RouteList,
	Nette\Application\Routers\Route,
	Drahak\Restful\Application\Routes\CrudRoute;


class RouterFactory {

	/**
	 * @return Nette\Application\IRouter
	 */
	public static function createRouter() {
		$router = new RouteList;
		$router[] = new Route('<presenter>/<action>[/<id>]', 'Homepage:default');
		$router[] = new Route('<presenter=Sign>/<action=in>/<username>/<password>');
		$router[] = new CrudRoute('<presenter>/<id>', 'Base');
		$router[] = new CrudRoute('questionType/<id>', 'QuestionType');

		new CrudRoute('<module>/crud', 'BasePresenter');

		return $router;
	}

}
