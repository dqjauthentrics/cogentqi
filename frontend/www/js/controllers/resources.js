'use strict';

angular.module('ResourceControllers', [])

	.controller(
	'ResourceEditCtrl',
	function ($rootScope, $scope, $sce, $templateRequest, $stateParams, Utility, LearningModules, Organizations, Resources, Quizzes) {
		$scope.data = {resource: null, resources: null};

		Resources.retrieve().query(function (response) {
			$scope.data.resources = response;
			if (!Utility.empty($stateParams)) {
				var resourceId = $stateParams.resourceId;
				if (!Utility.empty(resourceId)) {
					$scope.data.resource = Utility.findObjectById($scope.data.resources, resourceId);
					if (!Utility.empty($scope.data.resource)) {
						$scope.setContent();
					}
				}
			}
		});

		$scope.setContent = function () {
			var url = $rootScope.siteDir() + '/modules/' + $scope.data.resource.number.toLowerCase() + '.html';
			$templateRequest(url).then(function (template) {
				$scope.data.content = template;
			}, function () {
				console.log("error occurred");
			});
		};

		$scope.htmlEncode = function (value) {
			return $('<div/>').text(value).html();
		}
	})

	.controller(
	'ResourceCtrl',
	function ($rootScope, $scope, $stateParams, Utility, LearningModules, Organizations, Resources, Quizzes) {
		$scope.data = {learningModules: [], resources: [], resource: {}};
		$scope.playerVars = {controls: 2, autoplay: 0, modestbranding: 1, rel: 0, theme: 'light'};

		LearningModules.retrieve().query(function (response) {
			$scope.data.learningModules = response;
		});

		Resources.retrieve().query(function (response) {
			console.log("resources: retrieve()");
			$scope.data.resources = response;
			if (!Utility.empty($stateParams)) {
				var resourceId = $stateParams.resourceId;
				if (!Utility.empty(resourceId)) {
					$scope.data.resource = Utility.findObjectById($scope.data.resources, resourceId);
					if (!Utility.empty($scope.data.resource)) {
						var urlBase = $rootScope.siteDir();
						$scope.data.resource.location = urlBase + '/modules/' + $scope.data.resource.number.toLowerCase() + '.html';
					}
				}
			}
		});
	})

	.controller(
	'ResourceAlignmentCtrl',
	function ($scope, $stateParams, $ionicPopup, Utility, Instruments, Resources) {
		$scope.res = null;
		$scope.data = {
			dirty: false,
			alignments: [],
			instruments: [],
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
		Utility.getResource(Resources.retrieve(), function (response) {
			$scope.data.resources = response;
			$scope.setResource();
		});

		$scope.saveResourceAlignments = function () {
			Resources.saveAlignments($scope.data.currentInstrumentId, $scope.data.resource.id, $scope.data.alignments, Utility.statusAlert);
		};
		$scope.setResourceAlignments = function () {
			if (!Utility.empty($scope.data.resource) && !Utility.empty($scope.data.currentInstrument)) {
				$scope.data.alignments = {};
				for (var z = 0; z < $scope.data.currentInstrument.questions.length; z++) {
					var questionId = $scope.data.currentInstrument.questions[z].id;
					$scope.data.alignments[questionId] = 0;
				}
				if (!Utility.empty($scope.data.resource) && !Utility.empty($scope.data.resource.alignments) && $scope.data.resource.alignments.length > 0) {
					for (var i = 0; i < $scope.data.resource.alignments.length; i++) {
						var alignment = $scope.data.resource.alignments[i];
						$scope.data.alignments[alignment.questionId] = alignment.weight;
					}
				}
			}
		};
		$scope.setResource = function () {
			if (!Utility.empty($stateParams)) {
				var resourceId = $stateParams.resourceId;
				if (!Utility.empty(resourceId)) {
					$scope.data.resource = Utility.findObjectById($scope.data.resources, resourceId);
					$scope.data.resource.location = 'modules/' + $scope.data.resource.number.toLowerCase() + '.html';
					$scope.setResourceAlignments();
				}
			}
			$scope.setResourceAlignments();
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
						$scope.data.alignments[alignment.questionId] = alignment.weight;
					}
				}
			}
		};
		$scope.setCurrentInstrument = function (instrumentId) {
			if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
				$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
				$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
				$scope.setResourceAlignments();
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
		$scope.isDirty = function () {
			return $scope.dirty;
		};
		$scope.setDirty = function () {
			$scope.dirty = true;
		};
	})

	.controller(
	'ResourceConfigureListCtrl',
	function ($scope, $stateParams, Instruments, Resources) {
		$scope.data = {instruments: [], resources: []};

		Instruments.retrieve().query(function (response) {
			$scope.data.instruments = response;
		});
		Resources.retrieve().query(function (response) {
			$scope.data.resources = response;
		});
	})

;