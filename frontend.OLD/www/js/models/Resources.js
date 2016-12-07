/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Resources', []).service('Resources', function ($q, $resource, $http, Utility) {
	var svc = this;
	svc.list = null;
	svc.current = null;

	svc.retrieve = function (resourceId) {
		var url = '/api3/resource';
		if (!Utility.empty(resourceId)) {
			return $resource(url + '/get/' + resourceId, {}, {query: {method: 'GET', isArray: false, cache: false}});
		}
		else {
			return $resource(url, {}, {query: {method: 'GET', isArray: false, cache: false}});
		}
	};

	svc.loadAll = function (callbackFn) {
		if (svc.list == null) {
			return $http.get('/api3/resource')
				.then(
					function (result) {
						if (result.data.status !== 1) {
							return $q.reject(result.data);
						}
						svc.list = result.data.data;
						callbackFn(svc.list);
						return svc;
					},
					function (error) {
						return $q.reject(error);
					}
				);
		}
		else {
			callbackFn(svc.list);
			return $q.when(svc);
		}
	};

	svc.save = function (resource, callbackFn) {
		try {
			$http.post("/api3/resource/save", {resource: resource})
				.then(function (data, status, headers, config) {
						  callbackFn(data.status, data.message);
					  },
					  function (data, status, headers, config) {
						  callbackFn(0, data);
					  });
		}
		catch (exception) {
			callbackFn(0, exception);
		}
	};

	svc.remove = function (id, callbackFn) {
		try {
			$http.post("/api3/resource/remove", {id: id})
				.then(function (data, status, headers, config) {
						  callbackFn(data.status, data.message);
					  },
					  function (data, status, headers, config) {
						  callbackFn(0, data);
					  });
		}
		catch (exception) {
			callbackFn(0, exception);
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

	svc.saveAlignments = function (instrumentId, resource, alignments, callbackFn) {
		try {
			$http.post("/api3/resource/saveAlignments", {instrumentId: instrumentId, resource: resource, alignments: alignments})
				.then(function (result, headers, config) {
						  callbackFn(result.data);
					  },
					  function (result, headers, config) {
						  callbackFn(result.data);
					  });
		}
		catch (exception) {
			callbackFn(0, exception);
		}
	};

	svc.filterer = function (resource, filterText) {
		try {
			if (!Utility.empty(filterText) && !Utility.empty(resource)) {
				filterText = filterText.toLowerCase();
				return filterText == null ||
					(resource.nmb && resource.nmb.toLowerCase().indexOf(filterText) >= 0) ||
					(resource.n && resource.n.toLowerCase().indexOf(filterText) >= 0) ||
					(resource.sm && resource.sm.toLowerCase().indexOf(filterText) >= 0)
					;
			}
		}
		catch (exception) {
			console.log("resource filter exception: ", exception);
		}
		return true;
	}

});