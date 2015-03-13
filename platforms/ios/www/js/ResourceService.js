angular.module('app.resources', ['app.utils']).service('Resources', function () {
	var svc = this;
	svc.resources = [
		{
			id: 0,
			number: 'PHT001',
			name: 'Introduction to the Pharmacy, for Technicians',
			summary: 'This module provides a general overview.',
			tags: ['video'],
			alignments: [{competencyId: 1, weight: 1},{competencyId: 2, weight: 1},{competencyId: 1, weight: 1}],
			segments: [
				{
					type: 'video',
					url: 'https://www.youtube-nocookie.com/embed/-cLSk8z-I-Q?list=PLWcMOyG8lndCiqAA73TwWJ0ZXq0p46Vhz'
				}
			]
		},
		{
			id: 1,
			number: 'PHT003',
			name: 'Allergy Identification',
			summary: 'This module provides basic information about allergy identification.',
			tags: ['video'],
			segments: [
				{
					type: 'inline',
					content: 'ASHP Pharmacy Technician Initiative and Pharmacy Practice Model Initiative: The PDF document below is a case study resource that supports the goals of PPMI and the PTI and the critical roles pharmacy technicians have in patient care. Important characteristics of current and evolving advanced technician practice models include training through an ASHP accredited training program, PTCB certification, and licensure with a Board of Pharmacy.'
				},
				{
					type: 'pdf',
					url: 'http://www.ashpmedia.org/ppmi/docs/casestudy-South-Pointe-Hospital.pdf'
				},
				{
					type: 'video',
					url: 'https://www.youtube.com/watch?v=HDQhxrv2q78',
					precis: 'This is a video that discusses allergy identification in general terms.'
				}
			],
			alignments: [{competencyId: 1, weight: 3}],
			contentUrl: null
		},
		{
			id: 2,
			number: 'PHT005',
			name: 'Assessing Patients',
			summary: 'Students will learn how to: <ul><li>Question the patient (parent or carer) or a health care professional to obtain information </li><li>Use a variety of information sources to gather information </li><li>Interpret records made by other health care professionals when appropriate</li><li>Identify if the patient has brought in their medicines and/or encourage medicines to be brought in</li></ul>',
			alignments: [{competencyId: 2, weight: 3}],
			contentUrl: '/#/resource/patientAssessment.html'
		},
		{
			id: 3,
			number: 'PHT009',
			name: 'Adherence Assessment',
			summary: 'In this module, students will learn to identify patient non-adherence to their medicines, such as an inability to use inhalers correctly, a fear of taking medications, or an inability to open clic locs or blister packs.',
			tags: ['video'],
			alignments: [{competencyId: 5, weight: 3}],
			contentUrl: '/#/resource/adherenceAssessment.html'
		},
		{
			id: 4,
			number: 'PHT02',
			name: 'Calculations',
			summary: 'Pharmacy Calculations: An Introduction for Pharmacy Technicians, is designed for pharmacy technician students enrolled in a training program, technicians preparing for the certification exam, and for on-site training. As the role for pharmacy technicians continues to evolve and expand one thing remains constant. The safety of patients is the highest priority for anyone working in pharmacy, whether in hospital, retail, or institutional practices. With a thorough understanding of pharmacy math comes accuracy in computations and safety and quality in practice.',
			tags: ['video'],
			alignments: [{competencyId: 11, weight: 1},{competencyId: 12, weight: 2},{competencyId: 13, weight: 1}],
			segments: [
				{
					type: 'video',
					url: 'https://www.youtube.com/watch?v=-cLSk8z-I-Q'
				},
				{
					type: 'video',
					url: 'https://www.youtube.com/watch?v=_hMzoJHvjwQ'
				},
				{
					type: 'video',
					url: 'https://www.youtube.com/watch?v=XtiEkfZX82w'
				}
			]
		},
		{
			id: 5,
			number: 'PHT07',
			name: 'Prescription Labeling',
			summary: 'Relying on the right study materials is absolutely essential for success on the PTCB test.',
			alignments: [{competencyId: 4, weight: 2}],
			tags: ['video'],
			segments: [
				{
					type: 'video',
					url: 'https://www.youtube.com/watch?v=9h1iQJMfZM8&index=20&list=PLWcMOyG8lndCiqAA73TwWJ0ZXq0p46Vhz'
				}
			]
		},
		{
			id: 6,
			number: 'PHT-SUPP-01',
			name: 'Code of Conduct',
			alignments: [{competencyId: 204, weight: 2}, {competencyId: 205, weight: 2}],
			summary: 'As pharmacy technicians, and under the supervision of a licensed pharmacist, PTCB certificants and candidates have the obligation to: maintain high standards of integrity and conduct; accept responsibility for their actions; continually seek to improve their performance in the workplace; practice with fairness and honesty; and, encourage others to act in an ethical manner consistent with the standards and responsibilities set forth below. Pharmacy technicians assist pharmacists in dispensing medications and remain accountable to supervising pharmacists with regard to all pharmacy activities, and will act consistent with all applicable laws and regulations.',
			tags: ['web', 'regulation'],
			segments: [
				{
					type: 'pdf',
					url: 'http://www.ptcb.org/docs/default-source/get-certified/codeofconduct.pdf?sfvrsn=6'
				}
			]
		},
		{
			id: 7,
			number: 'PHT010',
			name: 'Drug Interactions',
			alignments: [{competencyId: 11, weight: 1},{competencyId: 12, weight: 2},{competencyId: 13, weight: 1}],
			summary: 'This course discusses the fundamental factors of pharmacokinetic-based drug interactions and provides clinical pearls for the everyday practicing clinician. The course learning objective are: <ol> <li>1. Examine the time component involved in drug interactions</li> <li>2. Recognize the interplay between drugs and genetics</li> <li>3. Identify a drug interaction in a patient with a problem</li> <li>4. Predict a drug interaction in a patient that you want to prescribe for</li></ol>',
			tags: ['web', 'regulation'],
			segments: [
				{
					type: 'video',
					url: 'https://www.youtube.com/watch?v=Ii9Vaz7yv8E&list=PL9oIAZVi3nAbHns2389M5Y8Z8Lm-Uyns-'
				}
			]
		},
		{
			id: 8,
			number: 'PHT011',
			name: 'Preventive Care',
			alignments: [{competencyId: 204, weight: 3}],
			summary: '<p>The expanded role of 21st century pharmacists will position them to have greater impact in the shifting landscape of health care and public health. Beyond the dispensing of medications, pharmacists also provide a spectrum of prevention services to help improve health outcomes. In the United States, people with chronic conditions account for 91% of all prescriptions filled. By 2020, it is estimated that 157 million Americans will have at least 1 chronic non-infectious or infectious medical condition. By understanding and maximizing the role of pharmacists, opportunities exist to better use their knowledge and skills to improve our nation’s health. </p><p>In this session of Public Health Grand Rounds viewers learned about the impact of including pharmacists in team-based care, tools that CDC has developed to facilitate incorporating pharmacists in public health initiatives, and examples of how pharmacists are working in healthcare settings to prevent and manage diseases.',
			tags: ['web', 'regulation'],
			segments: [
				{
					type: 'video',
					url: 'https://www.youtube.com/watch?v=Ii9Vaz7yv8E&list=PL9oIAZVi3nAbHns2389M5Y8Z8Lm-Uyns-'
				}
			]
		}
	];

	svc.all = function () {
		return svc.resources;
	};
	svc.remove = function (resource) {
		svc.resources.splice(svc.resources.indexOf(resource), 1);
	};
	svc.get = function (resourceId) {
		for (var i = 0; i < svc.resources.length; i++) {
			if (svc.resources[i].id === parseInt(resourceId)) {
				return svc.resources[i];
			}
		}
		return null;
	};
});
