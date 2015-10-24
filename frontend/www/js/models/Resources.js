'use strict';

angular.module('Resources', []).service('Resources', function ($resource, $http, Utility) {
	var svc = this;
	svc.list = null;
	svc.current = null;

	svc.retrieve = function (resourceId) {
		var url = '/api2/resource';
		if (!Utility.empty(resourceId)) {
			return $resource(url + '/' + resourceId + '/m/1', {}, {query: {isArray: false, cache: true}});
		}
		else {
			return $resource(url + '/m/1', {}, {query: {isArray: true, cache: true}});
		}
	};

	svc.findAlignments = function (instrument, resourceId) {
		if (!Utility.empty(instrument) && !Utility.empty(instrument.questions)) {
			for (var k = 0; k < instrument.questions.length; k++) {
				instrument.questions[k].alignment = 0;
			}
			for (var j = 0; j < instrument.alignments.length; j++) {
				var alignment = instrument.alignments[j];
				var questionId = parseInt(alignment.qi);
				if (parseInt(resourceId) == parseInt(alignment.rdx)) {
					for (k = 0; k < instrument.questions.length; k++) {
						if (parseInt(instrument.questions[k].id) == questionId) {
							instrument.questions[k].alignment = alignment.wt;
						}
					}
				}
			}
		}
	};

	svc.saveAlignments = function (instrumentId, resourceId, alignments, callbackFn) {
		try {
			$http({
					  method: 'PUT',
					  url: "/api2/resource-alignment",
					  data: $.param({instrumentId: instrumentId, resourceId: resourceId, alignments: alignments}),
					  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				  }).success(function (data, status, headers, config) {
				callbackFn(data, data);
			}).error(function (data, status, headers, config) {
				callbackFn(0, data);
			});
		}
		catch (exception) {
			callbackFn(0, exception);
		}
	};

	svc.filterer = function (resource, filterText) {
		try {
			if (filterText != null && !Utility.empty(resource)) {
				filterText = filterText.toLowerCase();
				return filterText == null ||
					resource.nmb.toLowerCase().indexOf(filterText) >= 0 ||
					resource.n.toLowerCase().indexOf(filterText) >= 0 ||
					resource.sm.toLowerCase().indexOf(filterText) >= 0
					;
			}
		}
		catch (exception) {
			console.log("resource filter exception: ", exception);
		}
		return true;
	}

});
