'use strict';

angular.module('app.learningModules', []).service('LearningModules', function ($resource, Utility, Resources) {
	var svc = this;
	svc.learningModules = [];

	svc.retrieve = function () {
		$resource('/api/learningModule', {}, {}).query().$promise.then(function (data) {
			svc.learningModules = data;
			console.log("learningModules: retrieved:", svc.learningModules);
		});
		return svc.learningModules;
	};

	svc.find = function (classId) {
		for (var i = 0; i < svc.learningModules.length; i++) {
			if (svc.learningModules[i].id === parseInt(classId)) {
				return svc.learningModules[i];
			}
		}
		return null;
	};
});
