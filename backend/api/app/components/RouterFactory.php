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
		$router[] = new Route('<presenter=Sign>/<action=in>/<username>/<password>');
		$router[] = new Route('assessment/matrix/o/<organizationId>/i/<instrumentId>', 'Assessment:matrix');
		$router[] = new Route('assessment/report/pbm/o/<organizationId>/i/<instrumentId>[/r/<rollUp>]', 'Assessment:progressByMonth');
		$router[] = new Route('assessment/report/pbmi/m/<memberId>', 'Assessment:progressByMonthIndividual');

		$router[] = new CrudRoute('<presenter>[/<id>][/r/<relation>][/m/<mode>]',
			[
				'presenter' => [
					Route::VALUE        => 'Homepage',
					//Route::FILTER_TABLE => [
						//'plan-items' => 'planItems',
					//],
				],
				'action'    => [
					IResourceRouter::POST   => 'create<Relation>',
					IResourceRouter::GET    => 'read<Relation>',
					IResourceRouter::DELETE => 'delete<Relation>'
				],
			]);
		return $router;
	}

}
