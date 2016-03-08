/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('InstrumentControllers', [])

	.controller(
		'InstrumentCtrl',
		function ($scope, $stateParams, Utility, Instruments, $ionicSlideBoxDelegate) {
			$scope.Instruments = Instruments;
			$scope.data = {dirty: false};

			$scope.setCurrentInstrument = function () {
				if (!Utility.empty($scope.Instruments) && !Utility.empty($stateParams)) {
					$scope.Instruments.current = Utility.findObjectById($scope.Instruments.list, $stateParams.instrumentId);
				}
			};

			$scope.Instruments.loadAll(function (instruments) {
				$scope.data.isLoading = false;
				$scope.setCurrentInstrument();
			});

			$scope.nextSlide = function () {
				$ionicSlideBoxDelegate.next();
			};
			$scope.previousSlide = function () {
				$ionicSlideBoxDelegate.previous();
			};

			$scope.isDirty = function () {
				return $scope.dirty;
			};
			$scope.setDirty = function () {
				$scope.dirty = true;
			};
			$scope.save = function () {
				$scope.data.saving = true;
				Instruments.save($scope.Instruments.current,
								 function (result) {
									 $scope.data.saving = false;
									 $scope.data.dirty = false;
									 Utility.statusAlert(result);
								 }
				);
			};
		})
;