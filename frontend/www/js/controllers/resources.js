/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('ResourceControllers', [])

	.controller(
		'ResourceEditCtrl',
		function ($rootScope, $scope, $timeout, $sce, $templateRequest, $stateParams, Instruments, Utility, Resources) {
			$scope.Resources = Resources;
			$scope.Instruments = Instruments;
			$scope.data = {dirty: false, saving: false, alignments: [], maxLen: 0, isLoading: true, currentInstrumentId: null};

			$scope.setCurrentInstrument = function () {
				if (!Utility.empty($stateParams)) {
					$scope.Instruments.current = Utility.findObjectById($scope.Instruments.list, $stateParams.instrumentId);
				}
			};
			$scope.save = function () {
				$scope.data.saving = true;
				Resources.saveAlignments($scope.Instruments.current.id, $scope.Resources.current, $scope.data.alignments,
										 function (result) {
											 $scope.data.saving = false;
											 $scope.data.dirty = false;
											 Utility.statusAlert(result);
										 }
				);
			};
			$scope.refreshSliderBroadcast = function () {
				$timeout(function () {
					$scope.$broadcast('rzSliderForceRender');
				});
			};
			$scope.initialize = function () {
				if (!Utility.empty($scope.Resources.current) && !Utility.empty($scope.Instruments.current)) {
					$scope.data.alignments = {};
					var question = null;
					var z = 0;
					for (z = 0; z < $scope.Instruments.current.questions.length; z++) {
						question = $scope.Instruments.current.questions[z];
						var type = question.type;
						if (!Utility.empty(type) && question.type.choices.length > $scope.data.maxLen) {
							$scope.data.maxLen = question.type.choices.length;
						}
					}
					for (z = 0; z < $scope.Instruments.current.questions.length; z++) {
						question = $scope.Instruments.current.questions[z];
						var qid = question.id;
						$scope.data.alignments[qid] = [];
						for (var c = 0; c < $scope.data.maxLen; c++) {
							$scope.data.alignments[qid].push({response: c, utility: 0});
						}
					}
					if (!Utility.empty($scope.Resources.current.alignments) && $scope.Resources.current.alignments.length > 0) {
						for (var i = 0; i < $scope.Resources.current.alignments.length; i++) {
							var alignment = $scope.Resources.current.alignments[i];
							var mapping = alignment.mapping;
							$scope.data.alignments[alignment.qi] = [];
							for (var d = 0; d < $scope.data.maxLen; d++) {
								$scope.data.alignments[alignment.qi].push({response: d, utility: 0});
							}
							for (var m = 0; m < mapping.length; m++) {
								if (typeof mapping[m] == 'object' && typeof mapping[m].utility == 'number') {
									$scope.data.alignments[alignment.qi][(m + 1)] = Utility.clone(mapping[m]);
								}
							}
							$scope.data.alignments[alignment.qi][0] = {response: 0, utility: 0}; // for master use
						}
					}
					$scope.data.isLoading = false;
					$scope.refreshSliderBroadcast();
				}
			};
			$scope.setResource = function () {
				if (!Utility.empty($stateParams) && !Utility.empty($scope.Resources.list)) {
					$scope.data.isLoading = true;
					var resourceId = $stateParams.resourceId;
					if (!Utility.empty(resourceId)) {
						$scope.Resources.current = Utility.findObjectById($scope.Resources.list, resourceId);
						if (!Utility.empty($scope.Resources.current)) {
							$scope.Resources.current.location = 'modules/' + $scope.Resources.current.nmb.toLowerCase() + '.html';
							if (!Utility.empty($scope.Instruments.current)) {
								$scope.data.currentInstrumentId = $scope.Instruments.current.id;
								$scope.initialize();
							}
						}
					}
				}
			};
			$scope.setCurrentInstrument = function (instrumentId) {
				if (!Utility.empty(instrumentId) && !Utility.empty($scope.Instruments.list)) {
					$scope.Instruments.current = Utility.findObjectById($scope.Instruments.list, instrumentId);
					if (!Utility.empty($scope.Instruments.current)) {
						$scope.data.currentInstrumentId = $scope.Instruments.current.id;
						$scope.setResource();
					}
				}
			};
			$scope.isDirty = function () {
				return $scope.dirty;
			};
			$scope.setDirty = function () {
				$scope.dirty = true;
			};
			$scope.slideChange = function (sliderId, modelValue) {
				try {
					var idParts = sliderId.split('_');
					$scope.data.dirty = true;
					if (idParts[2] == 0) {
						var qid = idParts[1];
						for (var i = 1; i < $scope.data.maxLen; i++) {
							$scope.data.alignments[qid][i].utility = modelValue;
						}
					}
				}
				catch (exception) {

				}
			};

			// Main
			//
			$scope.Instruments.loadAll(function (instruments) {
				$scope.Resources.loadAll(function (response) {
					$scope.setResource();
				});
			});
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

;