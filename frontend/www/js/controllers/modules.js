/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('ModuleControllers', [])
	.controller(
		'ModuleListCtrl',
		function ($http, $rootScope, $scope, $stateParams, $compile, $translate, Utility, Modules) {
			$scope.data = {popup: null, height: document.getElementsByTagName('ion-content')[0].clientHeight};
			$scope.Modules = Modules;
			$scope.alertMessage = '';
			$scope.sorryText = 'Sorry, no more information is available.';
			$scope.goText = 'Go to Resource';

			$translate($scope.goText).then(function (txt) {
				if (!Utility.empty(txt)) {
					$scope.goText = txt;
				}
			});
			$translate($scope.sorryText).then(function (txt) {
				if (!Utility.empty(txt)) {
					$scope.sorryText = txt;
				}
			});

			$scope.$on('$ionicView.leave', function () {
				if (!Utility.empty($scope.data.popup)) {
					$scope.data.popup.close();
				}
			});
			$scope.addRemoveEventSource = function (sources, source) {
				var canAdd = 0;
				angular.forEach(sources, function (value, key) {
					if (sources[key] === source) {
						sources.splice(key, 1);
						canAdd = 1;
					}
				});
				if (canAdd === 0) {
					sources.push(source);
				}
			};
			$scope.addEvent = function () {
				$scope.events.push({title: 'Open Sesame', start: new Date(y, m, 28), end: new Date(y, m, 29), className: ['openSesame']});
			};
			$scope.remove = function (index) {
				$scope.events.splice(index, 1);
			};
			$scope.changeView = function (view, calendar) {
				uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
			};
			$scope.renderCalender = function (calendar) {
				if (uiCalendarConfig.calendars[calendar]) {
					uiCalendarConfig.calendars[calendar].fullCalendar('render');
				}
			};
			$scope.eventClicked = function (calEvent, jsEvent, view) {
				var mod = calEvent.module;
				var body = $scope.sorryText;
				if (!Utility.empty(mod)) {
					if (!Utility.empty(mod.resource)) {
						body =
							'<div style="float:right; margin: 0.3em 1em;"><a href="#/resource/view/' + mod.resource.id + '">' + $scope.goText + '</a></div>' +
							'<div style="float:left;">';
						if (!Utility.empty(mod.badges)) {
							for (var i = 0; i < mod.badges.length; i++) {
								body += '<img style="width:40px; height:auto; margin:0.2em;" src="' + mod.badges[i].image + '" alt=""/>';
							}
						}
						body += '</div><div class="clearfix"></div>';
						body += mod.resource.sm.replace("\n", ' ');
					}
				}
				$scope.data.popup = Utility.popup(calEvent.title, body);
			};

			// Main
			//
			$scope.eventSource = {
				url: "https://calendar.google.com/calendar/render?cid=http://www.google.com/calendar/feeds/9p1ilqt3hbg8941c920rmkkfjg%2540group.calendar.google.com/public/basic&pli=1#main_7",
				className: 'gcal-event'
			};
			var date = new Date();
			var d = date.getDate();
			var m = date.getMonth();
			var y = date.getFullYear();
			$scope.events = [];
			$scope.eventSources = [];
			$scope.uiConfig = {
				calendar: {
					//height: $scope.data.height,
					editable: true,
					header: {left: 'title', center: '', right: 'today prev,next agendaWeek month'},
					eventClick: $scope.eventClicked
				}
			};
			$scope.eventObject = function (mod, color) {
				color = $c.pastel(color);
				var contrast = $c.contrastYIQ(color);
				var title = !Utility.empty(mod.resource) ? mod.resource.n : 'Unknown Resource';
				return {
					id: mod.id,
					title: title,
					allDay: true,
					start: new Date(mod.sr),
					end: new Date(mod.en),
					stick: true,
					color: color,
					textColor: contrast,
					module: mod
				};
			};


			//if ($scope.Modules.list == null) {
				Utility.getResource(Modules.retrieve(), function (response) {
					$scope.Modules.list = response.data;
					if (!Utility.empty($scope.Modules.list)) {
						$scope.events.splice(0, $scope.events.length);
						var colors = $c.getHexSet();
						for (var i = 0, colorIdx = 0; i < $scope.Modules.list.length; i++, colorIdx++) {
							if (colorIdx > colors.length - 1) {
								colorIdx = 0;
							}
							var color = colors[colorIdx];
							$scope.events.push($scope.eventObject($scope.Modules.list[i], color));
						}
					}
				});
			//}
			$scope.eventSources = [$scope.events];
		})
;