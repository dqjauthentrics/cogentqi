/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Roles', []).service('Roles', function ($cookieStore, $resource, $http, Utility) {
	var svc = this;

	svc.retrieve = function () {
		return $resource('/api2/appRole/a/b/c', {}, {});
	};
});
