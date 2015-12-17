/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('MemberNotes', []).service('MemberNotes', function ($http, $resource) {
	var svc = this;

	svc.retrieve = function (memberId) {
		return $resource('/api3/member-note/forMember/' + memberId, {}, {query: {method: 'GET', isArray: false, cache: false}});
	};

	svc.save = function (note, callbackFn) {
		$http.post("/api3/member-note/update", {note: note})
			.then(function (data, status, headers, config) {
					  callbackFn(data.data);
				  },
				  function (data, status, headers, config) {
					  callbackFn(data.data);
				  });
	};

	svc.remove = function (id, callbackFn) {
		$http.post("/api3/member-note/delete", {memberNoteId: id})
			.then(function (data, status, headers, config) {
					  callbackFn(data.data);
				  },
				  function (data, status, headers, config) {
					  callbackFn(data.data);
				  });
	};
});