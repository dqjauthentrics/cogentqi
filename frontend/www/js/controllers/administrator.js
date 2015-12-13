/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('ControllerAdministrator', [])

	.controller(
		'AdminDashboardCtrl',
		function ($scope, $cookieStore, APP_ROLES, Utility) {
			$scope.data = {user: $cookieStore.get('user'), ari: APP_ROLES.ADMINISTRATOR};
		})

	.controller(
		'AdminScheduleCtrl',
		function ($timeout, $scope, $stateParams, Utility, InstrumentSchedule) {
			$scope.data = {dirty: false, scheduleItems: [], currentScheduleItem: {}, dob: new Date(1984, 4, 15)};
			$scope.picker = {opened: false};


			Utility.getResource(InstrumentSchedule.retrieve(), function (response) {
				$scope.data.scheduleItems = response.data;
				console.log("scheduleItems", $scope.data.scheduleItems);
				if (!Utility.empty($scope.data.scheduleItems)) {
					for (var i = 0; i < $scope.data.scheduleItems.length; i++) {
						$scope.data.scheduleItems[i].sr = new Date($scope.data.scheduleItems[i].sr);
					}
				}
				$scope.setCurrentItem(response[0]);
			});


			$scope.togglePicker = function () {
				$timeout(function () {
					$scope.picker.opened = !$scope.picker.opened;
				}, 10)
			};
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
					$scope.data.dirty = true;
				});
			};
			$scope.permToggle = function (item, role, p) {
				var prompt = 'Are you sure you want to change this access parameter?';
				Utility.confirm('Schedule Access Change', prompt, function () {
					if (item.ops[role].ops.indexOf(p) >= 0) {
						item.ops[role].ops = item.ops[role].ops.replace(p, '');
					}
					else {
						item.ops[role].ops += p;
					}
					$scope.data.dirty = true;
				});
			};
			$scope.setDirty = function () {
				$scope.data.dirty = true;
			};
			$scope.setDetail = function (item) {
				item.showDetail = !item.showDetail;
			};
			$scope.showDetail = function (item) {
				return !!item.showDetail;
			};
			$scope.save = function () {
				Utility.popup('TBD', 'Sorry. Configuration cannot be changed in this demonstration.');
			};
		})

	.controller(
		'AdminProgressCtrl',
		function ($scope, $stateParams, Utility, Instruments, Organizations, Assessments) {
			$scope.data = {
				chart: null,
				currentSeries: 0,
				instruments: [], organizations: [], currentInstrumentId: 1, currentInstrument: null,
				rptConfig: {
					title: {text: 'Competency Progress Analysis', x: -20},
					subtitle: {text: 'Pharmacy Technician Evaluation', x: -20},
					options: {
						chart: {type: 'line'},
						credits: {enabled: false},
						xAxis: {categories: []},
						yAxis: [
							{min: 0, title: {text: 'Average Rank'}, plotLines: [{value: 0, width: 1, color: '#808080'}]},
							{min: 0, title: {text: 'Learning Modules Completed'}, opposite: true}
						],
						legend: {layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0},
						plotOptions: {line: {dataLabels: {enabled: true}}},
						exporting: {enabled: true}
					},
					series: [],
					func: function (chart) {
						$scope.data.chart = chart;
					}
				},
				rptConfig0: {
					title: {text: 'Competency Progress Analysis', x: -20},
					subtitle: {text: 'Pharmacy Technician Evaluation', x: -20},
					options: {
						chart: {type: 'line'},
						credits: {enabled: false},
						xAxis: {categories: []},
						yAxis: [
							{min: 0, title: {text: 'Average Rank'}, plotLines: [{value: 0, width: 1, color: '#808080'}]},
							{min: 0, title: {text: 'Learning Modules Completed'}, opposite: true}
						],
						legend: {layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0},
						plotOptions: {line: {dataLabels: {enabled: true}}},
						exporting: {enabled: true}
					},
					series: [],
					func: function (chart) {
						$scope.data.chart = chart;
					}
				},
				rptConfig1: {
					title: {text: 'Competency Progress Analysis', x: -20},
					subtitle: {text: 'Pharmacy Technician Evaluation', x: -20},
					options: {
						chart: {type: 'line'},
						credits: {enabled: false},
						xAxis: {categories: []},
						yAxis: [
							{min: 0, title: {text: 'Average Rank'}, plotLines: [{value: 0, width: 1, color: '#808080'}]},
							{min: 0, title: {text: 'Learning Modules Completed'}, opposite: true}
						],
						legend: {layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0},
						plotOptions: {line: {dataLabels: {enabled: true}}},
						exporting: {enabled: true}
					},
					series: [],
					func: function (chart) {
						$scope.data.chart = chart;
					}
				}
			};

			Utility.getResource(Instruments.retrieve(), function (response) {
				$scope.data.instruments = response.data;
				if (!Utility.empty($scope.data.instruments)) {
					Instruments.collate($scope.data.instruments);
					$scope.setCurrentInstrument($scope.data.instruments[0].id);
				}
			});
			Utility.getResource(Organizations.retrieve(), function (response) {
				$scope.data.organizations = response.data;
			});

			if (!Utility.empty($stateParams) && !Utility.empty($stateParams.instrumentId)) {
				$scope.setCurrentInstrument($stateParams.instrumentId);
			}

			$scope.setCurrentInstrument = function (instrumentId) {
				if (!Utility.empty(instrumentId) && !Utility.empty($scope.data.instruments)) {
					$scope.data.currentInstrument = Utility.findObjectById($scope.data.instruments, instrumentId);
					$scope.data.currentInstrumentId = $scope.data.currentInstrument.id;
					Utility.getResource(Assessments.retrieveProgressByMonth($scope.data.currentInstrument.id, true), function (response) {
						var data = response.data;
						console.log("PLOT DATA:", data);
						if (!Utility.empty(data)) {
							for (var i = 0; i < data.series.length; i++) {
								if (data.series[i].grouping == 0 || data.series[i].grouping == 2) {
									$scope.data.rptConfig0.series.push(data.series[i]);
									$scope.data.rptConfig.series.push(data.series[i]);
								}
								if (data.series[i].grouping == 1 || data.series[i].grouping == 2) {
									data.series[i].visible = true;
									$scope.data.rptConfig1.series.push(data.series[i]);
								}
							}
							$scope.data.rptConfig.options.xAxis.categories = data.labels;
							$scope.data.rptConfig0.options.xAxis.categories = data.labels;
							$scope.data.rptConfig1.options.xAxis.categories = data.labels;
						}
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

;
