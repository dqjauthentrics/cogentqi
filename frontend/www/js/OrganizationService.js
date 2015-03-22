'use strict';

angular.module('app.organizations', ['app.members']).
	service('Organizations', function ($http, $cookieStore, $rootScope, Utility) {
				var svc = this;
				svc.apiUrl = '/api/organization';
				svc.mine = null;
				svc.organizations = [];
				svc.currentOrgMembers = [];
				svc.currentOrg = null;

				svc.initialize = function () {
					var user = $cookieStore.get('user');
					if (!Utility.empty(user) && Utility.empty(svc.mine)) {
						var organizationId = user.organizationId;
						$http.get(svc.apiUrl + '/' + organizationId).
							success(function (data, status, headers, config) {
										console.log("my org retrieved:", data);
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
					if (Utility.empty(svc.organizations) && !Utility.empty(user)) {
						svc.organizations = [{name: 'foo'}];
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
					console.log("SET CURRENT", organization);
					if (!Utility.empty(organization) && (Utility.empty(svc.currentOrgMembers) || svc.currentOrg.id != organization.id)) {
						svc.currentOrgMembers = ['zz'];
						svc.currentOrg = organization;
						$http.get('/api/member/organization/' + organization.id).
							success(function (data, status, headers, config) {
										console.log("org members retrieved:", data);
										svc.currentOrgMembers = data.result;
									}).
							error(function (data, status, headers, config) {
								  });
					}
					return svc.currentOrgMembers;
				};
			}
);