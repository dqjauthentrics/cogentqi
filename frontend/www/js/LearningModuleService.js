'use strict';

angular.module('app.learningModules', []).service('LearningModules', function ($resource, Utility, Resources) {
	var svc = this;

	svc.retrieve = function () {
		return $resource('/api/learningModule', {}, {});
	};
});
