<?php
/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
namespace App\Components;

use Drahak\Restful\IResource;
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
		$router[] = new Route('sign/in/u/<username>/p/<password>', 'Sign:debug');
		$router[] = new Route('sign/out/a/b/c', 'Sign:logout');
		$router[] = new Route('assessment/matrix/o/<organizationId>/i/<instrumentId>', 'Assessment:matrix');
		$router[] = new Route('assessment/report/pbm/o/<organizationId>/i/<instrumentId>[/r/<rollUp>]', 'Assessment:progressByMonth');
		$router[] = new Route('assessment/report/pbmi/m/<memberId>', 'Assessment:progressByMonthIndividual');
		$router[] = new Route('message/send', 'Message:send');
		$router[] = new CrudRoute('<presenter>[/<id>][/r/<relation>][/m/<mode>][/i/<inactive>]',
			[
				'presenter' => [
					Route::VALUE        => 'Homepage',
					Route::FILTER_TABLE => [
						'member-note' => 'MemberNote',
					],
				],
				'action'    => [
					IResourceRouter::POST   => 'create<Relation>',
					IResourceRouter::GET    => 'read<Relation>',
					IResourceRouter::PUT    => 'update<Relation>',
					IResourceRouter::DELETE => 'delete<Relation>'
				],
			]);
		$router[] = new Route('appRole/a/b/c/', 'AppRole:read'); // temporary, just to get route to work!!!
		return $router;
	}

}
