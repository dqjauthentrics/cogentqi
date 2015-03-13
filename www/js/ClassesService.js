angular.module('app.classes', ['app.utils', 'app.resources']).service('Classes', function (Utility, Resources) {
	var svc = this;
	svc.r = Resources;
	svc.classes = [];

	svc.all = function () {
		return svc.classes;
	};
	svc.remove = function (cls) {
		svc.classes.splice(svc.classes.indexOf(cls), 1);
	};
	svc.get = function (classId) {
		for (var i = 0; i < svc.classes.length; i++) {
			if (svc.classes[i].id === parseInt(classId)) {
				return svc.classes[i];
			}
		}
		return null;
	};

	if (!svc.initialized) {
		for (var i = 0; i < svc.r.resources.length; i++) {
			svc.classes.push({id: i, starts: '2015-01-01', ends: '2015-12-31', type: 'C', resource: svc.r.resources[i]});
		}
	}

});
