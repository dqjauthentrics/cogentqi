'use strict';

angular.module('LearningModules', []).service('LearningModules', function ($resource, Utility, Resources) {
	var svc = this;

	svc.retrieve = function () {
		return $resource('/api2/module', {}, {});
	};
});
