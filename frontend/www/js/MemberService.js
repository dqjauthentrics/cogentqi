'use strict';

angular.module('app.members', ['app.graphs']).service('Members', function ($http, $cookieStore, Graphs, Utility) {
	var svc = this;
	svc.members = false;
	svc.memberHx = false;
	svc.apiUrl = "/api/member";

	svc.initialize = function (organizationId) {
		var user = $cookieStore.get('user');
		if (svc.members === false && !Utility.empty(user)) {
			svc.members = true;
			if (Utility.empty(organizationId)) {
				organizationId = user.organizationId;
			}
			var url = svc.apiUrl + '/organization/' + organizationId;
			$http.get(url).
				success(function (data, status, headers, config) {
							svc.members = data.result;
							console.log("members initialized", svc.members);
						}).
				error(function (data, status, headers, config) {
						  console.log("ERROR: unable to retrieve members.");
					  });
		}
	};

	svc.getMembers = function () {
		return svc.members;
	};

	svc.find = function (memberId) {
		for (var i = 0; i < svc.members.length; i++) {
			if (parseInt(svc.members[i].id) === parseInt(memberId)) {
				return svc.members[i];
			}
		}
		return null;
	};

	svc.numBadges = function (member) {
		var num = 0;
		if (!Utility.empty(member) && !Utility.empty(member.badges)) {
			num = member.badges.length;
		}
		return num.toString();
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

	svc.findLastEvaluation = function (member) {
		if (!Utility.empty(member) && !Utility.empty(member.evaluations)) {
			return member.evaluations[0];
		}
		return null;
	};

	svc.rptConfigHx = function (Evaluations, member) {
		if (svc.memberHx === false) {
			var series = [];
			if (!Utility.empty(member.evaluations)) {
				for (var i = 0; i < member.evaluations.length; i++) {
					var evaluation = member.evaluations[i];
					var dataSet = [];
					var instrument = Evaluations.findInstrument(evaluation.insrumentId);
					if (!Utility.empty(instrument)) {
						for (var j = 0; j < instrument.questions.length; j++) {
							var question = instrument.questions[j];
							dataSet.push({name: question.name, y: Utility.randomIntBetween(1, 5)});
						}
					}
					series.push({id:i, name:evaluation.lastModified, data: dataSet, type: 'line', color: 'gray'});
				}
			}
			svc.memberHx = Graphs.lineGraphConfig('Progress', null, 'Competency', 'Ranking', dataSet, true);
		}
		return svc.memberHx;
	};

});
