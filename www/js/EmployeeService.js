'use strict';

angular.module('app.employees', ['app.utils', 'app.assessments']).service('Employees', function (angularLoad, Utility, Assessments) {
	var svc = this;
	svc.a = Assessments;
	svc.initialized = false;
	svc.employees = [];

	svc.load = function (callback) {
		if (Utility.empty(svc.employees)) {
			angularLoad.loadScript('js/config/target/members.js').then(function () {
				svc.employees = employees;
				//console.log("employees loaded", svc.employees);
				callback();
			}).catch(function () {
			});
		}
		else {
			callback();
		}
	};

	svc.remove = function (employee) {
		svc.employees.splice(svc.employees.indexOf(employee), 1);
	};

	svc.retrieveCompetencies = function (employee) {
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
		//console.log("retrieveCompetencies(" + employee.id + "):", competencies);
		return {competencies: competencies, level: level};
	};

	svc.getSectionCompetencies = function (employee, sectionId) {
		if (!Utility.empty(employee) && !Utility.empty(employee.competencies)) {
			for (var i = 0; i < employee.competencies.length; i++) {
				if (employee.competencies[i].id == sectionId) {
					//console.log("COMPRET:", employee.competencies[i]);
					return employee.competencies[i];
				}
			}
		}
		return null;
	};

	svc.getCompetencies = function (employeeId) {
		//console.log("e.getCompetencies(" + employeeId + ")");
		if (!Utility.empty(svc.a) && !Utility.empty(svc.a.competencies)) {
			//console.log("e.getCompetencies(" + employeeId + "), framework competencies were loaded");
			for (var i = 0; i < svc.employees.length; i++) {
				if ((employeeId == null || svc.employees[i].id == employeeId) && Utility.empty(svc.employees[i].competencies)) {
					var compInfo = svc.retrieveCompetencies(svc.employees[i]);
					svc.employees[i].competencies = compInfo.competencies;
					svc.employees[i].level = compInfo.level;
					//console.log("e.getCompetencies(" + svc.employees[i].id + "):", svc.employees[i].competencies);

					for (var j = 0; j < svc.a.assessments.length; j++) {
						if (svc.a.assessments[j].employeeId == svc.employees[i].id) {
							svc.a.assessments[j].employee = svc.employees[i];
							svc.employees[i].assessmentId = svc.a.assessments[j].id;
						}
					}
					if (employeeId !== null) {
						return svc.employees[i].competencies;
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

	svc.get = function (employeeId) {
		for (var i = 0; i < svc.employees.length; i++) {
			if (svc.employees[i].id === parseInt(employeeId)) {
				svc.getCompetencies(employeeId);
				return svc.employees[i];
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
