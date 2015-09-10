'use strict';

angular.module('MemberNotes', []).service('MemberNotes', function ($resource) {
	var svc = this;

	svc.retrieve = function (memberId) {
		return $resource('/api/memberNote/member/' + memberId);
	};
});