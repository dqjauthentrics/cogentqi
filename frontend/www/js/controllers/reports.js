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
			$scope.data = {
				resourceAnalysisCfg: {
					title: {
						text: 'Resource Competency Coverage Analysis'
					},
					subtitle: {
						text: 'NOTE: This is not real data!'
					},
					xAxis: {
						categories: ['Assessment', 'Prescription Management', 'Communication', 'Collaboration', 'Medical Knowledge']
					},
					yAxis: {
						min: 0,
						title: {
							text: 'Alignment Level'
						},
						stackLabels: {
							enabled: false
						}
					},
					options: {
						chart: {
							type: 'column'
						},
						legend: {
						},
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
						}
					},
					series: [
						{
							name: 'Identifying Allergies',
							data: [5, 3, 4, 7, 2]
						},
						{
							name: 'Patient Communication 101',
							data: [2, 2, 3, 2, 1]
						},
						{
							name: 'Collaboration',
							data: [3, 4, 4, 2, 5]
						},
						{
							name: 'Medical Terminology',
							data: [2, 2, 3, 2, 1]
						},
						{
							name: 'Team Communication',
							data: [2, 2, 3, 2, 1]
						}
					]
				}
			};
		})
;
