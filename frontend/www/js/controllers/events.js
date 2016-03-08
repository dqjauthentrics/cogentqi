/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('EventControllers', [])

	.controller(
		'EventConfigListCtrl',
		function ($scope, $stateParams, Utility, Events) {
			$scope.data = {isLoading: true, searchFilter: ''};
			Events.get().then(function (events) {
				$scope.Events = events;
				$scope.data.isLoading = false;
			}, function (error) {
				console.log('not implemented ' + error);
			});
		})

	.controller(
		'EventConfigureCtrl',
		function ($scope, $stateParams, $ionicPopup, Utility, Instruments, Events) {
			$scope.Instruments = Instruments;
			$scope.Events = Events;
			$scope.data = {dirty: false, saving: false, loading: true, alignments: [], currentInstrumentId: null};

			$scope.save = function () {
				$scope.data.saving = true;
				Events.saveAlignments($scope.Instruments.current.id, $scope.Events.current, $scope.data.alignments,
									  function (response) {
										  $scope.data.saving = false;
										  $scope.data.dirty = false;
										  Utility.statusAlert(response);
									  });
			};
			$scope.setAlignments = function () {
				if (!Utility.empty($scope.Events.current) && !Utility.empty($scope.Instruments.current)) {
					$scope.data.alignments = {};
					for (var z = 0; z < $scope.Instruments.current.questions.length; z++) {
						var questionId = $scope.Instruments.current.questions[z].id;
						$scope.data.alignments[questionId] = 0;
					}
					if (!Utility.empty($scope.Events.current) && !Utility.empty(
							$scope.Events.current.alignments) && $scope.Events.current.alignments.length > 0) {
						for (var i = 0; i < $scope.Events.current.alignments.length; i++) {
							var alignment = $scope.Events.current.alignments[i];
							$scope.data.alignments[alignment.qi] = alignment.wt;
						}
					}
					$scope.data.loading = false;
				}
			};
			$scope.setEvent = function () {
				if (!Utility.empty($stateParams)) {
					var eventId = $stateParams.eventId;
					if (!Utility.empty(eventId)) {
						$scope.Events.current = Utility.findObjectById($scope.Events.list, eventId);
						if (!Utility.empty($scope.Instruments.current)) {
							$scope.data.currentInstrumentId = $scope.Instruments.current.id;
							$scope.setAlignments();
						}
					}
				}
			};
			$scope.setCurrentInstrument = function (instrumentId) {
				if (!Utility.empty(instrumentId) && !Utility.empty($scope.Instruments.list)) {
					$scope.data.loading = true;
					$scope.Instruments.current = Utility.findObjectById($scope.Instruments.list, instrumentId);
					if (!Utility.empty($scope.Instruments.current)) {
						$scope.data.currentInstrumentId = $scope.Instruments.current.id;
						$scope.setAlignments();
					}
				}
			};

			// Main
			//
			$scope.Instruments.loadAll(function (instruments) {
				$scope.Events.loadAll(function (response) {
					$scope.setEvent();
				});
			});

		})
;