/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('MemberNotes', []).service('MemberNotes', function ($http, $resource) {
	var svc = this;

	svc.retrieve = function (memberId) {
		return $resource('/api2/member/' + memberId + '/r/notes');
	};

	svc.save = function (note, callbackFn) {
		$http({
			method: 'PUT',
			url: "/api2/member-note",
			data: $.param({note: note}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function (data, status, headers, config) {
			callbackFn(status, data);
		}).error(function (data, status, headers, config) {
			callbackFn(0, data);
		});
	};

	svc.remove = function (id, callbackFn) {
		$http({
			method: 'DELETE',
			url: "/api2/member-note",
			data: $.param({id: id}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function (data, status, headers, config) {
			callbackFn(status, data);
		}).error(function (data, status, headers, config) {
			callbackFn(0, data);
		});
	};
});