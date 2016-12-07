/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Organizations', []).service('Organizations', function ($resource, $http, $cookieStore, $rootScope, Utility, Members) {
	var svc = this;

	svc.retrieveMine = function () {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			return $resource('/api3/organization/get/' + user.oi, {}, {query: {method: 'GET', isArray: false}});
		}
		return null;
	};

	svc.retrieve = function (organizationId) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			var orgId = !Utility.empty(organizationId) ? organizationId : user.oi;
			return $resource('/api3/organization/index/' + orgId + '/1', {}, {query: {method: 'GET', isArray: false}});
		}
		return null;
	};

	svc.members = function (organizationId) {
		if (!Utility.empty(organizationId)) {
			return $resource('/api3/organization/members/' + organizationId, {}, {query: {method: 'GET', isArray: false}});
		}
		return [];
	};
});