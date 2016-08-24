/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Events', []).service('Events', function ($cookieStore, $q, $http, Utility) {
	var svc = this;
	svc.list = null;
	svc.current = null;

	svc.get = function () {
		if (svc.list == null) {
			return $http.get('/api3/event')
				.then(
					function (result) {
						if (result.data.status !== 1) {
							return $q.reject(result.data);
						}
						svc.list = result.data.data;
						return svc;
					},
					function (error) {
						return $q.reject(error);
					}
				);
		}
		else {
			return $q.when(svc);
		}
	};
	svc.loadAll = function (callbackFn) {
		if (svc.list == null) {
			return $http.get('/api3/event')
				.then(
					function (result) {
						if (result.data.status !== 1) {
							return $q.reject(result.data);
						}
						svc.list = result.data.data;
						if (!Utility.empty(svc.list)) {
							svc.current = svc.list[0];
						}
						callbackFn(svc.list);
						return svc;
					},
					function (error) {
						return $q.reject(error);
					}
				);
		}
		else {
			callbackFn(svc.list);
		}
	};
	svc.alignmentLevelPhrase = function (level) {
		var phrase = 'Irrelevant';
		switch (parseInt(level)) {
			case 1:
				phrase = 'Minimally Relevant';
				break;
			case 2:
				phrase = 'Partially Relevant';
				break;
			case 3:
				phrase = 'Generally Relevant';
				break;
			case 4:
				phrase = 'Mostly Relevant';
				break;
			case 5:
				phrase = 'Fully Relevant';
				break;
		}
		return phrase;
	};
	svc.saveAlignments = function (instrumentId, event, alignments, callbackFn) {
		try {
			$http.post("/api3/event/saveAlignments", {instrumentId: instrumentId, event: event, alignments: alignments})
				.then(function (data, status, headers, config) {
						  callbackFn(data.data);
					  },
					  function (data, status, headers, config) {
						  var response = {status: 0, message: data};
						  callbackFn(response);
					  });
		}
		catch (exception) {
			callbackFn(0, exception);
		}
	};
	svc.thresholdPhrase = function (level) {
		var phrase = 'Do Not Apply';
		var levelNum = parseInt(level);
		if (levelNum > 0) {
			phrase = 'Apply after ' + level + ' event' + (levelNum == 1 ? '' : 's') + '.';
		}
		return phrase;
	};

	// To create a new event call with event == null
	svc.saveEvent = function (event) {
		var isNew = event === null;
		event = !isNew ? event : {
			n: "New Event",
			dsc: "no description",
			cat: "Generic"
		};
		return $http.post('/api3/event/update', event)
			.then(
				function (result) {
					if (result.data.status != 1) {
						return $q.reject(result.data);
					}
					if (isNew) {
						event.id = result.data.data.id;
						svc.list.push(event);
					}
				},
				function (error) {
					return $q.reject(error);
				}
			);
	};
	svc.deleteEvent = function (event) {
		$http.post("/api3/event/delete", {eventId: event.id})
			.then(function (data, status, headers, config) {
					  callbackFn(data);
				  },
				  function (data, status, headers, config) {
					  callbackFn(data);
				  });
	};
	svc.find = function (eventId) {
		for (var i = 0; i < svc.list.length; i++) {
			if (svc.list[i].id == eventId) {
				return svc.list[i];
			}
		}
		return null;
	};
});