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
	svc.loadAll = function (callbackFn) {
		if (svc.list == null) {
			return $http.get('/api3/outcome')
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
		}
	};

	svc.retrieveSingle = function (outcomeId) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user) && !Utility.empty(outcomeId)) {
			var orgId = user.oi;
			return $resource('/api3/outcome/get/' + outcomeId + '/' + orgId, {}, {query: {method: 'GET', isArray: false, cache: false}});
		}
		return null;
	};
	svc.retrieveForOrg = function (parentOrgId, includeAlignments) {
		var url = '/api3/outcome/byOrganization/' + parentOrgId + '/' + (includeAlignments ? 1 : 0);
		return $resource(url, {}, {query: {method: 'GET', isArray: false, cache: false}});
	};
	svc.retrieveTrends = function (organizationId) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			return $resource('/api3/outcome/trends/' + organizationId, {}, {query: {method: 'GET', isArray: false, cache: false}});
		}
		return null;
	};

	svc.find = function (outcomeId) {
		for (var i = 0; i < svc.list.length; i++) {
			if (svc.list[i].id == outcomeId) {
				return svc.list[i];
			}
		}
		return null;
	};

	svc.saveAlignments = function (instrumentId, outcome, alignments, callbackFn) {
		try {
			$http.post("/api3/outcome/saveAlignments", {instrumentId: instrumentId, outcome: outcome, alignments: alignments})
				.then(function (data, status, headers, config) {
						  callbackFn(data.data);
					  },
					  function (data, status, headers, config) {
						  var response = {status: 0, message: data};
						  callbackFn(response);
					  });
		}
		catch (exception) {
			callbackFn(0, exception);
		}
	};

	svc.saveLevels = function (orgLevels, callbackFn) {
		try {
			$http.post("/api3/outcome/saveLevels", {orgLevels: orgLevels})
				.then(function (data, status, headers, config) {
						  callbackFn(data.data);
					  },
					  function (data, status, headers, config) {
						  var response = {status: 0, message: data};
						  callbackFn(response);
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

	svc.alignmentLevelPhrase = function (level) {
		var phrase = 'No Alignment';
		switch (parseInt(level)) {
			case 1:
				phrase = 'Partially Aligned';
				break;
			case 2:
				phrase = 'Well-Aligned';
				break;
			case 3:
				phrase = 'Highly Aligned';
				break;
		}
		return phrase;
	};
	svc.getBarColor = function (outcome, currentOrg) {
		var color = 'stable';
		if (!Utility.empty(outcome) && !Utility.empty(currentOrg)) {
			var id = currentOrg.id;
			var level = outcome.lv;
			var range = $("#range" + outcome.id);
			switch (parseInt(level)) {
				case 1:
					color = 'assertive';
					break;
				case 2:
					color = 'energized';
					break;
				case 3:
					color = 'balanced';
					break;
			}
			range.removeClass('range-stable').removeClass('range-assertive').removeClass('range-energized').removeClass('range-balanced').addClass(
				'range-' + color);
		}
		return 'range-' + color;
	};
	svc.outcomeLevelPhrase = function (level) {
		var phrase = 'No Data';
		switch (parseInt(level)) {
			case 1:
				phrase = 'Unacceptable';
				break;
			case 2:
				phrase = 'Acceptable';
				break;
			case 3:
				phrase = 'Excellent';
				break;
		}
		return phrase;
	};
	svc.getRubric = function (level) {
		var rubric = '';
		switch (parseInt(level)) {
			case 0:
				rubric = 'This outcome is not relevant, at the moment.';
				break;
			case 1:
				rubric = 'This outcome is unacceptable.  Urgent action is required.';
				break;
			case 2:
				rubric =
					'The level of performance for this outcome is acceptable and within the range of normal, but there is room for improvement.';
				break;
			case 3:
				rubric = 'This performance level is excellent, exceeding the prescribed normal minimums.  No action is required.';
				break;
		}
		return rubric;
	};
	svc.methodMessage = function (method) {
		if (method == "D") {
			return "NOTE: This outcome level is calculated through examination of data; it is not recommended that you manually change it.";
		}
		return "Manually configured outcome level.";
	};
});
