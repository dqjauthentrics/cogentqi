'use strict';

angular.module('app.members', ['app.graphs']).service('Members', function ($resource, $http, $cookieStore, Graphs, Utility, Instruments) {
	var svc = this;
	svc.members = null;
	svc.memberHx = null;
	svc.evaluations = null;

	svc.retrieve = function () {
		var user = $cookieStore.get('user');
		if (!Utility.empty(user) && svc.members === null) {
			svc.members = [];
			console.log("member retrieval for org:", user.organizationId);
			$resource('/api/member/organization/' + user.organizationId, {}, {}).query().$promise.then(function (data) {
				console.log("members retrieved:", user.organizationId, data);
				svc.members = data;
			});
		}
		return svc.members;
	};

	svc.find = function (memberId) {
		if (svc.members !== null) {
			for (var i = 0; i < svc.members.length; i++) {
				if (parseInt(svc.members[i].id) === parseInt(memberId)) {
					return svc.members[i];
				}
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

	svc.rptConfigHx = function (member) {
		if (Utility.empty(svc.memberHx)) {
			var series = [];
			if (!Utility.empty(member.evaluations)) {
				for (var i = 0; i < member.evaluations.length; i++) {
					var evaluation = member.evaluations[i];
					var dataSet = [];
					var instrument = Instruments.find(evaluation.insrumentId);
					if (!Utility.empty(instrument)) {
						for (var j = 0; j < instrument.questions.length; j++) {
							var question = instrument.questions[j];
							dataSet.push({name: question.name, y: Utility.randomIntBetween(1, 5)});
						}
					}
					series.push({id: i, name: evaluation.lastModified, data: dataSet, type: 'line', color: 'gray'});
				}
			}
			svc.memberHx = Graphs.lineGraphConfig('Progress', null, 'Competency', 'Ranking', dataSet, true);
		}
		return svc.memberHx;
	};

});
