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
		function ($rootScope, $scope, $stateParams, Utility, ResourceAnalysis) {
            ResourceAnalysis.get()
                .then(
                    function(resourceAnalysis) {
						$scope.data = {
							resourceAnalysisCfg: {
								title: {
									text: 'Resource Competency Coverage Analysis'
								},
								subtitle: {
									text: 'resources available for each competency.'
								},
								options: {
									chart: {
										type: 'column'
									},
									credits: {enabled: false},
									legend: {},
									tooltip: {
										formatter: function () {
											return '<b>' + this.x + '</b><br/>' +
													this.series.name + ': ' + this.y + '<br/>' +
													'Total: ' + this.point.stackTotal;
										}
									},
									plotOptions: {
										column: {
											stacking: 'normal',
											dataLabels: {
												enabled: false
											}
										}
									},
									xAxis: {
										// these are questions
										categories: resourceAnalysis.questionNames
									},
									yAxis: {
										min: 0,
										title: {
											text: 'Alignment Level'
										},
										stackLabels: {
											enabled: false
										}
									}
								},
								// these are resources...
								series: resourceAnalysis.resources
							}
						};
                    },
                    function(error) {
                        alert('not implemented ' + error);
                    });

		})
;
