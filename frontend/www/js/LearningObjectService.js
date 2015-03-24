'use strict';

angular.module('app.learningobjects', ['app.utility', 'app.resources']).service('LearningObjects', function (Utility, Resources) {
	var svc = this;
	svc.r = Resources;
	svc.learningObjects = [];

	svc.initialize = function () {
		if (Utility.empty(svc.learningObjects) && !Utility.empty(svc.r.resources) && svc.r.resources[0] != 'zz') {
			svc.learningObjects = [];
			for (var i = 0; i < svc.r.resources.length; i++) {
				svc.learningObjects.push({id: i, starts: '2015-01-01', ends: '2015-12-31', type: 'C', resource: svc.r.resources[i]});
			}
		}
	};
	svc.getAll = function () {
		svc.r.initialize(svc);
		svc.initialize();
		return svc.learningObjects;
	};
	svc.remove = function (cls) {
		svc.learningObjects.splice(svc.learningObjects.indexOf(cls), 1);
	};
	svc.get = function (classId) {
		for (var i = 0; i < svc.learningObjects.length; i++) {
			if (svc.learningObjects[i].id === parseInt(classId)) {
				return svc.learningObjects[i];
			}
		}
		return null;
	};
});
