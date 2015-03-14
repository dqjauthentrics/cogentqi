'use strict';

angular.module('app.members', ['app.utils', 'app.assessments']).service('Members', function (angularLoad, Utility, Assessments) {
	var svc = this;
	svc.a = Assessments;
	svc.initialized = false;
	svc.members = [];

	svc.load = function (callback) {
		if (Utility.empty(svc.members)) {
			angularLoad.loadScript('js/config/target/members.js').then(function () {
				svc.members = members;
				//console.log("members loaded", svc.members);
				callback();
			}).catch(function () {
                console.log("ERROR: Unable to load members.")
			});
		}
		else {
			callback();
		}
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
		//console.log("retrieveCompetencies(" + member.id + "):", competencies);
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

					for (var j = 0; j < svc.a.assessments.length; j++) {
						if (svc.a.assessments[j].memberId == svc.members[i].id) {
							svc.a.assessments[j].member = svc.members[i];
							svc.members[i].assessmentId = svc.a.assessments[j].id;
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
			if (svc.members[i].id === parseInt(memberId)) {
				svc.getCompetencies(memberId);
				return svc.members[i];
			}
		}
		return null;
	};

	svc.initialize = function () {
		svc.load(function () {
			Assessments.load(function () {
				svc.getAllCompetencies(function () {
				});
			});
		});
	}

});
