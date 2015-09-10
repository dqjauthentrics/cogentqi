'use strict';

angular.module('Plans', []).service('Plans', function ($resource, Utility) {
	var svc = this;

	svc.retrieve = function (memberId) {
		return $resource('/api/planItem/member/' + memberId, {}, {});
	};
});
