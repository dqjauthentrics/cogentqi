/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('ControllerProfessional', [])

	.controller(
	'ProfDashboardCtrl',
	function ($cookieStore, $rootScope, $scope, Utility, Organizations, Members, Instruments, Assessments, Plans) {
		$scope.data = {instruments: [], assessments: [], members: [], planItems: [], user: $cookieStore.get('user')};

		try {
			Utility.getResource(Instruments.retrieve(), function (response) {
				$scope.data.instruments = response;
			});
			Utility.getResource(Members.retrieve(), function (response) {
				$scope.data.members = response;
				$scope.associate("members");
			});
			Utility.getResource(Plans.retrieve($cookieStore.get('user').id), function (response) {
				$scope.data.planItems = response;
			});
			Utility.getResource(Assessments.retrieveForMember($scope.data.user.id), function (response) {
				$scope.data.assessments = response;
				$scope.associate("evals");
			});
			$scope.recommendationFilter = function(planItem) {
				return planItem.s == 'R';
			};
			$scope.nonRecommendationFilter = function(planItem) {
				return planItem.s != 'R' && planItem.s != 'C';
			};
			$scope.completedFilter = function(planItem) {
				return planItem.s == 'C';
			};
		}
		catch (exception) {
			console.log("EXCEPTION:", exception);
		}

		$scope.associate = function (lbl) {
			if (!Utility.empty($scope.data.assessments) && !Utility.empty($scope.data.members)) {
				Assessments.associateMembers($scope.data.assessments, $scope.data.members);
			}
		};
		$scope.assessmentName = function (instrumentId) {
			var instrument = null;
			if (!Utility.empty($scope.data.instruments)) {
				for (var i = 0; i < $scope.data.instruments.length; i++) {
					if ($scope.data.instruments[i].id == instrumentId) {
						return $scope.data.instruments[i].n;
					}
				}
			}
			return instrument;
		};
		$scope.statusWord = function (statusId) {
			var word = 'Unknown';
			switch (statusId) {
				case 'C':
					word = 'Completed';
					break;
				case 'E':
					word = 'Enrolled';
					break;
				case 'R':
					word = 'Recommended';
					break;
				case 'W':
					word = 'Withdrawn';
					break;
			}
			return word;
		}
	})
;
