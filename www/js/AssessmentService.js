angular.module('app.assessments', ['app.utils', 'app.resources']).service('Assessments', function (Utility, Resources) {
	svc = this;
	svc.avg = 0;
	svc.currentSectionIdx = 0;
	svc.initialized = false;
	svc.maxRange = 5;
	svc.recommendations = [];

	svc.competencies = [
		{
			id: 0, number: '1.0', text: 'Delivery of Patient Care', val: Math.floor((Math.random() * 5)), progress: 42,
			children: [
				{
					id: 1,
					text: 'Patient Introduction',
					number: '1.1',
					tags: ['Initial Patient Contact'],
					val: 3,
					description: 'The pharmacy technician should be able to: <ul><li>Identify the patient</li><li>Introduce self to patient and explain their role</li></ul>'
				},
				{
					id: 2,
					text: 'Patient Assessment',
					number: '1.2',
					tags: ['Initial Patient Contact'],
					val: 3,
					description: 'The pharmacy technician should be able to: <ul><li>Question the patient (parent or carer) or a health care professional to obtain information </li><li>Use a variety of information sources to gather information </li><li>Interpret records made by other health care professionals when appropriate</li><li>Identify if the patient has brought in their medicines and/or encourage medicines to be brought in</li></ul>'
				},
				{
					id: 3,
					text: "Patient Consent",
					number: '1.3',
					tags: ['Initial Patient Contact'],
					val: 3,
					description: 'For ward based pharmacy technicians, the main focus for obtaining patient consent is for using safe and/or removing unsafe Patient’s Own Drugs. This should follow the local process. As pharmacy technicians develop new roles and provide additional services they will require a greater understanding of the issues surrounding consent.'
				},
				{
					id: 4,
					text: 'Relevant Medicines Management Information',
					number: '1.4',
					tags: ['Initial Patient Contact'],
					val: 3,
					description: 'During the consultation with the patient, health problems and medicines management background should be identified and documented as per local procedure. Medicines Management background information could include use of compliance aids, information on who usually fills this, need for large print labels, resident of a nursinghome requiring specific discharge instructions, support offered by social services etc. Identification of allergies and poor adherence'
				},
				{
					id: 5,
					text: 'Identification of Non-Adherence',
					number: '1.5',
					tags: ['Initial Patient Contact'],
					val: 3,
					description: 'Pharmacy technicians are ideally placed to identify patient’s with non-adherence to their medicines, such as an inability to use inhalers correctly, a fear of taking medications, or an inability to open clic locs or blister packs. These issues should be resolved and documented by the pharmacy technician or referred according to local policy. '
				},
				{
					id: 6,
					text: 'Identification of Allergies',
					number: '1.6',
					tags: ['Initial Patient Contact'],
					val: 3,
					description: 'It is important patient\’s do not receive medicines they allergic to, nor be exposed to products that contain substances they are allergic to eg latex or nuts (some topical preparations contain nut oils). A pharmacy technician should:  <ul><li>Ensure that any allergy identified, including the type of reaction, is documented according to local procedure </li><li>Review the prescription to ensure that no culprit medicines have been prescribed.</li><li>Refer any patients who are prescribed medicines to which they have a documented allergy according to local procedure.</li></ul>  Pharmacy technicians should also be aware some patients describe diarrhoea with antibiotics as being allergic to them. '
				},
				{
					id: 7,
					text: 'Consultation and Referral',
					number: '1.7',
					tags: ['Initial Patient Contact'],
					val: 3,
					description: ''
				},
				{
					id: 8,
					text: 'The Prescription',
					number: '1.8',
					tags: ['The Prescription'],
					val: 3,
					description: ''
				},
				{
					id: 9,
					text: "Patient’s Own Drugs",
					number: '1.9',
					tags: ["Patient’s Own Drugs"],
					val: 3,
					description: ''
				},
				{
					id: 10,
					text: 'Assessment of PODs',
					number: '1.9',
					tags: ["Patient’s Own Drugs"],
					val: 3,
					description: ''
				},
				{
					id: 11,
					text: 'Identification of Discrepancies',
					number: '1.10',
					tags: ['Initial Patient Contact'],
					val: 3,
					description: ''
				},
				{
					id: 12,
					text: 'Medicines Reconciliation',
					number: '1.11',
					tags: ['Medicines Reconciliation'],
					val: 3,
					description: ''
				},
				{
					id: 13,
					text: 'Supply of Medicines',
					number: '1.12',
					tags: ['Supply of Medicines'],
					val: 3,
					description: ''
				},
				{
					id: 14,
					text: 'Ensuring Problem Resolution',
					number: '1.13',
					tags: ['Supply of Medicines'],
					val: 3,
					description: ''
				}
			]
		},
		{
			id: 299, number: '2.0', text: 'Pharmacy Law and Ethics', val: Math.floor((Math.random() * 5)), progress: 22,
			children: [
				{
					id: 300,
					text: 'Knowledge of Laws and Regulations',
					number: '2.1',
					tags: ['Law'],
					val: 3,
					description: 'The employee is familiar with pharmacy laws and regulations, especially as they pertain to pharmacy technician responsibilities.'
				},
				{
					id: 301,
					text: 'Drug Enforcement Administration (DEA) Knowledge',
					number: '2.2',
					tags: ['Law'],
					val: 3,
					description: 'The employee is knowledgeable of the Drug Enforcement Administration (DEA) and state requirements for controlled substances: the candidate shall be able to identify controlled substance labels, understand the rationale for controlled substances, the need for proper inventory and accountability, and the proper storage of controlled substances. '
				},
				{
					id: 302,
					text: 'Classification of Legend VS OTC',
					number: '2.3',
					tags: ['Drugs'],
					val: 3,
					description: 'The employee is knowledgeable of the Drug Enforcement Administration (DEA) and state requirements for controlled substances: the candidate shall be able to identify controlled substance labels, understand the rationale for controlled substances, the need for proper inventory and accountability, and the proper storage of controlled substances. '
				},
				{
					id: 304,
					text: 'Pharmaceutical Vocabulary',
					number: '2.4',
					tags: ['Drugs'],
					val: 3,
					description: 'demonstrate a thorough knowledge of general pharmaceutical and medical terminology, the apothecary symbols, abbreviations (English and Latin), and the common chemical symbols.'
				}
			]
		},
		{
			id: 199, number: '3.0', text: 'Personal Competencies', val: Math.floor((Math.random() * 5)), progress: 22,
			children: [
				{
					id: 200,
					text: 'Prioritization',
					number: '3.1',
					tags: ['Organization', 'core'],
					val: 3,
					description: 'The pharmacy technician should be able to prioritise their own work and adjust priorities in response to changing circumstances; for example, knowing which patients/tasks take priority. We recognise that it is not possible or necessary to review the pharmaceutical care of every patient, every day. '
				},
				{
					id: 201,
					text: 'Punctuality',
					number: '3.2',
					tags: ['Organization', 'core'],
					val: 3,
					description: 'The pharmacy technician should ensure satisfactory completion of tasks with appropriate handover and recognise the importance of punctuality and attention to detail.'
				},
				{
					id: 202,
					text: 'Initiative',
					number: '3.3',
					tags: ['Organization', 'core'],
					val: 3,
					description: 'The pharmacy technician should demonstrate initiative in solving a problem or taking on a new opportunity/task without the prompting from others, and demonstrate the ability to work independently within their limitations.'
				},
				{
					id: 203,
					text: 'Efficiency',
					number: '3.4',
					tags: ['Organization', 'core'],
					val: 3,
					description: 'This section deals with time management, and the pharmacy technician should demonstrate efficient use of their time. An example could be reviewing the allocatedpatients in the given time to an appropriate standard.'
				},
				{
					id: 204,
					text: 'Patient and Carer',
					number: '3.5',
					tags: ['Effective Communication Skills', 'core'],
					val: 3,
					description: 'The "carer" may be a friend or relative as well as a social services or private agencycare worker.'
				},
				{
					id: 205,
					text: 'Healthcare Professionals',
					number: '3.6',
					tags: ['Effective Communication Skills', 'core'],
					val: 3,
					description: ''
				}
			]
		}
	];
	svc.assessments = [
		{id: 1, employeeId: 1, stamp: '2015-03-06 10:15AM'},
		{id: 3, employeeId: 3, stamp: '2015-03-05 13:15PM'},
		{id: 4, employeeId: 4, stamp: '2015-03-05 10:10AM'},
		{id: 5, employeeId: 5, stamp: '2015-03-05 9:00AM'},
		{id: 7, employeeId: 6, stamp: '2015-03-01 10:00AM'},
		{id: 8, employeeId: 7, stamp: '2015-03-01 10:25AM'},
		{id: 2, employeeId: 4, stamp: '2015-03-01 10:55AM'},
		{id: 1, employeeId: 7, stamp: '2015-03-01 11:50AM'},
		{id: 3, employeeId: 5, stamp: '2015-02-15 10:40AM'},
		{id: 0, employeeId: 4, stamp: '2015-02-14 10:12AM'},
		{id: 4, employeeId: 3, stamp: '2015-02-10 9:10AM'},
		{id: 5, employeeId: 1, stamp: '2015-01-24 10:14AM'},
		{id: 6, employeeId: 2, stamp: '2015-01-18 10:00AM'}
	];

	svc.all = function (e) {
		for (var i = 0; i < svc.assessments.length; i++) {
			if (Utility.empty(svc.assessments[i].employee)) {
				svc.assessments[i].employee = e.get(svc.assessments[i].employeeId);
			}
		}
		return svc.assessments;
	};
	svc.get = function (assessmentId) {
		for (var i = 0; i < svc.assessments.length; i++) {
			if (svc.assessments[i].id === parseInt(assessmentId)) {
				return svc.assessments[i];
			}
		}
		return null;
	};
	svc.getMostRecent = function (employeeId) {
		for (var i = 0; i < assessments.length; i++) {
			if (svc.assessments[i].employeeId === parseInt(employeeId)) {
				return svc.assessments[i];
			}
		}
		return null;
	};
	svc.getCompetencies = function (competencies, assessmentId, sectionId) {
		for (var i = 0; i < competencies.length; i++) {
			if (competencies[i].id === parseInt(sectionId)) {
				return competencies[i].children;
			}
		}
	};
	svc.getAllCompetencies = function () {
		for (var i = 0; i < svc.competencies.length; i++) {
			svc.competencies[i].previous = '';
			svc.competencies[i].next = '';
			if (i > 0) {
				svc.competencies[i].previous = svc.competencies[(i - 1)].text;
			}
			if (i < svc.competencies.length - 1) {
				svc.competencies[i].next = svc.competencies[(i + 1)].text;
			}
		}
		return svc.competencies;
	};

	svc.scorify = function (employee) {
		svc.avg = 0;
		var total = 0;
		var compCount = 0;
		//console.log("SCORIFY", employee);
		if (!Utility.empty(employee) && !Utility.empty(employee.competencies)) {
			for (i = 0; i < employee.competencies.length; i++) {
				var section = employee.competencies[i];
				for (j = 0; j < section.children.length; j++) {
					total += section.children[j].val;
					compCount++;
				}
			}
			if (total > 0) {
				svc.avg = Math.round(total / compCount);
			}
		}
	};
	svc.scoreWord = function (score) {
		var scoreWord = "N/A";
		try {
			switch (parseInt(Math.round(score))) {
				case 1:
					scoreWord = "Poor";
					break;
				case 2:
					scoreWord = "Fair";
					break;
				case 3:
					scoreWord = "Good";
					break;
				case 4:
					scoreWord = "Excellent";
					break;
				case 5:
					scoreWord = "Perfect";
					break;
				default:
			}
		}
		catch (exception) {
		}
		return scoreWord;
	};
	svc.resourceScore = function (alignmentWeight, employeeScore, nAlignments) {
		var score = 0;
		if (employeeScore > 0 && nAlignments > 0) {
			score = (alignmentWeight * Math.pow((5 - employeeScore), 2)) / nAlignments;
		}
		if (score > 5) {
			score = 5;
		}
		if (score < 0) {
			score = 0;
		}
		//console.log("SCORE:", alignmentWeight, employeeScore, nAlignments, score);
		return score;
	};
	svc.recommend = function (employee) {
		svc.recommendations = [];
		resourceAlignmentCounts = {};
		for (var k = 0; k < Resources.resources.length; k++) {
			Resources.resources[k].score = 0;
			var resource = Resources.resources[k];
			if (Utility.empty(resourceAlignmentCounts[resource.id])) {
				resourceAlignmentCounts[resource.id] = 0;
			}
			resourceAlignmentCounts[resource.id] += resource.alignments.length;
		}
		//console.log("alignmentCounts:", resourceAlignmentCounts);
		for (var i = 0; i < employee.competencies.length; i++) {
			for (var j = 0; j < employee.competencies[i].children.length; j++) {
				var comp = employee.competencies[i].children[j];
				for (k = 0; k < Resources.resources.length; k++) {
					resource = Resources.resources[k];
					var nAlignments = resource.alignments.length;
					for (var z = 0; z < nAlignments; z++) {
						var alignment = resource.alignments[z];
						if (alignment.competencyId == comp.id) {
							Resources.resources[k].score += svc.resourceScore(alignment.weight, comp.val,
																			  resourceAlignmentCounts[resource.id]
							);
						}
					}
				}
			}
		}
		for (k = 0; k < Resources.resources.length; k++) {
			resource = Resources.resources[k];
			if (resource.score > 5) {
				resource.score = 5;
			}
			if (resource.score < 0) {
				resource.score = 0;
			}
			if (resource.score > 0) {
				svc.recommendations.push({resourceId: resource.id, number: resource.number, name: resource.name, weight: resource.score});
			}
		}
		svc.recommendations = svc.recommendations.sort(function (a, b) {
			//console.log(a,b);
			return a["weight"] > b["weight"] ? -1 : a["weight"] < b["weight"] ? 1 : 0;
		});

		//console.log("RECOMMENDATIONS:", svc.recommendations);
	};
	svc.sliderTransform = function (employee, competency, idx, isUpdate) {
		var slider = $("#competency_item_" + competency.id);
		var scoreWord = svc.scoreWord(competency.val);
		var levelEl = slider.find("span.bubble.low");
		levelEl.html(scoreWord);
		slider.removeClass(function (index, css) {
			return (css.match(/(^|\s)slider\S+/g) || []).join(' ');
		}).addClass("slider" + competency.val);
		svc.scorify(employee);
		if (isUpdate) {
			svc.recommend(employee);
		}
	};
	svc.sliderChange = function (employee, competency, thing, isUpdate) {
		var idx = thing.$index;
		svc.sliderTransform(employee, competency, idx, isUpdate);
	};
	svc.nextSlide = function (index) {
		svc.currentSectionIdx++;
		if (svc.currentSectionIdx > 1) {
			svc.currentSectionIdx = 0;
		}
	};
	svc.previousSlide = function (index) {
		svc.currentSectionIdx--;
		if (svc.currentSectionIdx < 0) {
			svc.currentSectionIdx = 0;
		}
	};
	svc.isLastSlide = function (index) {
		return index >= 1;
	};
	svc.isFirstSlide = function (index) {
		return index == 0;
	};
	svc.getMatrixCompetencies = function (employee) {
		var comps = [];
		if (!Utility.empty(employee)) {
			for (var i = 0; i < employee.competencies.length; i++) {
				for (var j = 0; j < employee.competencies[i].children.length; j++) {
					comps.push(employee.competencies[i].children[j]);
				}
			}
		}
		return comps;
	};
	svc.getMatrixCompetencyNames = function (e, maxLength) {
		var names = [];
		if (e.employees.length > 0) {
			var comps = e.employees[0].competencies;
			if (!Utility.empty(comps)) {
				for (var i = 0; i < comps.length; i++) {
					for (var j = 0; j < comps[i].children.length; j++) {
						var name = comps[i].children[j].text;
						if (name.length > maxLength) {
							name = name.substr(0, maxLength) + '...';
						}
						names.push(name);
					}
				}
			}
		}
		return names;
	};
	svc.getMatrixCompetencyAverages = function (e) {
		var avgs = {};
		var totals = {};
		var counts = {};
		if (!Utility.empty(e.employees) && e.employees.length > 0) {
			for (var z = 0; z < e.employees.length; z++) {
				var comps = e.employees[z].competencies;
				for (var i = 0; i < comps.length; i++) {
					if (!Utility.empty(comps[i].children)) {
						for (var j = 0; j < comps[i].children.length; j++) {
							var comp = comps[i].children[j];
							if (Utility.empty(totals[comp.id])) {
								totals[comp.id] = 0;
								avgs[comp.id] = 0;
								counts[comp.id] = 0;
							}
							totals[comp.id] += comp.val;
							counts[comp.id] += 1;
							if (comp.val > 0) {
								Math.round(avgs[comp.id] = totals[comp.id] / counts[comp.id]);
							}
						}
					}
				}
			}
		}
		return avgs;
	};

	if (!svc.initialized) {
		for (var i = 0; i < svc.competencies.length; i++) {
			svc.competencies[i].previous = '';
			svc.competencies[i].next = '';
			if (i > 0) {
				svc.competencies[i].previous = svc.competencies[(i - 1)].text;
			}
			if (i < svc.competencies.length - 1) {
				svc.competencies[i].next = svc.competencies[(i + 1)].text;
			}
		}
		svc.initialized = true;
	}

});
