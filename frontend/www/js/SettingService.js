'use strict';

angular.module('app.settings', ['ngResource']).service('Settings', function ($resource) {
	var svc = this;
	svc.settings = [];

	svc.retrieve = function() {
		svc.settings = $resource('/api/setting/:id', {id: '@id'}, {update: {method: 'PUT'}}).query();
		return svc.settings;
	};
});