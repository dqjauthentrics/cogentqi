/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('OutcomeControllers', [])

	.controller(
		'OutcomeViewCtrl',
		function ($scope, $stateParams, Utility, Instruments, Organizations, Outcomes) {
			$scope.data = {outcome: null, currentInstrument: null, instruments: null};
			$scope.Instruments = Instruments;

			Utility.getResource(Instruments.retrieve(), function (response) {
				$scope.data.instruments = response;
				Instruments.collate($scope.data.instruments);
				if (!Utility.empty(response)) {
					$scope.setCurrentInstrument(response);
				}
			});
			$scope.setCurrentInstrument = function (instrument) {
				if (!Utility.empty(instrument) && !Utility.empty($scope.data.instruments)) {
					$scope.data.currentInstrument = instrument;
					$scope.data.currentInstrumentId = instrument.id;
					$scope.setOutcome();
				}
			};
			$scope.setOutcome = function () {
				if (!Utility.empty($stateParams)) {
					var outcomeId = $stateParams.outcomeId;
					Utility.getResource(Outcomes.retrieveSingle(outcomeId), function (response) {
						$scope.data.outcome = response;
					});
				}
				$scope.setOutcomeAlignments();
			};

		})

	.controller(
		'OutcomeOrganizationCtrl',
		function ($cookieStore, $scope, $stateParams, Utility, Organizations, Resources, Outcomes) {
			$scope.Outcomes = Outcomes;
			$scope.data = {organizations: [], currentOrg: {}, levels: []};
			$scope.user = $cookieStore.get('user');

			Utility.getResource(Outcomes.retrieveForOrg($scope.user.organizationId), function (response) {
				$scope.Outcomes.list = response.outcomes;
				$scope.data.organizations = response.orgLevels;
				$scope.setCurrentOrg(response.orgLevels[0]);
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
			$scope.getBarColor = function (outcome, currentOrg) {
				var color = 'stable';
				if (!Utility.empty(outcome) && !Utility.empty(currentOrg)) {
					var id = currentOrg.id;
					var level = outcome.lv;
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
					range.removeClass('range-stable').removeClass('range-assertive').removeClass('range-energized').removeClass('range-balanced').addClass(
						'range-' + color);
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
						rubric =
							'The level of performance for this outcome is acceptable and within the range of normal, but there is room for improvement.';
						break;
					case 3:
						rubric = 'This performance level is excellent, exceeding the prescribed normal minimums.  No action is required.';
						break;
				}
				return rubric;
			};
		})

	.controller(
		'OutcomeAlignmentsCtrl',
		function ($cookieStore, $scope, $stateParams, Utility, Outcomes) {
			$scope.Outcomes = Outcomes;
			$scope.data = {isLoading: true, searchFilter: ''};
			$scope.user = $cookieStore.get('user');

			if (Outcomes.list == null) {
				Utility.getResource(Outcomes.retrieveForOrg($scope.user.organizationId), function (response) {
					$scope.Outcomes.list = response.outcomes;
					$scope.data.isLoading = false;
				});
			}
			else {
				$scope.data.isLoading = false;
			}

			$scope.outcomeFilter = function (outcome) {
				return Outcomes.filterer(outcome, $scope.data.searchFilter);
			}
		})

	.controller(
		'OutcomeAlignmentCtrl',
		function ($scope, $stateParams, $ionicPopup, Utility, Instruments, Outcomes) {
			$scope.Outcomes = Outcomes;
			$scope.res = null;
			$scope.data = {dirty: false, saving: false, alignments: [], instruments: [], currentInstrument: null, currentInstrumentId: 1};

			Utility.getResource(Instruments.retrieve(), function (response) {
				$scope.data.instruments = response;
				Instruments.collate($scope.data.instruments);
				if (!Utility.empty(response)) {
					$scope.setCurrentInstrument(response[0].id);
				}
			});
			Utility.getResource(Outcomes.retrieve(), function (response) {
				$scope.Outcomes.list = response;
				$scope.setOutcome();
			});

			$scope.save = function () {
				$scope.data.saving = true;
				Outcomes.saveAlignments($scope.data.currentInstrumentId, $scope.Outcomes.current.id, $scope.data.alignments,
										function (status, data) {
											$scope.data.saving = false;
											$scope.data.dirty = false;
											Utility.statusAlert(status, data);
										});
			};
			$scope.setOutcomeAlignments = function () {
				if (!Utility.empty($scope.Outcomes.current) && !Utility.empty($scope.data.currentInstrument)) {
					$scope.data.alignments = {};
					for (var z = 0; z < $scope.data.currentInstrument.questions.length; z++) {
						var questionId = $scope.data.currentInstrument.questions[z].id;
						$scope.data.alignments[questionId] = 0;
					}
					if (!Utility.empty($scope.Outcomes.current) && !Utility.empty(
							$scope.Outcomes.current.alignments) && $scope.Outcomes.current.alignments.length > 0) {
						for (var i = 0; i < $scope.Outcomes.current.alignments.length; i++) {
							var alignment = $scope.Outcomes.current.alignments[i];
							$scope.data.alignments[alignment.qi] = alignment.wt;
						}
					}
				}
			};
			$scope.setOutcome = function () {
				if (!Utility.empty($stateParams)) {
					var outcomeId = $stateParams.outcomeId;
					if (!Utility.empty(outcomeId)) {
						$scope.Outcomes.current = Utility.findObjectById($scope.Outcomes.list, outcomeId);
						$scope.setOutcomeAlignments();
					}
				}
				$scope.setOutcomeAlignments();
			};
			$scope.setCurrentInstrument = function (instrumentId) {
				if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
					$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
					$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
					$scope.setOutcomeAlignments();
				}
			};
			$scope.alignmentLevelPhrase = function (level) {
				var phrase = 'Not Aligned';
				switch (parseInt(level)) {
					case 1:
						phrase = 'Partially Aligned';
						break;
					case 2:
						phrase = 'Aligned';
						break;
					case 3:
						phrase = 'Highly Aligned';
						break;
				}
				return phrase;
			};
		})
;
