'use strict';

angular.module('Members', ['Graphs']).service('Members', function ($filter, $resource, $http, $cookieStore, Graphs, Utility, Instruments) {
	var svc = this;

	svc.retrieve = function () {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user)) {
			return $resource('/api2/organization/' + user.organizationId + '/r/members', {}, {});
		}
		return null;
	};

	svc.retrieveSingle = function (memberId) {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user) && !Utility.empty(memberId)) {
			return $resource('/api2/member/' + memberId + '/m/1', {}, {query: {method: 'GET', isArray: false}});
		}
		return null;
	};

	svc.saveProfile = function (member, callbackFn) {
		var memberRec = {id: member.id, firstName: member.firstName, lastName: member.lastName, roleId: member.roleId};
		$http({
			method: 'POST',
			url: "/api/member/saveProfile",
			data: $.param({member: memberRec}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
			success(function (data, status, headers, config) {
						callbackFn(1, data);
					}).
			error(function (data, status, headers, config) {
					  callbackFn(0, data);
				  });
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
				case "N":
					return "Nurse";
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

	svc.rptConfigHx = function (instruments, member, assessments) {
		var memberHx = [];
		if (!Utility.empty(instruments) && !Utility.empty(member) && !Utility.empty(assessments)) {
			var instrument = Utility.findObjectById(instruments, assessments[0].ii); //@todo Assumes all same instrument
			var maxY = instrument.max;
			for (var z = 0; z < instrument.sections.length; z++) {
				var series = [];
				var xLabels = [];
				var section = instrument.sections[z];
				for (var i = 0; i < assessments.length && i < 3; i++) {
					var assessment = assessments[i];
					var dataSet = [];
					for (var j = 0; j < section.questions.length; j++) {
						var question = section.questions[j];
						if (i == 0) {
							xLabels.push(question.n);
						}
						var response = svc.findResponse(assessment.responses, question.id);
						dataSet.push({label: response.r, y: parseInt(response.ri)});
					}
					series.push({id: i, type: 'column', name: $filter('date')(assessment.lastModified, 'shortDate'), data: dataSet});
				}
				var rptCfg = Graphs.columnGraphConfig(section.n, null, 'Competency', 'Ranking', maxY, xLabels, series);
				memberHx.push({title: section.n, config: rptCfg});
			}
		}
		return memberHx;
	};

});