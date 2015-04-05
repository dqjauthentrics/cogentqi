'use strict';

angular.module('app.controllers.manager', [])

	.controller('DashboardCtrl', function ($scope, Organizations) {
					$scope.data = {myOrg: {}};
					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
				})

	.controller('MemberCtrl', function ($scope, $stateParams, Utility, Icons, Instruments, Organizations, Members) {
					$scope.data = {myOrg: {}, organizations: [], instruments: [], member: {}, evaluations: [], instrument: null};

					$scope.Members = Members;
					$scope.Icons = Icons;

					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
						$scope.setRptConfigHx();
					});
					Members.retrieve().query(function (response) {
						$scope.data.members = response;
						$scope.setRptConfigHx();
					});

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.memberId)) {
						Members.retrieveSingle($stateParams.memberId).query(function (response) {
							response.roleName = Members.roleName(response);
							$scope.data.member = response;
							$scope.setRptConfigHx();
						});
					}
					$scope.setRptConfigHx = function () {
						if (!Utility.empty($scope.data.member) && Utility.empty($scope.data.member.rptConfigHx) && !Utility.empty($scope.data.instruments) && !Utility.empty($scope.data.member.evaluations)) {
							Instruments.collate($scope.data.instruments);
							$scope.data.instrument = Utility.findObjectById($scope.data.instruments, $scope.data.member.evaluations[0].instrumentId);
							$scope.data.member.rptConfigHx = Members.rptConfigHx($scope.data.instruments, $scope.data.member, $scope.data.member.evaluations);
						}
					};

					$scope.getRptConfigHx = function () {
						return $scope.data.member.rptConfigHx;
					};
				})

	.controller('OutcomeCtrl', function ($scope, Utility, Instruments, Organizations, Outcomes) {
					$scope.data = {myOrg: {}, learningModules: []};

					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
					});
					Outcomes.retrieve(true).query(function (response) {
						$scope.data.outcomes = response;
					});
					$scope.findQuestionName = function (questionId) {
						if (!Utility.empty($scope.data.instruments) && !Utility.empty(questionId)) {
							var question = Instruments.findQuestion($scope.data.instruments, questionId);
							if (!Utility.empty(question)) {
								return question.name;
							}
						}
						return null;
					};
					$scope.methodMessage = function (method) {
						if (method == "D") {
							return "NOTE: This outcome level is calculated through examination of data; it is not recommended that you manually change it.";
						}
						return "Manually configured outcome level.";
					};
				})

	.controller('ResourceCtrl', function ($scope, $stateParams, Utility, LearningModules, Organizations, Resources, Quiz) {
					$scope.data = {myOrg: {}, learningModules: [], resources: [], resource: {}};
					$scope.playerVars = {controls: 2, autoplay: 0, modestbranding: 1, rel: 0, theme: 'light'};

					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					LearningModules.retrieve().query(function (response) {
						$scope.data.learningModules = response;
					});
					Resources.retrieve().query(function (response) {
						$scope.data.resources = response;
						if (!Utility.empty($stateParams)) {
							var resourceId = $stateParams.resourceId;
							if (!Utility.empty(resourceId)) {
								$scope.data.resource = Utility.findObjectById($scope.data.resources, resourceId);
								if (!Utility.empty($scope.data.resource)) {
									$scope.data.resource.location = 'modules/' + $scope.data.resource.number.toLowerCase() + '.html';
								}
							}
						}
					});
				})

	.controller('PlanningCtrl', function ($scope, $stateParams, Utility, Organizations, LearningModules, Resources) {
					var collated = false;
					$scope.data = {myOrg: {}, learningModules: [], resources: [], resource: {}};

					Resources.retrieve().query(function (response) {
						$scope.data.resources = response;
						$scope.collate();
					});
					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					LearningModules.retrieve().query(function (response) {
						$scope.data.learningModules = response;
						$scope.collate();
					});
					$scope.collate = function () {
						if (!collated && !Utility.empty($scope.data.learningModules) && !Utility.empty($scope.data.resources)) {
							collated = true;
							for (var i = 0; i < $scope.data.learningModules.length; i++) {
								$scope.data.learningModules[i].resource =
									Utility.findObjectById($scope.data.resources, $scope.data.learningModules[i].resourceId);
							}
						}
					};
				})

	.controller('SettingsCtrl', function ($scope, Organizations, Settings) {
					$scope.data = {myOrg: {}, settings: []};

					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					Settings.retrieve().query(function (response) {
						$scope.data.settings = response;
					});
				});

