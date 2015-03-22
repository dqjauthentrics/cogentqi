'use strict';

angular.module('app.members', ['app.evaluations']).service('Members', function ($http, $cookieStore, Installation, Utility, Evaluations) {
	var svc = this;
	svc.a = Evaluations;
	svc.initialized = false;
	svc.members = [];
	svc.apiUrl = "/api/member";

	svc.initialize = function () {
		console.log("member load start");
		var user = $cookieStore.get('user');
		if (Utility.empty(svc.members) && !Utility.empty(user)) {
			svc.members = ['zz'];
			var organizationId = user.organizationId;
			console.log("member load call for ", organizationId);
			$http.get(svc.apiUrl + '/organization/' + organizationId).
				success(function (data, status, headers, config) {
							console.log("members retrieved:", data);
							svc.members = data.result;
							Evaluations.initialize();
						}).
				error(function (data, status, headers, config) {
						  console.log("ERROR: unable to retrieve members.");
					  });
		}
	};

	svc.getMembers = function () {
		svc.initialize();
		return svc.members;
	};

	svc.remove = function (member) {
		svc.members.splice(svc.members.indexOf(member), 1);
	};

	svc.retrieveCompetencies = function (member) {
		var totScore = 0;
		var competencies = JSON.parse(JSON.stringify(svc.a.competencies)); // clone
		for (var i = 0; i < competencies.length; i++) {
			competencies[i].val = 0;
			var sectionTotal = 0;
			for (var j = 0; j < competencies[i].children.length; j++) {
				var val = Math.floor((Math.random() * 5)) + 1;
				competencies[i].children[j].val = val;
				sectionTotal += val;
			}
			competencies[i].val = sectionTotal > 0 ? Math.round(sectionTotal / competencies[i].children.length) : 0;
			totScore += val;
		}
		var level = totScore > 0 && competencies.length > 0 ? Math.round(totScore / competencies.length) : 0;
		return {competencies: competencies, level: level};
	};

	svc.getSectionCompetencies = function (member, sectionId) {
		if (!Utility.empty(member) && !Utility.empty(member.competencies)) {
			for (var i = 0; i < member.competencies.length; i++) {
				if (member.competencies[i].id == sectionId) {
					//console.log("COMPRET:", member.competencies[i]);
					return member.competencies[i];
				}
			}
		}
		return null;
	};

	svc.getCompetencies = function (memberId) {
		//console.log("e.getCompetencies(" + memberId + ")");
		if (!Utility.empty(svc.a) && !Utility.empty(svc.a.competencies)) {
			//console.log("e.getCompetencies(" + memberId + "), framework competencies were loaded");
			for (var i = 0; i < svc.members.length; i++) {
				if ((memberId == null || svc.members[i].id == memberId) && Utility.empty(svc.members[i].competencies)) {
					var compInfo = svc.retrieveCompetencies(svc.members[i]);
					svc.members[i].competencies = compInfo.competencies;
					svc.members[i].level = compInfo.level;
					//console.log("e.getCompetencies(" + svc.members[i].id + "):", svc.members[i].competencies);

					for (var j = 0; j < svc.a.evaluations.length; j++) {
						if (svc.a.evaluations[j].memberId == svc.members[i].id) {
							svc.a.evaluations[j].member = svc.members[i];
							svc.members[i].evaluationId = svc.a.evaluations[j].id;
						}
					}
					if (memberId !== null) {
						return svc.members[i].competencies;
					}
				}
			}
		}
		return null;
	};

	svc.getAllCompetencies = function (callback) {
		//console.log("e.getAllCompetencies()");
		svc.getCompetencies(null);
		callback();
	};

	svc.get = function (memberId) {
		for (var i = 0; i < svc.members.length; i++) {
			if (parseInt(svc.members[i].id) === parseInt(memberId)) {
				svc.getCompetencies(memberId);
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
	}

});
