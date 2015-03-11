angular.module('app.employees', ['app.utils', 'app.assessments']).service('Employees', function ($appUtil, Assessments) {
	var svc = this;
	svc.a = Assessments;
	svc.initialized = false;
	svc.employees = [
		{
			id: 0,
			name: 'Melissa Franklin',
			role: 'Head Pharmacist',
			face: 'img/faux/users/1.jpg',
			badges: ['Patient Assessment', 'Patient Consent'],
			level: 2
		},
		{
			id: 1,
			name: 'Ben Sparrow',
			role: 'Pharmacist',
			face: 'img/faux/users/2.jpg',
			level: 3
		},
		{
			id: 2,
			name: 'Andrea Jostlin',
			role: 'Pharmacy Technician',
			face: 'img/faux/users/3.jpg',
			badges: ['Patient Assessment', 'Patient Consent', 'Allergy Identification'],
			level: 5
		},
		{
			id: 3,
			name: 'Regina Bradley',
			role: 'Pharmacy Technician',
			badges: ['Medicines Management'],
			face: 'img/faux/users/4.jpg',
			level: 4
		},
		{
			id: 4,
			name: 'Maggie Regis',
			role: 'Pharmacy Technician',
			face: 'img/faux/users/5.jpg',
			level: 1
		},
		{
			id: 5,
			name: 'Perry Governor',
			role: 'Pharmacy Technician',
			face: 'img/faux/users/6.jpg',
			level: 0
		},
		{
			id: 6,
			name: 'Jim Washburn',
			role: 'Pharmacy Technician',
			face: 'img/faux/users/7.jpg',
			level: 2
		},
		{
			id: 7,
			name: 'Marion Sweetwater',
			role: 'Pharmacy Technician',
			face: 'img/faux/users/8.jpg',
			level: 3
		}
	];

	svc.remove = function (employee) {
		svc.employees.splice(svc.employees.indexOf(employee), 1);
	};
	svc.get = function (employeeId) {
		for (var i = 0; i < svc.employees.length; i++) {
			if (svc.employees[i].id === parseInt(employeeId)) {
				return svc.employees[i];
			}
		}
		return null;
	};
	svc.getCompetencies = function (employeeId) {
		var employee = svc.get(employeeId);
		if (!$appUtil.empty(employee)) {
			return employee.competencies;
		}
		return null;
	};
	svc.initialize = function () {
		for (var i = 0; i < svc.employees.length; i++) {
			var totScore = 0;
			svc.employees[i].competencies = [];
			for (var j = 0; j < svc.a.competencies.length; j++) {
				var val = Math.floor((Math.random() * 5));
				svc.employees[i].competencies[j] = JSON.parse(JSON.stringify(svc.a.competencies[j]));
				svc.employees[i].competencies[j].val = val;
				var sectionTotal = 0;
				for (var k = 0; k < svc.employees[i].competencies[j].children.length; k++) {
					val = Math.floor((Math.random() * 5)) + 1;
					svc.employees[i].competencies[j].children[k].val = val;
					sectionTotal += val;
				}
				svc.employees[i].competencies[j].val = sectionTotal > 0 ? Math.round(sectionTotal / svc.employees[i].competencies[j].children.length) : 0;
				totScore += val;
			}
			//console.log("SET:", svc.employees[i].id, svc.employees[i].competencies[0].val, svc.employees[i].competencies[1].val);
			svc.employees[i].level = totScore > 0 && svc.a.competencies.length > 0 ? Math.round(totScore / svc.a.competencies.length) : 0;
			//console.log("TOTAL", i, totScore, svc.employees[i].level);
		}
		svc.initialized = true;
	};

	if (!svc.initialized) {
		svc.initialize();
	}

});
