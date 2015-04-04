'use strict';

angular.module('app.settings', ['ngResource']).service('Settings', function ($resource) {
	var svc = this;

	svc.retrieve = function () {
		return $resource('/api/setting', {});
	};
});