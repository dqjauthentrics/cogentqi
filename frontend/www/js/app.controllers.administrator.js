'use strict';

angular.module('app.controllers.administrator', [])

	.controller('AdminMatrixCtrl', function ($scope, $stateParams, Utility, Instruments, Evaluations, Organizations, Members) {
					$scope.Instruments = Instruments;  //@todo Is this needed in views/directives?
					$scope.Members = Members; //@todo Is this needed in views/directives?
					$scope.Utility = Utility;

					$scope.data = {myOrg: {}, organizations: [], instruments: [], currentInstrument: {}, currentInstrumentId: 1};

					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						if (!Utility.empty(response)) {
							$scope.setCurrentInstrument(response[0].id);
						}
						console.log("retrieved instruments:", $scope.data, response);
					});
					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					Organizations.retrieve().query(function (response) {
						$scope.data.organizations = response;
					});
					Evaluations.retrieveMatrix($scope.data.currentInstrument, false).query(function (response) {
						console.log("retrieved matrix:", $scope.data, response);
						$scope.data.matrix = response;
					});

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.instrumentId)) {
						$scope.setCurrentInstrument($stateParams.instrumentId);
					}

					$scope.setCurrentInstrument = function (instrumentId) {
						console.log("set current instrument", instrumentId);
						if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
							$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
							$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
							//Instruments.currentSectionIdx = 0;
							console.log("set current:", $scope.data.currentInstrument);
							Evaluations.retrieveMatrix($scope.data.currentInstrument.id, true).query(function (response) {
								$scope.data.matrix = response;
								console.log("matrix retrieved:", $scope.data.matrix);
								Evaluations.calcMatrixAverages($scope.data.currentInstrument, $scope.data.matrix, true);
								console.log("matrix totals:", $scope.data.matrix);
							});
						}
					};
					$scope.getColHeaderNames = function () {
						return Instruments.findMatrixResponseRowHeader($scope.data.currentInstrument, 20)
					};
					$scope.getRowValues = function (dataRow) {
						return Evaluations.findMatrixResponseRowValues($scope.data.currentInstrument, Instruments.currentSectionIdx, dataRow.responses)
					};
				})

	.controller('AdminOutcomeCtrl', function ($scope, $stateParams, Utility, Organizations, Resources, Outcomes) {
					$scope.data = {orgOutcomes: [], myOrg: {}, organizations: [], resources: [], currentOrg: {}};

					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					Organizations.retrieve().query(function (response) {
						$scope.data.organizations = response;
						$scope.setCurrentOrg(response[0]);
					});
					Outcomes.retrieve().query(function (response) {
						$scope.data.orgOutcomes = response;
					});
					Resources.retrieve().query(function (response) {
						$scope.data.resources = response;
					});


					$scope.setCurrentOrg = function (organization) {
						$scope.data.currentOrg = organization;
					};
					$scope.getCurrentOrg = function (organization) {
						return $scope.data.currentOrg;
					};
					$scope.methodMessage = function (method) {
						if (method == "D") {
							return "NOTE: This outcome level is calculated through examination of data; it is not recommended that you manually change it.";
						}
						return "Manually configured outcome level.";
					};
					$scope.alignmentLevelPhrase = function (level) {
						var phrase = 'No Alignment';
						switch (parseInt(level)) {
							case 1:
								phrase = 'Partially Aligned';
								break;
							case 2:
								phrase = 'Well-Aligned';
								break;
							case 3:
								phrase = 'Highly Aligned';
								break;
						}
						return phrase;
					};
					$scope.getBarColor = function (outcome, currentOrgId) {
						var color = 'stable';
						if (!Utility.empty(outcome) && !Utility.empty(currentOrgId)) {
							var level = outcome.levels[currentOrgId][outcome.id];
							var range = $("#range" + outcome.id);
							switch (parseInt(level)) {
								case 1:
									color = 'assertive';
									break;
								case 2:
									color = 'energized';
									break;
								case 3:
									color = 'balanced';
									break;
							}
							range.removeClass('range-stable').removeClass('range-assertive').removeClass('range-energized').removeClass('range-balanced').addClass('range-' + color);
						}
						return 'range-' + color;
					};
					$scope.outcomeLevelPhrase = function (level) {
						var phrase = 'No Data';
						switch (parseInt(level)) {
							case 1:
								phrase = 'Unacceptable';
								break;
							case 2:
								phrase = 'Acceptable';
								break;
							case 3:
								phrase = 'Excellent';
								break;
						}
						return phrase;
					};
					$scope.isCurrent = function (organization) {
						return !Utility.empty(organization) && !Utility.empty($scope.data.currentOrg) && organization.id == $scope.data.currentOrg.id;
					};
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
								rubric = 'The level of performance for this outcome is acceptable and within the range of normal, but there is room for improvement.';
								break;
							case 3:
								rubric = 'This performance level is excellent, exceeding the prescribed normal minimums.  No action is required.';
								break;
						}
						return rubric;
					};
				})
	.controller('AdminAlignmentCtrl', function ($scope, $stateParams, Utility, Instruments, Resources, Outcomes) {
					$scope.instruments = Instruments.retrieve();
					$scope.outcomes = Outcomes.retrieve();
					$scope.resources = Resources.retrieve();
					$scope.resource = null;
					$scope.outcome = null;
					$scope.questions = null;
					$scope.alignments = null;
					$scope.currentInstrument = Instruments.getcurrent();
					$scope.currentInstrumentId = Instruments.currentInstrumentId;

					if (!Utility.empty($stateParams)) {
						var resourceId = $stateParams.resourceId;
						if (!Utility.empty(resourceId)) {
							$scope.resource = Resources.find(resourceId);
							$scope.resource.location = 'modules/' + $scope.resource.number.toLowerCase() + '.html';
							$scope.alignments = Resources.findAlignments($scope.currentInstrument, resourceId);
						}
						var outcomeId = $stateParams.outcomeId;
						if (!Utility.empty(outcomeId)) {
							$scope.outcome = Outcomes.find(outcomeId);
						}
					}
					$scope.getInstrumentAlignments = function (instrument, resourceId) {
						if (!Utility.empty(instrument)) {
							Resources.retrieveAlignments(instrument, resourceId, instrument.questions);
							Instruments.setCurrent(instrument.id);
							$scope.questions = $scope.getQuestions();
						}
						return $scope.currentInstrument;
					};
					$scope.setCurrentInstrument = function (currentInstrumentId) {
						$scope.currentInstrument = Instruments.find(currentInstrumentId);
						$scope.alignments = Resources.findAlignments($scope.currentInstrument, $scope.resource.id);
					};
					$scope.getQuestions = function () {
						return Instruments.currentQuestions();
					};
					$scope.getResources = function () {
						return Resources.resources;
					};
					$scope.getInstruments = function () {
						return Instruments.instruments;
					};
					$scope.getAlignments = function () {
						return $scope.alignments;
					};
				})
	.controller('AdminMemberCtrl', function ($scope, Utility, Organizations, Members) {
					$scope.data = {myOrg: {}, organizations: [], currentMembers: [], currentOrg: {}};

					$scope.Members = Members;  //@todo currently need to pass through to memberItem tag

					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					Organizations.retrieve().query(function (response) {
						$scope.data.organizations = response;
						$scope.setCurrentOrg(response[0]);  // @todo This shows up in the console, but does not update the view!
					});
					$scope.setCurrentOrg = function (organization) {
						$scope.data.currentOrg = organization;
						$scope.data.currentMembers = [];
						Organizations.members(organization.id).query(function (response) {
							$scope.data.currentMembers = response;
						});
					};
					$scope.isCurrent = function (organization) {
						return !Utility.empty(organization) && !Utility.empty($scope.data.currentOrg) && organization.id == $scope.data.currentOrg.id;
					};
				})
	.controller('AdminDashboardCtrl', function ($scope, Utility, Organizations) {
					$scope.data = {myOrg: {}, organizations: [], currentMembers: [], currentOrg: {}};
					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
				})
	.controller('AdminConfigurationCtrl', function ($scope, Instruments, Organizations, Resources, Outcomes) {
					$scope.data = {myOrg: {}, organizations: [], instruments: [], resources: [], outcomes: []};

					Organizations.retrieveMine().query(function (response) {
						$scope.data.myOrg = response;
					});
					Organizations.retrieve().query(function (response) {
						$scope.data.organizations = response;
					});
					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
					});
					Resources.retrieve().query(function (response) {
						$scope.data.resources = response;
					});
					Outcomes.retrieve().query(function (response) {
						$scope.data.outcomes = response;
					});
				});
