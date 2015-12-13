/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('ModuleControllers', [])
	.controller(
		'ModuleListCtrl',
		function ($http, $rootScope, $scope, $stateParams, $compile, Utility, Modules) {
			$scope.Modules = Modules;
			$scope.alertMessage = '';

			$scope.alertOnEventClick = function (date, jsEvent, view) {
				$scope.alertMessage = (date.title + ' was clicked ');
			};
			$scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
				$scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
			};
			$scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
				$scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
			};
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
			$scope.eventRender = function (event, element, view) {
				element.attr({'tooltip': event.title, 'tooltip-append-to-body': true});
				$compile(element)($scope);
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
			var foo = [
				{title: 'All Day Event', start: new Date(y, m, 1)},
				{title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2)},
				{id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false},
				{id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false},
				{title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false},
				{title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/'}
			];
			$scope.eventSources = [];
			$scope.uiConfig = {
				calendar: {
					height: 450,
					editable: true,
					header: {
						left: 'title',
						center: '',
						right: 'today prev,next agendaWeek month'
					},
					eventClick: $scope.alertOnEventClick,
					eventDrop: $scope.alertOnDrop,
					eventResize: $scope.alertOnResize,
					eventRender: $scope.eventRender
				}
			};

			if ($scope.Modules.list == null) {
				Utility.getResource(Modules.retrieve(), function (response) {
					$scope.Modules.list = response.data;
					if (!Utility.empty($scope.Modules.list)) {
						$scope.events.splice(0, $scope.events.length);
						for (var i = 0; i < $scope.Modules.list.length; i++) {
							var mod = $scope.Modules.list[i];
							$scope.events.push({
												   id: mod.id,
												   title: mod.resource.n,
												   allDay: true,
												   start: new Date(mod.sr),
												   end: new Date(mod.en),
												   stick: true
											   });
						}
					}
				});
			}
			$scope.eventSources = [$scope.events];
		})
;