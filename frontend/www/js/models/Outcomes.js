'use strict';

angular.module('Outcomes', []).service('Outcomes', function ($cookieStore, $resource, $http, Utility) {
	var svc = this;
	svc.list = null;
	svc.current = null;

	svc.retrieve = function () {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			return $resource('/api2/outcome', {}, {});
		}
		return null;
	};
	svc.retrieveForOrg = function (parentOrgId) {
		var url = '/api2/outcome/' + parentOrgId + '/r/organizations';
		return $resource(url, {}, {query: {method: 'GET', isArray: false, cache: false}});
	};

	svc.find = function (outcomeId) {
		for (var i = 0; i < svc.list.length; i++) {
			if (svc.list[i].id == outcomeId) {
				return svc.list[i];
			}
		}
		return null;
	};

	svc.saveAlignments = function (instrumentId, outcomeId, alignments, callbackFn) {
		try {
			$http({
					  method: 'PUT',
					  url: "/api2/outcome-alignment",
					  data: $.param({instrumentId: instrumentId, outcomeId: outcomeId, alignments: alignments}),
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

	svc.filterer = function (outcome, filterText) {
		try {
			if (filterText != null && !Utility.empty(outcome)) {
				filterText = filterText.toLowerCase();
				return filterText == null ||
					outcome.nmb.toLowerCase().indexOf(filterText) >= 0 ||
					outcome.n.toLowerCase().indexOf(filterText) >= 0 ||
					outcome.sm.toLowerCase().indexOf(filterText) >= 0
					;
			}
		}
		catch (exception) {
			console.log("outcome filter exception: ", exception);
		}
		return true;
	};
});
