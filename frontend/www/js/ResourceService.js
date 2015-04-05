'use strict';

angular.module('app.resources', []).service('Resources', function ($resource, $http, Utility) {
	var svc = this;

	svc.retrieve = function () {
		return $resource('/api/resource', {}, {});
	};

	svc.findAlignments = function (instrument, resourceId) {
		if (!Utility.empty(instrument) && !Utility.empty(instrument.questions)) {
			for (var k = 0; k < instrument.questions.length; k++) {
				instrument.questions[k].alignment = 0;
			}
			for (var j = 0; j < instrument.alignments.length; j++) {
				var alignment = instrument.alignments[j];
				var questionId = parseInt(alignment.questionId);
				if (parseInt(resourceId) == parseInt(alignment.resourceId)) {
					for (k = 0; k < instrument.questions.length; k++) {
						if (parseInt(instrument.questions[k].id) == questionId) {
							instrument.questions[k].alignment = alignment.weight;
						}
					}
				}
			}
		}
	};

	svc.saveAlignments = function (instrumentId, resourceId, questions) {
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
					  console.log("save failed");
				  });
	}
});
