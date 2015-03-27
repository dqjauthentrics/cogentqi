'use strict';

angular.module('app.resources', ['app.utility']).service('Resources', function ($http, Utility) {
	var svc = this;
	svc.resources = false;

	svc.initialize = function (l, callback) {
		if (svc.resources === false) {
			svc.resources = true;
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

	svc.retrieveAlignments = function (instrument, resourceId, questions) {
		//console.log("retrieveAlignments:", instrument, questions);
		if (!Utility.empty(instrument)) {
			//console.log("retrieveAlignments:init");
			for (var k = 0; k < questions.length; k++) {
				questions[k].alignment = 0;
			}
			for (var j = 0; j < instrument.alignments.length; j++) {
				var alignment = instrument.alignments[j];
				var questionId = parseInt(alignment.questionId);
				//console.log("retrieveAlignments:loop", alignment);
				if (parseInt(resourceId) == parseInt(alignment.resourceId)) {
					for (k = 0; k < questions.length; k++) {
						if (parseInt(questions[k].id) == questionId) {
							questions[k].alignment = alignment.weight;
						}
					}
				}
			}
		}
	};
	svc.saveAlignments = function (instrumentId, resourceId, questions) {
		//console.log("saveAlignments", questions);
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
							console.log("saved");
						}).
				error(function (data, status, headers, config) {
						  console.log("Login failed.");
					  });
		}
	}
});
