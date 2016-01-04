/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('InstrumentControllers', [])

	.controller(
		'InstrumentCtrl',
		function ($scope, $stateParams, Utility, Instruments) {
			$scope.data = {instruments: []};

			Instruments.retrieve().query(function (response) {
				$scope.data.instruments = response.data;
				$scope.setCurrentInstrument();
			});

			$scope.setCurrentInstrument = function () {
				if (!Utility.empty($stateParams)) {
					$scope.data.instrument = Utility.findObjectById($scope.data.instruments, $stateParams.instrumentId);
				}
			};

		})
;