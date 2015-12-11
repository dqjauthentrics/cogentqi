/**
 * @author     David Quinn-Jacobs
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('Members', ['Graphs']).service('Members', function ($filter, $resource, $http, $cookieStore, Graphs, Utility, Instruments) {
	var svc = this;
	svc.list = null;
	svc.current = null;

	svc.retrieve = function (includeInactive) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			var drilldown = 0;
			var url = '/api3/member/index/' + user.oi + '/' + drilldown + '/' + (includeInactive ? 1 : 0);
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
					  callbackFn(data);
				  },
				  function (data, status, headers, config) {
					  callbackFn(data);
				  });
	};

	svc.deOrReactivate = function (member, callbackFn) {
		$http({
				  method: 'GET',
				  url: "/api3/member/dereactivate/" + member.id + '/' + (member.active_end ? 0 : 1),
				  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			  }).success(function (data, status, headers, config) {
			callbackFn(data);
		}).error(function (data, status, headers, config) {
			callbackFn(0, data);
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
			var maxY = instrument.max;
			for (var z = 0; z < instrument.sections.length; z++) {
				var series = [];
				var xLabels = [];
				var section = instrument.sections[z];
				var start = assessments.length >= 3 ? 2 : assessments.length;
				for (var i = start; i >= 0; i--) {
					var assessment = assessments[i];
					var dataSet = [];
					for (var j = 0; j < section.questions.length; j++) {
						var question = section.questions[j];
						if (i == 0) {
							xLabels.push(question.n);
						}
						var response = svc.findResponse(assessment.responses, question.id);
						dataSet.push({label: response.rp, y: parseInt(response.rdx)});
					}
					series.push({id: i, type: 'column', name: $filter('date')(assessment.lm, 'shortDate'), data: dataSet});
				}
				var rptCfg = Graphs.columnGraphConfig(section.n, null, 'Competency', 'Ranking', maxY, xLabels, series);
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
