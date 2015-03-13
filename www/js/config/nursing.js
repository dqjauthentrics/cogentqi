var installation = {
	appName: 'CogentQI',
	name: 'Nursing CQI',
	logo: '<i class="logo ion-medkit"></i>',

	competencies: [
		{
			id: 0, number: '1.0', text: 'Delivery of Patient Care', val: Math.floor((Math.random() * 5)), progress: 42,
			children: [
				{
					id: 1,
					text: 'N1',
					number: '1.1',
					tags: ['Initial Patient Contact'],
					val: 3,
					description: 'The pharmacy technician should be able to: <ul><li>Identify the patient</li><li>Introduce self to patient and explain their role</li></ul>'
				},
				{
					id: 2,
					text: 'N2',
					number: '1.2',
					tags: ['Initial Patient Contact'],
					val: 3,
					description: 'The pharmacy technician should be able to: <ul><li>Question the patient (parent or carer) or a health care professional to obtain information </li><li>Use a variety of information sources to gather information </li><li>Interpret records made by other health care professionals when appropriate</li><li>Identify if the patient has brought in their medicines and/or encourage medicines to be brought in</li></ul>'
				},
				{
					id: 3,
					text: "N3",
					number: '1.3',
					tags: ['Initial Patient Contact'],
					val: 3,
					description: 'For ward based pharmacy technicians, the main focus for obtaining patient consent is for using safe and/or removing unsafe Patient’s Own Drugs. This should follow the local process. As pharmacy technicians develop new roles and provide additional services they will require a greater understanding of the issues surrounding consent.'
				}
			]
		}
	]
};
