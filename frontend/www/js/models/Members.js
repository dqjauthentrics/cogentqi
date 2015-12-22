/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Members', ['Graphs']).service('Members', function ($filter, $resource, $http, $cookieStore, Graphs, Utility, Instruments) {
	var svc = this;
	svc.list = null;
	svc.current = null;

	svc.retrieve = function (includeInactive, drilldown) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			var url = '/api3/member/index/' + user.oi + '/' + (drilldown? 1 : 0) + '/' + (includeInactive ? 1 : 0);
			return $resource(url, {}, {query: {method: 'GET', isArray: false, cache: false}});
		}
		return null;
	};

	svc.retrieveSingle = function (memberId) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user) && !Utility.empty(memberId)) {
			return $resource('/api3/member/getProfile/' + memberId, {}, {query: {method: 'GET', isArray: false, cache: false}});
		}
		return null;
	};

	svc.saveProfile = function (member, callbackFn) {
		var memberRec = {id: member.id, fn: member.fn, ln: member.ln, r: member.r, ph: member.ph, ad: member.ad, mb: member.mb};
		$http.post("/api3/member/update", {member: memberRec})
			.then(function (data, status, headers, config) {
					  callbackFn(data.data);
				  },
				  function (data, status, headers, config) {
					  callbackFn(data.data);
				  });
	};

	svc.deOrReactivate = function (member, activate, callbackFn) {
		$http.get("/api3/member/dereactivate/" + member.id + '/' + activate)
			.then(function (data, status, headers, config) {
					  callbackFn(data.data);
				  },
				  function (data, status, headers, config) {
					  callbackFn(data.data);
				  });
	};

	svc.findResponse = function (responses, questionId) {
		if (!Utility.empty(responses) && !Utility.empty(questionId)) {
			for (var i = 0; i < responses.length; i++) {
				if (responses[i].qi == questionId) {
					return responses[i];
				}
			}
		}
		return 0;
	};

	svc.rptConfigHx = function (instruments, member, assessments) {
		var memberHx = [];
		if (!Utility.empty(instruments) && !Utility.empty(member) && !Utility.empty(assessments)) {
			var instrument = Utility.findObjectById(instruments, assessments[0].ii); //@todo Assumes all same instrument
			if (Utility.empty(instrument)) {
				return null; // NB: abrupt return
			}
			var maxY = instrument.max;
			for (var z = 0; z < instrument.sections.length; z++) {
				var series = [];
				var xLabels = [];
				var section = instrument.sections[z];
				var start = Math.min(assessments.length - 1, 2);
				for (var i = start; i >= 0; i--) {
					var assessment = assessments[i];
					var dataSet = [];
					for (var j = 0; j < section.questions.length; j++) {
						var question = section.questions[j];
						if (i == 0) {
							xLabels.push(question.n);
						}
						var response = assessment.responses[question.id];
						if (!Utility.empty(response)) {
							dataSet.push({label: response.rp, y: parseInt(response.rdx)});
						}
					}
					series.push({id: i, type: 'column', name: $filter('date')(assessment.lm, 'shortDate'), data: dataSet});
				}
				var rptCfg = Graphs.columnGraphConfig(section.n, null, 'Competency', 'Ranking', maxY, xLabels, series);
				console.log(rptCfg);
				memberHx.push({title: section.n, config: rptCfg});
			}
		}
		return memberHx;
	};

	svc.filterer = function (member, filterText) {
		try {
			if (filterText != null && !Utility.empty(member)) {
				filterText = filterText.toLowerCase();
				return filterText == null ||
					member.fn.toLowerCase().indexOf(filterText) >= 0 ||
					member.ln.toLowerCase().indexOf(filterText) >= 0 ||
					(member.rn != undefined ? member.rn.toLowerCase().indexOf(filterText) >= 0 : false)
					;
			}
		}
		catch (exception) {
			console.log(exception);
		}
		return true;
	}


});
