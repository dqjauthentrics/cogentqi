'use strict';

angular.module('app.controllers.administrator', [])

	.controller('AdminDashboardCtrl', function ($scope, Utility, Organizations, Members) {
					$scope.o = Organizations;
					$scope.m = Members;
					$scope.o.initialize();
				})
	.controller('AdminOrganizationCtrl', function ($scope, Utility, Organizations, Members) {
					$scope.o = Organizations;
					$scope.m = Members;
				})
	.controller('AdminSettingsCtrl', function ($scope, Organizations) {
					$scope.settings = {
						sampleSetting: true
					};
				});
