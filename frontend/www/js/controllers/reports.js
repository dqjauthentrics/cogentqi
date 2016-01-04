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
					}
				]
			};
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
		function ($scope, ResourceEfficacy) {
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
											  type: 'column'
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
												  text: 'Alignment Level'
											  },
											  stackLabels: {
												  enabled: false
											  }
										  }
									  },
									  series: [
										  {
											  name: 'Before',
											  data: resource.priorResponseAverages
										  },
										  {
											  name: 'After',
											  data: resource.subsequentResponseAverages
										  }
									  ]
								  }
							  );
						  })
                        $scope.numberOfGraphs = $scope.graphs.length;
                        $scope.showGraphs = function() {
                            return $scope.numberOfGraphs > 0;
                        };
                        if (!$scope.showGraphs()) {
                            return;
                        }
                        $scope.currentGraphIndex = 0;
                        $scope.setGraphs = function() {
                            var nextIndex = ($scope.currentGraphIndex + 1)%$scope.numberOfGraphs;
                            var previousIndex = ($scope.currentGraphIndex +
                                $scope.numberOfGraphs - 1)%$scope.numberOfGraphs;
                            $scope.currentGraph =  $scope.graphs[$scope.currentGraphIndex];
                            $scope.nextGraph =  $scope.graphs[nextIndex];
                            $scope.previousGraph =  $scope.graphs[previousIndex];
                        };
                        $scope.currentGraph =  null;
                        $scope.nextGraph =  null;
                        $scope.previousGraph =  null;
                        $scope.canNavigate = function() {
                            return $scope.graphs.length > 1;
                        };
                        $scope.gotoNextGraph = function() {
                            $scope.currentGraphIndex =
                                ($scope.currentGraphIndex + 1)%$scope.numberOfGraphs;
                            $scope.setGraphs();
                        };
                        $scope.gotoPreviousGraph = function() {
                            $scope.currentGraphIndex =
                                ($scope.currentGraphIndex +
                                    $scope.numberOfGraphs - 1)%$scope.numberOfGraphs;
                            $scope.setGraphs();
                        };
                        $scope.setGraphs();
					  },
					  function (error) {
						  console.log('not implemented ' + error);
					  });
		})
;
