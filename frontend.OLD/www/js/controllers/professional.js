/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('ControllerProfessional', [])

	.controller(
		'ProfDashboardCtrl',
		function ($cookieStore, $rootScope, $scope, Utility, Organizations, Members, Instruments, Assessments, Plans) {
			$scope.data = {planItems: [], user: $cookieStore.get('user')};

			try {
				Utility.getResource(Plans.retrieve($cookieStore.get('user').id), function (response) {
					$scope.data.planItems = response.data;
				});
				$scope.recommendationFilter = function (planItem) {
					return planItem.s == 'R';
				};
				$scope.nonRecommendationFilter = function (planItem) {
					return planItem.s != 'R' && planItem.s != 'C';
				};
				$scope.completedFilter = function (planItem) {
					return planItem.s == 'C';
				};
			}
			catch (exception) {
				console.log("EXCEPTION:", exception);
			}
		})
;
