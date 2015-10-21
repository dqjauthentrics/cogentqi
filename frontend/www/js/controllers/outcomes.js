'use strict';

angular.module('OutcomeControllers', [])

	.controller(
	'OutcomeCtrl',
	function ($scope, Utility, Instruments, Organizations, Outcomes) {
		$scope.data = {learningModules: []};

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
				return '<span style="color:red !important;">' +
					'NOTE: This outcome level is calculated through examination of data; it is not recommended that you manually change it.' +
					'</span>';
			}
			return "Manually configured outcome level.";
		};
	})

	.controller(
	'OutcomeOrganizationCtrl',
	function ($scope, $stateParams, Utility, Organizations, Resources, Outcomes) {
		$scope.data = {outcomes: [], organizations: [], currentOrg: {}, levels: []};

		Utility.getResource(Outcomes.retrieve(), function (response) {
			$scope.data.outcomes = response;
		});
		Utility.getResource(Organizations.retrieve(), function (response) {
			$scope.data.organizations = response;
			$scope.setCurrentOrg(response[0]);
		});
		$scope.setCurrentOrg = function (organization) {
			$scope.data.currentOrg = organization;
			Utility.getResource(Outcomes.retrieve($scope.data.currentOrg.id), function (response) {
				$scope.data.levels = response;
			});
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
	function ($scope, $stateParams, Instruments, Outcomes) {
		$scope.data = {instruments: [], resources: [], outcomes: []};

		Instruments.retrieve().query(function (response) {
			$scope.data.instruments = response;
		});
		Outcomes.retrieve().query(function (response) {
			$scope.data.outcomes = response;
		});
	})

	.controller(
	'OutcomeAlignmentCtrl',
	function ($scope, $stateParams, $ionicPopup, Utility, Instruments, Outcomes) {
		$scope.res = null;
		$scope.data = {
			dirty: false,
			saving: false,
			alignments: [],
			instruments: [],
			outcomes: [],
			outcoume: {},
			resources: [],
			resource: {},
			currentInstrument: null,
			currentInstrumentId: 1
		};

		Utility.getResource(Instruments.retrieve(), function (response) {
			$scope.data.instruments = response;
			Instruments.collate($scope.data.instruments);
			if (!Utility.empty(response)) {
				$scope.setCurrentInstrument(response[0].id);
			}
		});
		Utility.getResource(Outcomes.retrieve(), function (response) {
			$scope.data.outcomes = response;
			$scope.setOutcome();
		});

		$scope.save = function () {
			$scope.data.saving = true;
			Outcomes.saveAlignments($scope.data.currentInstrumentId, $scope.data.outcome.id, $scope.data.alignments,
									function (status, data) {
										$scope.data.saving = false;
										$scope.data.dirty = false;
										Utility.statusAlert(status, data);
									});
		};
		$scope.setOutcomeAlignments = function () {
			if (!Utility.empty($scope.data.outcome) && !Utility.empty($scope.data.currentInstrument)) {
				$scope.data.alignments = {};
				for (var z = 0; z < $scope.data.currentInstrument.questions.length; z++) {
					var questionId = $scope.data.currentInstrument.questions[z].id;
					$scope.data.alignments[questionId] = 0;
				}
				if (!Utility.empty($scope.data.outcome) && !Utility.empty($scope.data.outcome.alignments) && $scope.data.outcome.alignments.length > 0) {
					for (var i = 0; i < $scope.data.outcome.alignments.length; i++) {
						var alignment = $scope.data.outcome.alignments[i];
						$scope.data.alignments[alignment.qi] = alignment.wt;
					}
				}
			}
		};
		$scope.setOutcome = function () {
			if (!Utility.empty($stateParams)) {
				var outcomeId = $stateParams.outcomeId;
				if (!Utility.empty(outcomeId)) {
					$scope.data.outcome = Utility.findObjectById($scope.data.outcomes, outcomeId);
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
