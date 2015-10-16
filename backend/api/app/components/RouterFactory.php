<?php

namespace App\Components;

use Nette,
	Nette\Application\Routers\RouteList,
	Nette\Application\Routers\Route,
	Drahak\Restful\Application\IResourceRouter,
	Drahak\Restful\Application\Routes\ResourceRoute,
	Drahak\Restful\Application\Routes\CrudRoute;


class RouterFactory {

	/**
	 * @return Nette\Application\IRouter
	 */
	public static function createRouter() {
		$router = new RouteList;
		$router[] = new CrudRoute('questionType/read[/<id>]', 'QuestionType');
		$router[] = new CrudRoute('instrumentSchedule/[/<id>]', 'InstrumentSchedule');
		$router[] = new Route('<presenter=Sign>/<action=in>/<username>/<password>');
		$router[] = new CrudRoute('<presenter>/<id>', 'Base');
		$router[] = new ResourceRoute('<presenter>[/<id>]', [
			'presenter' => 'Base',
			'action'    => [
				IResourceRouter::GET    => 'read<Relation>',
				IResourceRouter::DELETE => 'delete<Relation>'
			]
		], IResourceRouter::GET | IResourceRouter::DELETE);
		$router[] = new ResourceRoute('<presenter>/<id>/<relation>[/<recursive>]', [
			'presenter' => 'Base',
			'action'    => [
				IResourceRouter::GET    => 'read<Relation>',
				IResourceRouter::DELETE => 'delete<Relation>'
			]
		], IResourceRouter::GET | IResourceRouter::DELETE);
		$router[] = new Route('<presenter>/<action>[/<id>]', 'Homepage:default');
		return $router;
	}

}
