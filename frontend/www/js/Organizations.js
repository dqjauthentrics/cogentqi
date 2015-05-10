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

	svc.retrieve = function (organizationId) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			var orgId = !Utility.empty(organizationId)? organizationId : user.organizationId;
			return $resource('/api/organization/children/' + orgId, {}, {});
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