/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Plans', []).service('Plans', function ($resource, Utility) {
	var svc = this;

	svc.retrieve = function (memberId) {
		return $resource('/api2/member/' + memberId + '/r/planitems', {}, {});
	};
});
