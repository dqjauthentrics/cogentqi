'use strict';

angular.module('app.resources', ['app.utility']).service('Resources', function ($http, Utility) {
	var svc = this;
	svc.resources = null;

	svc.initialize = function (l) {
		if (Utility.empty(svc.resources)) {
			svc.resources = ['zz'];
			$http.get('/api/resource/all').
				success(function (data, status, headers, config) {
							svc.resources = data.result;
							if (!Utility.empty(l)) {
								l.initialize();
							}
						}).
				error(function (data, status, headers, config) {
					  });
		}
		return svc.resources;
	};

	svc.get = function (resourceId) {
		if (!Utility.empty(svc.resources)) {
			for (var i = 0; i < svc.resources.length; i++) {
				if (svc.resources[i].id == resourceId) {
					return svc.resources[i];
				}
			}
		}
		return null;
	};

	svc.getAll = function (l) {
		svc.initialize(l);
		return svc.resources;
	}
});
