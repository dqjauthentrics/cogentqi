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
	};

	svc.retrieveAlignments = function (questions) {
		if (!Utility.empty(questions)) {
			for (var i = 0; i < questions.length; i++) {
				questions[i].alignment = Utility.randomIntBetween(0, 3);
			}
		}
	};
	svc.saveAlignments = function (instrumentId, resourceId, questions) {
		console.log("saveAlignments", questions);
		if (!Utility.empty(questions) && !Utility.empty(resourceId)) {
			var alignments = [];
			for (var i = 0; i < questions.length; i++) {
				if (questions[i].alignment > 0) {
					alignments.push({id: questions[i].id, wt: questions[i].alignment});
				}
			}
			$http({
					  method: 'POST',
					  url: "/api/resource/saveAlignments",
					  data: $.param({instrumentId: instrumentId, resourceId: resourceId, alignments: alignments}),
					  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				  }).
				success(function (data, status, headers, config) {
							console.log(data.result);
						}).
				error(function (data, status, headers, config) {
						  console.log("Login failed.");
					  });
		}
	}
});
