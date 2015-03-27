'use strict';

angular.module('app.controllers.administrator', [])

	.controller('AdminAlignmentCtrl', function ($scope, $stateParams, Utility, Evaluations, Resources) {
					$scope.e = Evaluations;
					$scope.r = Resources;
					$scope.resource = null;

					Evaluations.initialize(Resources.initialize);

					if (!Utility.empty($stateParams)) {
						var resourceId = $stateParams.resourceId;
						if (!Utility.empty(resourceId)) {
							$scope.resource = $scope.r.get(resourceId);
							$scope.resource.location = 'modules/' + $scope.resource.number.toLowerCase() + '.html';
						}
					}
				})
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
