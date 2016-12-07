/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Settings', []).service('Settings', function ($resource) {
	var svc = this;

	svc.retrieve = function () {
		return $resource('/api3/setting', {}, {query: {method: 'GET', isArray: false, cache: false}});
	};
});