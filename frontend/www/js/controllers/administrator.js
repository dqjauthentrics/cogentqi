'use strict';

angular.module('ControllerAdministrator', [])

	.controller('AdminTabsCtrl', function ($scope, Utility) {
					//$ionicNavBarDelegate.showBackButton(false);

					$scope.$on('$ionicView.beforeEnter', function () {
						//$ionicNavBarDelegate.showBackButton(false);
					});

					$scope.$on('$ionicView.leave', function () {
						//$ionicNavBarDelegate.showBackButton(true);
					});
				})

	.controller('AdminDashboardCtrl', function ($scope, $cookieStore, Utility) {
					$scope.data = {user: $cookieStore.get('user'), role: 'administrator'};
				})

	.controller('AdminScheduleCtrl', function ($timeout, $scope, $stateParams, Utility, InstrumentSchedule) {
					$scope.data = {dirty: false, scheduleItems: [], currentScheduleItem: {}, dob: new Date(1984, 4, 15)};

					$scope.picker = {opened: false};
					$scope.togglePicker = function () {
						$timeout(function () {
							$scope.picker.opened = !$scope.picker.opened;
						}, 10)
					};

					Utility.getResource(InstrumentSchedule.retrieve(), function (response) {
						$scope.data.scheduleItems = response;
						if (!Utility.empty($scope.data.scheduleItems)) {
							for (var i = 0; i < $scope.data.scheduleItems.length; i++) {
								$scope.data.scheduleItems[i].sr = new Date($scope.data.scheduleItems[i].sr);
							}
						}
						$scope.setCurrentItem(response[0]);
					});
					$scope.setCurrentItem = function (scheduleItem) {
						$scope.data.currentScheduleItem = scheduleItem;
					};
					$scope.getCurrentItem = function () {
						return $scope.data.currentScheduleItem;
					};

					$scope.lockToggle = function (scheduleItem) {
						var prompt = 'Are you sure you want to ' + (scheduleItem.lk ? 'UNLOCK this Assessment?' : 'LOCK this assessment');
						Utility.confirm('Schedule Change', prompt, function () {
							if (scheduleItem.lk) {
								scheduleItem.lk = null;
							}
							else {
								var currentdate = new Date();
								var dateTime = currentdate.getDate() + "/"
									+ (currentdate.getMonth() + 1) + "/"
									+ currentdate.getFullYear() + " @ "
									+ currentdate.getHours() + ":"
									+ currentdate.getMinutes() + ":"
									+ currentdate.getSeconds();
								scheduleItem.lk = dateTime;
							}
							$scope.dirty = true;
						});
					};
					$scope.permToggle = function (item, role, p) {
						var prompt = 'Are you sure you want to change this access parameter?';
						Utility.confirm('Schedule Access Change', prompt, function () {
							if (item.ops[role].indexOf(p) >= 0) {
								item.ops[role] = item.ops[role].replace(p, '');
							}
							else {
								item.ops[role] += p;
							}
							$scope.dirty = true;
						});
					};
					$scope.setDirty = function () {
						$scope.data.dirty = true;
					};
					$scope.setDetail = function (item) {
						item.showDetail = !item.showDetail;
						console.log(item.showDetail);
					};
					$scope.showDetail = function (item) {
						return !!item.showDetail;
					};
					$scope.save = function () {
						Utility.popup('TBD', 'Sorry. Configuration cannot be changed in this demonstration.');
					};
				})

	.controller('AdminProgressCtrl', function ($scope, $stateParams, Utility, Instruments, Organizations, Assessments) {
					$scope.data = {
						chart: null,
						currentSeries: 0,
						instruments: [], organizations: [], currentInstrumentId: 1, currentInstrument: null,
						rptConfig: {
							chart: {type: 'line'},
							title: {text: 'Competency Progress Analysis', x: -20},
							subtitle: {text: 'Pharmacy Technician Evaluation', x: -20},
							tooltip: {
								formatter: function () {
									return 'HERE';
								}
							},
							xAxis: {categories: []},
							yAxis: [
								{min: 0, title: {text: 'Average Rank'}, plotLines: [{value: 0, width: 1, color: '#808080'}]},
								{min: 0, title: {text: 'Learning Modules Completed'}, opposite: true}
							],
							legend: {layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0},
							plotOptions: {line: {dataLabels: {enabled: true}}},
							exporting: {enabled: true},
							series: [],
							func: function (chart) {
								$scope.data.chart = chart;
							}
						},
						rptConfig0: {
							chart: {type: 'line'},
							title: {text: 'Competency Progress Analysis', x: -20},
							subtitle: {text: 'Pharmacy Technician Evaluation', x: -20},
							tooltip: {
								formatter: function () {
									return 'HERE';
								}
							},
							xAxis: {categories: []},
							yAxis: [
								{min: 0, title: {text: 'Average Rank'}, plotLines: [{value: 0, width: 1, color: '#808080'}]},
								{min: 0, title: {text: 'Learning Modules Completed'}, opposite: true}
							],
							legend: {layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0},
							plotOptions: {line: {dataLabels: {enabled: true}}},
							exporting: {enabled: true},
							series: [],
							func: function (chart) {
								$scope.data.chart = chart;
							}
						},
						rptConfig1: {
							chart: {type: 'line'},
							title: {text: 'Competency Progress Analysis', x: -20},
							subtitle: {text: 'Pharmacy Technician Evaluation', x: -20},
							tooltip: {
								formatter: function () {
									return 'HERE';
								}
							},
							xAxis: {categories: []},
							yAxis: [
								{min: 0, title: {text: 'Average Rank'}, plotLines: [{value: 0, width: 1, color: '#808080'}]},
								{min: 0, title: {text: 'Learning Modules Completed'}, opposite: true}
							],
							legend: {layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0},
							plotOptions: {line: {dataLabels: {enabled: true}}},
							exporting: {enabled: true},
							series: [],
							func: function (chart) {
								$scope.data.chart = chart;
							}
						}
					};

					Utility.getResource(Instruments.retrieve(), function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						if (!Utility.empty(response)) {
							$scope.setCurrentInstrument(response[0].id);
						}
					});
					Utility.getResource(Organizations.retrieve(), function (response) {
						$scope.data.organizations = response;
					});

					if (!Utility.empty($stateParams) && !Utility.empty($stateParams.instrumentId)) {
						$scope.setCurrentInstrument($stateParams.instrumentId);
					}

					$scope.setCurrentInstrument = function (instrumentId) {
						if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
							$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
							$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
							Utility.getResource(Assessments.retrieveProgressByMonth($scope.data.currentInstrument.id, true), function (response) {
								for (var i = 0; i < response.series.length; i++) {
									if (response.series[i].grouping == 0 || response.series[i].grouping == 2) {
										$scope.data.rptConfig0.series.push(response.series[i]);
										$scope.data.rptConfig.series.push(response.series[i]);
									}
									if (response.series[i].grouping == 1 || response.series[i].grouping == 2) {
										response.series[i].visible = true;
										$scope.data.rptConfig1.series.push(response.series[i]);
									}
								}
								$scope.data.rptConfig.xAxis.categories = response.labels;
								$scope.data.rptConfig0.xAxis.categories = response.labels;
								$scope.data.rptConfig1.xAxis.categories = response.labels;
							});
						}
					};
					$scope.toggleProgress = function () {
						if ($scope.data.currentSeries == 0) {
							$scope.data.rptConfig = $scope.data.rptConfig1;
							$scope.data.currentSeries = 1;
						}
						else {
							$scope.data.rptConfig = $scope.data.rptConfig0;
							$scope.data.currentSeries = 0;
						}
						/**
						 while( $scope.data.chart.series.length > 0 ) {
							$scope.data.chart.series[0].remove( false );
						}
						 for (var i=0; i<series.length; i++) {
							$scope.data.chart.addSeries(series);
						}
						 **/
						//$scope.data.chart.redraw();
					};

				})

	.controller('AdminAlignmentCtrl', function ($scope, $stateParams, $ionicPopup, Utility, Instruments, Resources, Outcomes) {
					$scope.res = null;
					$scope.data = {
						dirty: false,
						alignments: [],
						instruments: [],
						outcomes: [],
						outcoume: {},
						resources: [],
						resource: {},
						currentInstrument: null,
						currentInstrumentId: 1
					};

					Utility.getResource(Instruments.retrieve(), function (response) {
						$scope.data.instruments = response;
						Instruments.collate($scope.data.instruments);
						if (!Utility.empty(response)) {
							$scope.setCurrentInstrument(response[0].id);
						}
					});
					Utility.getResource(Resources.retrieve(), function (response) {
						$scope.data.resources = response;
						$scope.setResource();
					});
					Utility.getResource(Outcomes.retrieve(), function (response) {
						$scope.data.outcomes = response;
						$scope.setOutcome();
					});

					$scope.saveResourceAlignments = function () {
						Resources.saveAlignments($scope.data.currentInstrumentId, $scope.data.resource.id, $scope.data.alignments, Utility.statusAlert);
					};
					$scope.saveOutcomeAlignments = function () {
						Outcomes.saveAlignments($scope.data.currentInstrumentId, $scope.data.outcome.id, $scope.data.alignments, Utility.statusAlert);
					};
					$scope.setResourceAlignments = function () {
						if (!Utility.empty($scope.data.resource) && !Utility.empty($scope.data.currentInstrument)) {
							$scope.data.alignments = {};
							for (var z = 0; z < $scope.data.currentInstrument.questions.length; z++) {
								var questionId = $scope.data.currentInstrument.questions[z].id;
								$scope.data.alignments[questionId] = 0;
							}
							if (!Utility.empty($scope.data.resource) && !Utility.empty($scope.data.resource.alignments) && $scope.data.resource.alignments.length > 0) {
								for (var i = 0; i < $scope.data.resource.alignments.length; i++) {
									var alignment = $scope.data.resource.alignments[i];
									$scope.data.alignments[alignment.questionId] = alignment.weight;
								}
							}
						}
					};
					$scope.setOutcomeAlignments = function () {
						if (!Utility.empty($scope.data.outcome) && !Utility.empty($scope.data.currentInstrument)) {
							$scope.data.alignments = {};
							for (var z = 0; z < $scope.data.currentInstrument.questions.length; z++) {
								var questionId = $scope.data.currentInstrument.questions[z].id;
								$scope.data.alignments[questionId] = 0;
							}
							if (!Utility.empty($scope.data.outcome) && !Utility.empty($scope.data.outcome.alignments) && $scope.data.outcome.alignments.length > 0) {
								for (var i = 0; i < $scope.data.outcome.alignments.length; i++) {
									var alignment = $scope.data.outcome.alignments[i];
									$scope.data.alignments[alignment.questionId] = alignment.weight;
								}
							}
						}
					};
					$scope.setResource = function () {
						if (!Utility.empty($stateParams)) {
							var resourceId = $stateParams.resourceId;
							if (!Utility.empty(resourceId)) {
								$scope.data.resource = Utility.findObjectById($scope.data.resources, resourceId);
								$scope.data.resource.location = 'modules/' + $scope.data.resource.number.toLowerCase() + '.html';
								$scope.setResourceAlignments();
							}
						}
						$scope.setResourceAlignments();
					};
					$scope.setOutcome = function () {
						if (!Utility.empty($stateParams)) {
							var outcomeId = $stateParams.outcomeId;
							if (!Utility.empty(outcomeId)) {
								$scope.data.outcome = Utility.findObjectById($scope.data.outcomes, outcomeId);
								$scope.setOutcomeAlignments();
							}
						}
						$scope.setOutcomeAlignments();
					};
					$scope.setCurrentInstrument = function (instrumentId) {
						if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
							$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
							$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
							$scope.setResourceAlignments();
							$scope.setOutcomeAlignments();
						}
					};
					$scope.alignmentLevelPhrase = function (level) {
						var phrase = 'Not Aligned';
						switch (parseInt(level)) {
							case 1:
								phrase = 'Partially Aligned';
								break;
							case 2:
								phrase = 'Aligned';
								break;
							case 3:
								phrase = 'Highly Aligned';
								break;
						}
						return phrase;
					};
					$scope.isDirty = function () {
						return $scope.dirty;
					};
					$scope.setDirty = function () {
						$scope.dirty = true;
					};
				})

	.controller('AdminAlignmentsCtrl', function ($scope, $stateParams, Instruments, Resources, Outcomes) {
					$scope.data = {instruments: [], resources: [], outcomes: []};

					Instruments.retrieve().query(function (response) {
						$scope.data.instruments = response;
					});
					Resources.retrieve().query(function (response) {
						$scope.data.resources = response;
					});
					Outcomes.retrieve().query(function (response) {
						$scope.data.outcomes = response;
					});
				})

;
