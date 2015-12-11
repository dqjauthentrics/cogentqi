/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('ReportsControllers', [])

	.controller(
		'ReportsIndexCtrl',
		function ($rootScope, $scope, $stateParams, Utility) {
			$scope.data = {
				searchFilter: '',
				location: '',
				title: '',
				items: [
					{
						id: 0,
						title: 'Resource Analysis',
						template: 'resourceAnalysis',
						teaser: 'An intelligent analysis of your resource base.',
						url: '#/reports/resourceAnalysis'
					}
				]
			};
		})

	.controller(
		'ReportsResourceAnalysisCtrl',
		function ($rootScope, $scope, $stateParams, Utility) {
			$scope.data = {};
		})
;
