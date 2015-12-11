/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Events', []).service('Events', function ($cookieStore, $q, $http, Utility) {
	var svc = this;
	svc.tempId = -1;
	svc.list = null;
	// To be attached to events
	svc.getAlignmentQuestions = function () {
		var questions = {};
		this.alignments.forEach(function (alignment) {
			questions[alignment.qi] = true;
		});
		return questions;
	};
	svc.execute = function (callback, failure) {
		if (svc.list == null) {
			return $http.get('/api3/event').
			then(function (response) {
					 svc.list = response.data;
					 svc.list.forEach(function (event) {
						 event.getAlignmentQuestions = svc.getAlignmentQuestions;
					 });
					 callback(svc);
				 },
				 function (error) {
					 failure(error);
				 });
		}
		else {
			callback(svc);
			return $q.when();
		}
	};
	svc.createEvent = function () {
		var tempId = -1;
		svc.list.push({
			id: svc.tempId--,
			n: "New Event",
			dsc: "",
			cat: ""
		});
		return tempId;
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
	svc.saveEvent = function (event, questions, callbackFn) {
		$http.post("/api3/event/update", {event: event})
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
	svc.saveAlignments = function (event) {
		try {
			$http.post("/api3/event/saveAlignments", {eventId: eventId, alignments: alignments})
				.then(function (data, status, headers, config) {
						  callbackFn(data);
					  },
					  function (data, status, headers, config) {
						  callbackFn(data);
					  });
		}
		catch (exception) {
			callbackFn(0, exception);
		}
	};
	svc.filterer = function (event, filterText) {
		if (event) {
			try {
				if (!Utility.empty(filterText) && !Utility.empty(event)) {
					filterText = filterText.toLowerCase();
					return filterText == null ||
						event.name.toLowerCase().indexOf(filterText) >= 0 ||
						event.description.toLowerCase().indexOf(filterText) >= 0
						;
				}
			}
			catch (exception) {
				console.log("event filter exception: ", exception);
			}
		}
		return true;
	};
});
