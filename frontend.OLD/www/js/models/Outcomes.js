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
						if (!Utility.empty(svc.list)) {
							svc.current = svc.list[0];
						}
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
		var phrase = 'Unaligned';
		switch (parseInt(level)) {
			case 1:
				phrase = 'Minimally Aligned';
				break;
			case 2:
				phrase = 'Partially Aligned';
				break;
			case 3:
				phrase = 'Generally Aligned';
				break;
			case 4:
				phrase = 'Mostly Aligned';
				break;
			case 5:
				phrase = 'Highly Aligned';
				break;
		}
		return phrase;
	};
	svc.levelGrade = function (level) {
		var grade = 0;
		if (level <= 0.25) {
			grade = 1;
		}
		else if (level <= 0.5) {
			grade = 2;
		}
		else if (level <= 0.75) {
			grade = 3;
		}
		else {
			grade = 4;
		}
		return grade;
	};
	svc.setBarColor = function (level, outcomeId) {
		var grade = svc.levelGrade(level);
		var range = $("#range" + outcomeId);
		var color = 'outcomeLevel' + grade;
		range.removeClass('outcomeLevel0').removeClass('outcomeLevel1').removeClass('outcomeLevel2').removeClass('outcomeLevel3');
		range.addClass(color);
		return color;
	};
	svc.outcomeLevelPhrase = function (level) {
		var phrase = 'No Data';
		if (level <= 0.25) {
			phrase = 'Unacceptable';
		}
		else if (level <= 0.5) {
			phrase = 'Acceptable';
		}
		else if (level <= 0.75) {
			phrase = 'Good';
		}
		else {
			phrase = 'Excellent';
		}
		return phrase;
	};
	svc.getRubric = function (level) {
		var rubric = '';
		switch (svc.levelGrade(level)) {
			case 0:
				rubric = 'This outcome is not relevant, at the moment.';
				break;
			case 1:
				rubric = 'This outcome is unacceptable.  Urgent action is required.';
				break;
			case 2:
				rubric =
					'The level of performance for this outcome is acceptable and within the range of normal, but there is much room for improvement.';
				break;
			case 3:
				rubric =
					'The level of performance for this outcome is good, and well within the range of normal, but there is still some room for improvement.';
				break;
			case 4:
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