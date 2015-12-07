/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('ModuleControllers', [])
	.controller(
		'ModuleListCtrl',
		function ($http, $rootScope, $scope, $stateParams, Utility, Modules) {
			$scope.Modules = Modules;
			$scope.data = {isLoading: true, searchFilter: ''};

			if ($scope.Modules.list == null) {
				Utility.getResource(Modules.retrieve(), function (response) {
					$scope.Modules.list = response.data;
					$scope.data.isLoading = false;
				});
			}
			else {
				$scope.data.isLoading = false;
			}

			$scope.moduleFilter = function (module) {
				return Modules.filterer(module, $scope.data.searchFilter);
			}
		})
;