'use strict';

angular.module('app.controllers.administrator', [])

	.controller('AdminAlignmentCtrl', function ($scope, $stateParams, Utility, Evaluations, Resources, Outcomes) {
					$scope.e = Evaluations;
					$scope.r = Resources;
					$scope.o = Outcomes;
					$scope.resource = null;
					$scope.currentInstrument = null;

					Evaluations.initialize();
					Resources.initialize();
					Outcomes.initialize();

					if (!Utility.empty($stateParams)) {
						var resourceId = $stateParams.resourceId;
						if (!Utility.empty(resourceId)) {
							$scope.resource = $scope.r.get(resourceId);
							$scope.resource.location = 'modules/' + $scope.resource.number.toLowerCase() + '.html';
						}
						var outcomeId = $stateParams.outcomeId;
						if (!Utility.empty(outcomeId)) {
							$scope.outcome = $scope.o.find(outcomeId);
						}
					}
					$scope.getInstrumentAlignments = function (instrument, resourceId) {
						if (!Utility.empty(instrument)) {
							Resources.retrieveAlignments(instrument, resourceId, instrument.questions);
							$scope.currentInstrument = instrument;
							$scope.getQuestions();
						}
						return $scope.currentInstrument;
					};
					$scope.getQuestions = function () {
						if (!Utility.empty($scope.currentInstrument)) {
							return $scope.currentInstrument.questions;
						}
						return null;
					}
				})
	.controller('AdminDashboardCtrl', function ($scope, Utility, Organizations, Members, Evaluations, Resources, Outcomes) {
					$scope.o = Organizations;
					$scope.m = Members;
					Organizations.initialize();
					Members.initialize();
					Resources.initialize();
					Outcomes.initialize();
				})
	.controller('AdminSettingsCtrl', function ($scope, Organizations) {
					$scope.settings = {
						sampleSetting: true
					};
				});
