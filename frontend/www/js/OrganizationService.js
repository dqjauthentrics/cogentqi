'use strict';

angular.module('app.organizations', []).
	service('Organizations', function ($http, $cookieStore, $rootScope, Utility, Members) {
				var svc = this;
				svc.apiUrl = '/api/organization';
				svc.mine = false;
				svc.organizations = false;
				svc.currentOrgMembers = false;
				svc.currentOrg = false;

				svc.initialize = function () {
					var user = $cookieStore.get('user');
					if (!Utility.empty(user) && svc.mine === false) {
						svc.mine = true;
						var organizationId = user.organizationId;
						$http.get(svc.apiUrl + '/' + organizationId).
							success(function (data, status, headers, config) {
										svc.mine = data.result;
										svc.getChildOrganizationsAndMine();
									}).
							error(function (data, status, headers, config) {
								  });
					}
					return svc.mine;
				};

				svc.getChildOrganizationsAndMine = function () {
					var user = $cookieStore.get('user');
					if (svc.organizations === false && !Utility.empty(user)) {
						svc.organizations = true;
						var organizationId = user.organizationId;
						$http.get(svc.apiUrl + '/children/' + organizationId).
							success(function (data, status, headers, config) {
										svc.organizations = data.result;
										if (!Utility.empty(svc.organizations)) {
											svc.setCurrentOrg(svc.organizations[0]);
										}
									}).
							error(function (data, status, headers, config) {
								  });
					}
					return svc.organizations;
				};

				svc.getMine = function () {
					svc.initialize();
					return svc.mine;
				};
				svc.setCurrentOrg = function (organization) {
					if (!Utility.empty(organization) && (svc.currentOrgMembers === false || svc.currentOrg.id != organization.id)) {
						svc.currentOrgMembers = true;
						svc.currentOrg = organization;
						$http.get('/api/member/organization/' + organization.id).
							success(function (data, status, headers, config) {
										svc.currentOrgMembers = data.result;
										Members.members = svc.currentOrgMembers;
									}).
							error(function (data, status, headers, config) {
								  });
					}
					return svc.currentOrgMembers;
				};
			}
);