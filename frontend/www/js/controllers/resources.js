/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('ResourceControllers', [])

	.controller(
		'ResourceEditCtrl',
		function ($rootScope, $scope, $sce, $templateRequest, $stateParams, Utility, Resources) {
			$scope.data = {dirty: false, saving: false, content: '', isLoading: true};
			$scope.Resources = Resources;

			if (!Utility.empty($stateParams) && !Utility.empty($stateParams.resourceId)) {
				Utility.getResource(Resources.retrieve($stateParams.resourceId), function (response) {
					$scope.Resources.current = response.data;
					$scope.data.isLoading = false;
				});
			}

			$scope.setContent = function () {
				try {
					var url = $rootScope.siteDir() + '/modules/' + $scope.Resources.current.nmb.toLowerCase() + '.html';
					$templateRequest(url).then(function (template) {
						$scope.data.content = template;
					}, function () {
						console.log("error loading content");
					});
				}
				catch (exception) {
					$scope.data.content = exception;
				}
			};
			$scope.getResources = function () {
				Utility.getResource(Resources.retrieve(), function (response) {
					$scope.Resources.list = response.data;
				});
			};
			$scope.htmlEncode = function (value) {
				return $('<div/>').text(value).html();
			};
			$scope.save = function () {
				$scope.data.saving = true;
				Resources.save($scope.Resources.current,
							   function (response) {
								   $scope.data.saving = false;
								   $scope.data.dirty = false;
								   $scope.Resources.list = null;
								   $scope.getResources();
								   if (!status) {
									   Utility.statusAlert(response);
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
						if (response.status == 1) {
							$scope.Resources.current = response.data;
							var urlBase = $rootScope.siteDir();
							$scope.Resources.current.loc = urlBase + '/modules/' + $scope.Resources.current.nmb.toLowerCase() + '.html';
						}
						else {
							Utility.statusAlert(response);
						}
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

			$scope.Resources.loadAll(function (resources) {
				$scope.data.isLoading = false;
			});

			$scope.resourceFilter = function (resource) {
				return Resources.filterer(resource, $scope.data.searchFilter);
			}
		})

	.controller(
		'ResourceAlignmentCtrl',
		function ($scope, $stateParams, $ionicPopup, $timeout, Utility, Instruments, Resources) {
			$scope.res = null;
			$scope.data = {
				dirty: false,
				saving: false,
				alignments: [],
				instruments: [],
				resources: [],
				resource: {},
				currentInstrument: null,
				currentInstrumentId: 1,
				maxLen: 0
			};

			Utility.getResource(Instruments.retrieve(), function (response) {
				$scope.data.instruments = response.data;
				Instruments.collate($scope.data.instruments);
				if (!Utility.empty(response)) {
					$scope.setCurrentInstrument(response.data[0].id);
				}
			});
			Utility.getResource(Resources.retrieve(), function (response) {
				$scope.data.resources = response.data;
				$scope.setResource();
			});
			$scope.masterChange = function (sliderId, modelValue) {
				$scope.data.dirty = true;
				for (var i = 1; i < $scope.data.maxLen; i++) {
					$scope.data.alignments[sliderId][i].utility = modelValue;
				}
			};
			$scope.save = function () {
				$scope.data.saving = true;
				Resources.saveAlignments($scope.data.currentInstrumentId, $scope.data.resource.id, $scope.data.alignments,
										 function (response) {
											 $scope.data.saving = false;
											 $scope.data.dirty = false;
											 Utility.statusAlert(response);
										 }
				);
			};
			$scope.refreshSliderBroadcast = function () {
				$timeout(function () {
					$scope.$broadcast('rzSliderForceRender');
				});
			};
			$scope.initialize = function () {
				if (!Utility.empty($scope.data.resource) && !Utility.empty($scope.data.currentInstrument)) {
					$scope.data.alignments = {};
					var question = null;
					var z = 0;
					for (z = 0; z < $scope.data.currentInstrument.questions.length; z++) {
						question = $scope.data.currentInstrument.questions[z];
						var type = question.type;
						if (!Utility.empty(type) && question.type.choices.length > $scope.data.maxLen) {
							$scope.data.maxLen = question.type.choices.length;
						}
					}
					var emptyVals = [];
					for (var c = 0; c < $scope.data.maxLen; c++) {
						emptyVals.push(Utility.clone({response: 0, utility: 0}));
					}
					for (z = 0; z < $scope.data.currentInstrument.questions.length; z++) {
						question = $scope.data.currentInstrument.questions[z];
						$scope.data.alignments[question.id] = Utility.clone(emptyVals);
					}
					if (!Utility.empty($scope.data.resource) && !Utility.empty($scope.data.resource.alignments) && $scope.data.resource.alignments.length > 0) {
						for (var i = 0; i < $scope.data.resource.alignments.length; i++) {
							var alignment = $scope.data.resource.alignments[i];
							var mapping = alignment.mapping;
							$scope.data.alignments[alignment.qi] = Utility.clone(emptyVals);
							for (var m = 0; m < mapping.length; m++) {
								if (typeof mapping[m] == 'object' && typeof mapping[m].utility == 'number') {
									$scope.data.alignments[alignment.qi][(m+1)] = Utility.clone(mapping[m]);
								}
							}
							$scope.data.alignments[alignment.qi][0] = Utility.clone({response: 0, utility: 0}); // for master use
						}
					}
					$scope.refreshSliderBroadcast();
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
			$scope.setAlignments = function () {
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
					$scope.setAlignments();
				}
			};
			$scope.isDirty = function () {
				return $scope.dirty;
			};
			$scope.setDirty = function () {
				$scope.dirty = true;
			};
		})
;