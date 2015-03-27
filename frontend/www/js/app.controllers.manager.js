'use strict';

angular.module('app.controllers.manager', [])

	.controller('DashboardCtrl', function ($scope, Members) {
					$scope.m = Members;
					Members.initialize();
				})

	.controller('MemberCtrl', function ($scope, $stateParams, Utility, Organizations, Members, Evaluations) {
					$scope.m = Members;
					$scope.a = Evaluations;
					$scope.member = null;
					Organizations.initialize();
					Members.initialize();
					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
						$scope.member = Members.find($stateParams.memberId);
					}
				})

	.controller('OutcomeCtrl', function ($scope, Outcomes, Evaluations) {
					$scope.o = Outcomes;
					$scope.e = Evaluations;
				})

	.controller('ResourceCtrl', function ($scope, $stateParams, LearningObjects, Utility, Resources) {
					$scope.playerVars = {controls: 2, autoplay: 0, modestbranding: 1, rel: 0, theme: 'light'};
					$scope.r = Resources;
					$scope.l = LearningObjects;
					$scope.resource = null;

					if (!Utility.empty($stateParams)) {
						var resourceId = $stateParams.resourceId;
						if (!Utility.empty(resourceId)) {
							$scope.resource = $scope.r.get(resourceId);
							$scope.resource.location = 'modules/' + $scope.resource.number.toLowerCase() + '.html';
						}
					}
				})
	.controller('PlanningCtrl', function ($scope, $stateParams, Utility, LearningObjects) {
					$scope.l = LearningObjects;
				})

	.controller('SettingsCtrl', function ($scope) {
					$scope.settings = {
						sampleSetting: true
					};
				});

