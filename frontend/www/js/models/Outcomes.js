/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Outcomes', []).service('Outcomes', function ($cookieStore, $resource, $http, Utility) {
	var svc = this;
	svc.list = null;
	svc.current = null;

	svc.retrieve = function () {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			return $resource('/api3/outcome', {}, {query: {method: 'GET', isArray: false, cache: false}});
		}
		return null;
	};
	svc.retrieveSingle = function (outcomeId) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user) && !Utility.empty(outcomeId)) {
			var orgId = user.oi;
			return $resource('/api3/outcome/get/' + outcomeId + '/' + orgId, {}, {query: {method: 'GET', isArray: false, cache: false}});
		}
		return null;
	};
	svc.retrieveForOrg = function (parentOrgId) {
		var url = '/api3/outcome/byOrganization/' + parentOrgId;
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
			$http.post("/api3/outcome/saveAlignments", {instrumentId: instrumentId, outcomeId: outcomeId, alignments: alignments})
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

	svc.filterer = function (outcome, filterText) {
		if (outcome) {
			try {
				if (!Utility.empty(filterText) && !Utility.empty(outcome)) {
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
		}
		return true;
	};
});
