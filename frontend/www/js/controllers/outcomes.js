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
				return "NOTE: This outcome level is calculated through examination of data; it is not recommended that you manually change it.";
			}
			return "Manually configured outcome level.";
		};
	})

	.controller(
	'OutcomeListCtrl',
	function ($scope, $stateParams, Utility, Organizations, Resources, Outcomes) {
		$scope.data = {orgOutcomes: [], organizations: [], currentOrg: {}};

		Utility.getResource(Organizations.retrieve(), function (response) {
			$scope.data.organizations = response;
			$scope.setCurrentOrg(response[0]);
		});
		Utility.getResource(Outcomes.retrieve(true), function (response) {
			$scope.data.orgOutcomes = response;
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
				var level = outcome.levels[id][outcome.id];
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
;
