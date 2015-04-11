'use strict';

angular.module('Organizations', []).service('Organizations', function ($resource, $http, $cookieStore, $rootScope, Utility, Members) {
	var svc = this;

	svc.retrieveMine = function () {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			return $resource('/api/organization/' + user.organizationId, {}, {query: {method: 'GET', isArray: false}});
		}
		return null;
	};

	svc.retrieve = function () {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			return $resource('/api/organization/children/' + user.organizationId, {}, {});
		}
		return null;
	};

	svc.members = function (organizationId) {
		if (!Utility.empty(organizationId)) {
			return $resource('/api/member/organization/' + organizationId, {}, {});
		}
		return [];
	};
});