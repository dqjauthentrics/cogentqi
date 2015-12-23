/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Events', []).service('Events', function ($cookieStore, $q, $http, Utility) {
	var svc = this;
	svc.tempId = -1;
	svc.list = null;

	svc.get = function () {
		if (svc.list == null) {
			return $http.get('/api3/event').
			    then(function (result) {
                    if (result.data.status !== 1) {
                        return $q.reject(result.data);
                    }
                    var response = result.data;
                    svc.list = response.data;
                    return svc;
				 },
				 function (error) {
					 return $q.reject(error);
				 });
		}
		else {
			return $q.when(svc);
		}
	};
	// To create a new event call with event == null
	svc.saveEvent = function (event, failure) {
		var isNew = event === null;
		event = !isNew ? event : {
			n: "New Event",
			dsc: "no description",
			cat: "Generic"
		};
		return $http.post('/api3/event/update', event).
		then(function (result) {
                    if (result.data.status != 1) {
                        failure(result.data);
                    }
					if (isNew) {
						event.id = result.data.data.id;
						svc.list.push(event);
					}
				},
				function (error) {
					failure(error);
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