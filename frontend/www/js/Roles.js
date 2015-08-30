'use strict';

angular.module('Roles', []).service('Roles', function ($cookieStore, $resource, $http, Utility) {
	var svc = this;

	svc.retrieve = function () {
		return $resource('/api/role', {}, {});
	};
});
