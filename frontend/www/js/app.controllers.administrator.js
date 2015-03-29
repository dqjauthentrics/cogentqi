'use strict';

angular.module('app.controllers.administrator', [])

	.controller('AdminMatrixCtrl', function ($scope, $stateParams, Utility, Evaluations, Members, Resources) {
					$scope.e = Evaluations;
					$scope.m = Members;
					$scope.r = Resources;
					$scope.instrumentId = 1;

					console.log("CONTROLLER");
					Members.initialize();
					Evaluations.initialize();
					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.instrumentId)) {
						$scope.instrumentId = $stateParams.instrumentId;
					}
					if (Utility.empty($scope.instrumentId)) {
						$scope.instrumentId = 1;
					}
					Evaluations.getMatrixData($scope.instrumentId, true);
				})
	.controller('AdminOutcomeCtrl', function ($scope, $stateParams, Utility, Organizations, Evaluations, Outcomes) {
					$scope.Evaluations = Evaluations;
					$scope.Outcomes = Outcomes;
					$scope.out = Outcomes;
					$scope.Organizations = Organizations;
					$scope.outcomes = [];

					Organizations.initialize();
					Evaluations.initialize();
					Outcomes.initialize();

					$scope.getRubric = function (level) {
						var rubric = '';
						switch (parseInt(level)) {
							case 0:
								rubric = 'This outcome is not relevant, at the moment.';
								break;
							case 1:
								rubric = 'This outcome is unacceptable.  Urgent action is required.';
								break;
							case 2:
								rubric = 'The level of performance for this outcome is acceptable, but there is room for improvement.';
								break;
							case 3:
								rubric = 'This performance level is excellent.  No action is required.';
								break;
						}
						return rubric;
					};
				})
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
	.controller('AdminMemberCtrl', function ($scope, Utility, Organizations, Members, Evaluations, Resources, Outcomes) {
					$scope.o = Organizations;
					$scope.m = Members;
					Organizations.initialize();
					Members.initialize();
					Resources.initialize();
					Outcomes.initialize();
				})
	.controller('AdminDashboardCtrl', function ($scope, Utility, Organizations, Members, Evaluations, Resources, Outcomes) {
					$scope.Organizations = Organizations;
					$scope.Members = Members;
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
