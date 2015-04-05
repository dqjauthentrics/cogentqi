'use strict';

angular.module('app.members', ['app.graphs']).service('Members', function ($resource, $http, $cookieStore, Graphs, Utility, Instruments) {
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

	svc.rptConfigHx = function (instruments, member, evaluations) {
		var memberHx = null;
		var series = [];
		if (!Utility.empty(instruments) && !Utility.empty(member) && !Utility.empty(evaluations)) {
			for (var i = 0; i < evaluations.length; i++) {
				var evaluation = evaluations[i];
				var instrument = Utility.findObjectById(instruments, evaluation.instrumentId);
				var dataSet = [];
				if (!Utility.empty(instrument)) {
					for (var j = 0; j < instrument.questions.length; j++) {
						var question = instrument.questions[j];
						dataSet.push({name: question.name, y: Utility.randomIntBetween(1, 5)});
					}
				}
				series.push({id: i, name: evaluation.lastModified, data: dataSet, type: 'line', color: 'gray'});
			}
		}
		memberHx = Graphs.lineGraphConfig('Progress', null, 'Competency', 'Ranking', dataSet, true);
		return memberHx;
	};

});
