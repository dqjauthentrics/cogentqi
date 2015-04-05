'use strict';

angular.module('app.members', ['app.graphs']).service('Members', function ($filter, $resource, $http, $cookieStore, Graphs, Utility, Instruments) {
	var svc = this;

	svc.retrieve = function () {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			return $resource('/api/member/organization/' + user.organizationId, {}, {});
		}
		return null;
	};

	svc.retrieveSingle = function (memberId) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user) && !Utility.empty(memberId)) {
			return $resource('/api/member/' + memberId, {}, {query: {method: 'GET', isArray: false}});
		}
		return null;
	};

	svc.roleName = function (member) {
		var roleName = "-unknown role-";
		if (!Utility.empty(member)) {
			roleName = member.roleId;
			switch (member.roleId) {
				case "S":
					return "System Administrator";
				case "P":
					return "Pharmacist";
				case "T":
					return "Pharmacy Technician";
				case "A":
					return "Administrator";
				case "M":
					return "Manager";
			}
		}
		return roleName;
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

	svc.rptConfigHx = function (instruments, member, evaluations) {
		var memberHx = [];
		var maxY = 5;
		if (!Utility.empty(instruments) && !Utility.empty(member) && !Utility.empty(evaluations)) {
			var instrument = Utility.findObjectById(instruments, evaluations[0].instrumentId); //@todo Assumes all same instrument
			if (instrument.id == 2) {
				maxY = 2; //@todo Tie to instrument ranges in future.
			}
			for (var z = 0; z < instrument.sections.length; z++) {
				var series = [];
				var xLabels = [];
				var section = instrument.sections[z];
				for (var i = 0; i < evaluations.length && i < 3; i++) {
					var evaluation = evaluations[i];
					var dataSet = [];
					for (var j = 0; j < section.questions.length; j++) {
						var question = section.questions[j];
						if (i == 0) {
							xLabels.push(question.name);
						}
						var response = svc.findResponse(evaluation.responses, question.id);
						console.log("TEXT:", response.r);
						dataSet.push({label: response.r, y: parseInt(response.ri)});
					}
					series.push({id: i, type: 'column', name: $filter('date')(evaluation.lastModified, 'shortDate'), data: dataSet});
				}
				var rptCfg = Graphs.columnGraphConfig(section.name, null, 'Competency', 'Ranking', maxY, xLabels, series);
				memberHx.push({title: section.name, config: rptCfg});
			}
		}
		return memberHx;
	};

});
