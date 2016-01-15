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
					},
					{
						id: 1,
						title: 'Resource Efficacy',
						template: 'resourceEfficacy',
						teaser: 'Determine if a resource is failing to provide value.',
						url: '#/reports/resourceEfficacy'
					},
					{
						id: 1,
						title: 'Outcomes Trend',
						template: 'outcomeTrends',
						teaser: 'Trends in Outcome data over the past year.',
						url: '#/reports/outcomeTrends'
					}
				]
			};
		})

	.controller(
		'ReportsOutcomeTrendsCtrl',
		function ($rootScope, $scope, $stateParams, Utility, Outcomes) {
			$scope.data = {config: null};
			Utility.getResource(
				Outcomes.retrieveTrends(3),
				function (result) {
					var data = result.data;
					var config = {
						title: {
							text: 'Outcome Trends'
						},
						options: {
							chart: {
								type: 'line'
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
								categories: data.labels
							},
							yAxis: {
								min: 0,
								title: {
									text: 'Level'
								},
								stackLabels: {
									enabled: false
								}
							}
						},
						series: data.series
					};
					var pastels = Colors.pastels();
					for (var i = 0; i < config.series.length - 1; i++) {
						config.series[i]['color'] = pastels[i];
					}
					$scope.data.config = config;
				});

		})
	.controller(
		'ReportsResourceAnalysisCtrl',
		function ($rootScope, $scope, $stateParams, Utility, ResourceAnalysis) {
			$scope.data = {config: null};
			ResourceAnalysis.get()
				.then(
					function (resourceAnalysis) {
						$scope.data.config = {
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
										text: 'Average Score'
									},
									stackLabels: {
										enabled: false
									}
								}
							},
							// these are resources...
							series: resourceAnalysis.resources
						};
					},
					function (error) {
						console.log('not implemented ' + error);
					});

		})
	.controller(
		'ReportsResourceEfficacyCtrl',
		function ($scope, $timeout, ResourceEfficacy) {
			$scope.data = {isLoading: true};
			ResourceEfficacy.get()
				.then(function (resourceEfficacy) {
						  $scope.graphs = [];
						  resourceEfficacy.items.forEach(function (resource) {
							  $scope.graphs.push(
								  {
									  title: {
										  text: resource.name
									  },
									  subtitle: {
										  text: resource.summary
									  },
									  options: {
										  chart: {
											  type: 'column',
											  events: {
												  load: function (event) {
													  $scope.data.isLoading = false;
													  //$scope.$apply();
												  }
											  }
										  },
										  credits: {enabled: false},
										  legend: {},
										  tooltip: {
											  formatter: function () {
												  return '<b>' + this.x + '</b><br/>' +
													  this.series.name + ': ' + this.y + '<br/>';
											  }
										  },
										  plotOptions: {
											  column: {
												  dataLabels: {
													  enabled: false
												  }
											  }
										  },
										  xAxis: {
											  // these are questions
											  categories: resource.questionLabels
										  },
										  yAxis: {
											  min: 0,
											  title: {
												  text: 'Average Score'
											  },
											  stackLabels: {
												  enabled: false
											  }
										  }
									  },
									  series: [
										  {
											  name: 'Related Competencies Avg Before',
											  data: resource.priorResponseAverages
										  },
										  {
											  name: 'Related Competencies Avg After',
											  data: resource.subsequentResponseAverages
										  }
									  ]
								  }
							  );
						  });
						  $scope.numberOfGraphs = $scope.graphs.length;
						  $scope.showGraphs = function () {
							  return $scope.numberOfGraphs > 0;
						  };
						  if (!$scope.showGraphs()) {
							  $scope.data.isLoading = false;
							  return;
						  }
						  $scope.currentGraphIndex = 0;
						  $scope.setGraphs = function () {
							  //$scope.data.isLoading = true;
							  $timeout(function () {
								  var nextIndex = ($scope.currentGraphIndex + 1) % $scope.numberOfGraphs;
								  var previousIndex = ($scope.currentGraphIndex +
									  $scope.numberOfGraphs - 1) % $scope.numberOfGraphs;
								  $scope.currentGraph = $scope.graphs[$scope.currentGraphIndex];
								  $scope.nextGraph = $scope.graphs[nextIndex];
								  $scope.previousGraph = $scope.graphs[previousIndex];
							  });
						  };
						  $scope.currentGraph = null;
						  $scope.nextGraph = null;
						  $scope.previousGraph = null;
						  $scope.canNavigate = function () {
							  return $scope.graphs.length > 1;
						  };
						  $scope.gotoNextGraph = function () {
							  $scope.currentGraphIndex =
								  ($scope.currentGraphIndex + 1) % $scope.numberOfGraphs;
							  $scope.setGraphs();
						  };
						  $scope.gotoPreviousGraph = function () {
							  $scope.currentGraphIndex =
								  ($scope.currentGraphIndex +
								  $scope.numberOfGraphs - 1) % $scope.numberOfGraphs;
							  $scope.setGraphs();
						  };
						  $scope.setGraphs();
					  },
					  function (error) {
						  console.log('not implemented ' + error);
					  });
		})
;
