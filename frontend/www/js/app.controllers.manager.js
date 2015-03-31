'use strict';

angular.module('app.controllers.manager', [])

	.controller('DashboardCtrl', function ($scope, Members) {
					$scope.members = Members.retrieve();
				})

	.controller('MemberCtrl', function ($scope, $stateParams, Utility, Icons, Instruments, Organizations, Members, Evaluations) {
					$scope.instruments = Instruments.retrieve();
					$scope.members = Members.retrieve();
					$scope.myOrg = Organizations.retrieveMine();
					$scope.organizations = Organizations.retrieve();

					$scope.Members = Members;
					$scope.Icons = Icons;
					$scope.Evaluations = Evaluations;

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
						$scope.member = Members.find($stateParams.memberId);
					}
					$scope.getMembers = function () {
						return Members.retrieve();
					};
				})

	.controller('OutcomeCtrl', function ($scope, Instruments, Outcomes) {
					$scope.instruments = Instruments.retrieve();
					$scope.getOutcomes = function () {
						return Outcomes.retrieve();
					};
					$scope.findQuestion = function (questionId) {
						return Instruments.findQuestion(questionId);
					}
				})

	.controller('ResourceCtrl', function ($scope, $stateParams, LearningModules, Utility, Resources) {
					$scope.playerVars = {controls: 2, autoplay: 0, modestbranding: 1, rel: 0, theme: 'light'};
					$scope.learningModules = LearningModules.retrieve();
					$scope.resource = null;

					if (!Utility.empty($stateParams)) {
						var resourceId = $stateParams.resourceId;
						if (!Utility.empty(resourceId)) {
							$scope.resource = Resources.find(resourceId);
							$scope.resource.location = 'modules/' + $scope.resource.number.toLowerCase() + '.html';
						}
					}

					$scope.getResources = function () {
						return Resources.retrieve();
					};
				})
	.controller('PlanningCtrl', function ($scope, $stateParams, Utility, LearningModules) {
					$scope.learningModules = LearningModules.retrieve();
				})

	.controller('SettingsCtrl', function ($scope) {
					$scope.settings = Settings.retrieve();
				});

