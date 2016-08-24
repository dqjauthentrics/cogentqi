/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('InstrumentSchedule', []).service('InstrumentSchedule', function ($resource, Utility) {
	var svc = this;

	svc.retrieve = function () {
		return $resource('/api3/instrument/schedule', {}, {query: {method: 'GET', isArray: false, cache: false}});
	};
});