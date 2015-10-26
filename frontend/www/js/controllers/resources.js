'use strict';

angular.module('ResourceControllers', [])

	.controller(
		'ResourceEditCtrl',
		function ($rootScope, $scope, $sce, $templateRequest, $stateParams, Utility, Resources) {
			$scope.data = {dirty: false, saving: false, content: '', isLoading: true};
			$scope.Resources = Resources;

			if (!Utility.empty($stateParams) && !Utility.empty($stateParams.resourceId)) {
				Utility.getResource(Resources.retrieve($stateParams.resourceId), function (response) {
					$scope.Resources.current = response;
					console.log("loaded resource", $scope.Resources.current);
					$scope.data.isLoading = false;
				});
			}

			$scope.setContent = function () {
				try {
					var url = $rootScope.siteDir() + '/modules/' + $scope.Resources.current.nmb.toLowerCase() + '.html';
					$templateRequest(url).then(function (template) {
						$scope.data.content = template;
					}, function () {
						console.log("error occurred");
					});
				}
				catch (exception) {
					$scope.data.content = exception;
				}
			};
			$scope.getResources = function () {
				Utility.getResource(Resources.retrieve(), function (response) {
					$scope.Resources.list = response;
				});
			};
			$scope.htmlEncode = function (value) {
				return $('<div/>').text(value).html();
			};
			$scope.save = function () {
				$scope.data.saving = true;
				Resources.save($scope.Resources.current,
							   function (status, data) {
								   $scope.data.saving = false;
								   $scope.data.dirty = false;
								   $scope.Resources.list = null;
								   $scope.getResources();
								   if (!status) {
									   Utility.statusAlert(status, data);
								   }
							   }
				);
			};
		})

	.controller(
		'ResourceViewCtrl',
		function ($http, $rootScope, $scope, $stateParams, Utility, Resources) {
			$scope.Resources = Resources;
			$scope.data = {content: '', isLoading: true};
			$scope.playerVars = {controls: 2, autoplay: 0, modestbranding: 1, rel: 0, theme: 'light'};

			if (!Utility.empty($stateParams)) {
				var resourceId = $stateParams.resourceId;
				if ($scope.Resources.current == null || $scope.Resources.current.id != resourceId) {
					Utility.getResource(Resources.retrieve(resourceId), function (response) {
						$scope.Resources.current = response;
						var urlBase = $rootScope.siteDir();
						$scope.Resources.current.loc = urlBase + '/modules/' + $scope.Resources.current.nmb.toLowerCase() + '.html';
						$scope.data.isLoading = false;
					});
				}
			}
		})

	.controller(
		'ResourceListCtrl',
		function ($http, $rootScope, $scope, $stateParams, Utility, Resources) {
			$scope.Resources = Resources;
			$scope.data = {isLoading: true, searchFilter: ''};

			if ($scope.Resources.list == null) {
				Utility.getResource(Resources.retrieve(), function (response) {
					$scope.Resources.list = response;
					$scope.data.isLoading = false;
				});
			}
			else {
				$scope.data.isLoading = false;
			}

			$scope.resourceFilter = function (resource) {
				return Resources.filterer(resource, $scope.data.searchFilter);
			}
		})

	.controller(
		'ResourceAlignmentCtrl',
		function ($scope, $stateParams, $ionicPopup, Utility, Instruments, Resources) {
			$scope.res = null;
			$scope.data = {
				dirty: false,
				saving: false,
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

			$scope.save = function () {
				$scope.data.saving = true;
				Resources.saveAlignments($scope.data.currentInstrumentId, $scope.data.resource.id, $scope.data.alignments,
										 function (status, data) {
											 $scope.data.saving = false;
											 $scope.data.dirty = false;
											 Utility.statusAlert(status, data);
										 }
				);
			};
			$scope.initialize = function () {
				if (!Utility.empty($scope.data.resource) && !Utility.empty($scope.data.currentInstrument)) {
					$scope.data.alignments = {};
					for (var z = 0; z < $scope.data.currentInstrument.questions.length; z++) {
						var questionId = $scope.data.currentInstrument.questions[z].id;
						$scope.data.alignments[questionId] = 0;
					}
					if (!Utility.empty($scope.data.resource) && !Utility.empty($scope.data.resource.alignments) && $scope.data.resource.alignments.length > 0) {
						for (var i = 0; i < $scope.data.resource.alignments.length; i++) {
							var alignment = $scope.data.resource.alignments[i];
							$scope.data.alignments[alignment.qi] = alignment.wt;
						}
					}
				}
			};
			$scope.setResource = function () {
				if (!Utility.empty($stateParams)) {
					var resourceId = $stateParams.resourceId;
					if (!Utility.empty(resourceId)) {
						$scope.data.resource = Utility.findObjectById($scope.data.resources, resourceId);
						$scope.data.resource.location = 'modules/' + $scope.data.resource.nmb.toLowerCase() + '.html';
						$scope.initialize();
					}
				}
				$scope.initialize();
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
							$scope.data.alignments[alignment.questionId] = alignment.wt;
						}
					}
				}
			};
			$scope.setCurrentInstrument = function (instrumentId) {
				if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
					$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
					$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
					$scope.initialize();
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
;