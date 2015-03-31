'use strict';

angular.module('app.organizations', []).service('Organizations', function ($resource, $http, $cookieStore, $rootScope, Utility, Members) {
	var svc = this;
	svc.mine = null;
	svc.organizations = null;
	svc.currentOrgMembers = null;
	svc.currentOrg = null;
	svc.currentOrgIdx = null;

	svc.retrieveMine = function () {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			$resource('/api/organization/' + user.organizationId, {}, {query: {method: 'GET', isArray: false}}).query().$promise.then(function (data) {
				console.log("my organization: retrieved:", data);
				svc.mine = data;
			});
		}
		return svc.mine;
	};

	svc.retrieve = function () {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			$resource('/api/organization/children/' + user.organizationId, {}, {}).query().$promise.then(function (data) {
				console.log("child organization: retrieved:", data);
				svc.organizations = data;
				if (svc.organizations.length > 0) {
					svc.currentOrgIdx = 0;
					svc.currentOrg = svc.organizations[0];
				}
			});
		}
		return svc.organizations;
	};

	svc.getCurrent = function () {
		return svc.currentOrg;
	};

	svc.retrieveMembers = function (organizationId) {
		if (organizationId === null && !Utility.empty(svc.currentOrg)) {
			organizationId = svc.currentOrg.id;
		}
		console.log("organizations retrieve members request for org ID:", organizationId);
		if (!Utility.empty(organizationId)) {
			$resource('/api/member/organization/' + organizationId, {}, {}).query().$promise.then(function (data) {
				svc.currentOrgMembers = data;
				console.log("members retrieved for organization:", organizationId, svc.currentOrgMembers);
			});
		}
		return svc.currentOrgMembers;
	};

	svc.setCurrent = function (organizationId) {
		svc.currentOrg = null;
		svc.currentOrgMembers = null;
		svc.currentOrgIdx = null;
		for (var i = 0; i < svc.organizations.length; i++) {
			if (organizationId == svc.organizations[i].id) {
				svc.currentOrg = svc.organizations[i];
				svc.currentOrgIdx = i;
				svc.retrieveMembers(svc.currentOrg.id);
				return svc.currentOrg;
			}
		}
		return svc.currentOrg;
	};

	svc.getCurrentMembers = function () {
		return svc.currentOrgMembers;
	};

});