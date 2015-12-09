/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('MemberNotes', []).service('MemberNotes', function ($http, $resource) {
	var svc = this;

	svc.retrieve = function (memberId) {
		return $resource('/api3/memberNotes/' + memberId, {}, {query: {method: 'GET', isArray: false, cache: false}});
	};

	svc.save = function (note, callbackFn) {
		$http.post("/api3/memberNote/update", {note: note})
			.then(function (data, status, headers, config) {
					  callbackFn(data);
				  },
				  function (data, status, headers, config) {
					  callbackFn(data);
				  });
	};

	svc.remove = function (id, callbackFn) {
		$http.post("/api3/memberNote/delete/" + id)
			.then(function (data, status, headers, config) {
					  callbackFn(data);
				  },
				  function (data, status, headers, config) {
					  callbackFn(data);
				  });
	};
});