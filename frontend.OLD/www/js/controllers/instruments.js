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
			$scope.data = {dirty: false, choiceTypes: []};

			$scope.typeInArray = function (type, choiceTypes) {
				for (var i = 0; i < choiceTypes.length; i++) {
					if (choiceTypes[i].id == type.id) {
						return true;
					}
				}
				return false;
			};

			$scope.setCurrentInstrument = function () {
				if (!Utility.empty($scope.Instruments) && !Utility.empty($stateParams)) {
					$scope.Instruments.current = Utility.findObjectById($scope.Instruments.list, $stateParams.instrumentId);
					if (!Utility.empty($scope.Instruments.current)) {
						for (var i = 0; i < $scope.Instruments.current.questionGroups.length; i++) {
							for (var j = 0; j < $scope.Instruments.current.questionGroups[i].questions.length; j++) {
								var type = $scope.Instruments.current.questionGroups[i].questions[j].type;
								if (type !== undefined && !$scope.typeInArray(type, $scope.data.choiceTypes)) {
									$scope.data.choiceTypes.push(type);
								}
							}
						}
						$scope.data.choiceTypes.push({id: -1, n: '-add new response set-', ru: ''});
					}
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