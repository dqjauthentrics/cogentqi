/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Plans', []).service('Plans', function ($resource, Utility) {
	var svc = this;

	svc.retrieve = function (memberId) {
		return $resource('/api3/planItem/byMember/' + memberId, {}, {query: {method: 'GET', isArray: false, cache: false}});
	};
});
