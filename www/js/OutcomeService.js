'use strict';

angular.module('app.outcomes', ['app.utils']).factory('Outcomes', function () {
	var outcomes = [
		{
			id: 0,
			number: 'OUT 1.0',
			title: 'Medication Mismanagement Events',
			summary: 'How well we are doing with respect to the frequency of mismanaged medication events.',
			alignments: [{resourceId: 4, weight: 3}]
		},
		{
			id: 1,
			number: 'OUT 1.1',
			title: 'Mis-labeling Events',
			summary: 'How well we are doing with respect to the frequency of mis-labeled medication events.',
			alignments: [{resourceId: 5, weight: 3}]
		},
		{
			id: 2,
			number: 'OUT 1.3',
			title: 'Customer Complaints about Staff',
			summary: 'How well we are doing with respect to the frequency of customer complaints about staff behavior or treatment.',
			alignments: [{resourceId: 6, weight: 3}]
		},
		{
			id: 3,
			number: 'OUT 1.4',
			title: 'Missed Drug Interactions',
			summary: 'How well we are doing with respect to recognizing potential drug interactions.',
			alignments: [
				{resourceId: 7, weight: 3}, {resourceId: 5, weight: 1}, {resourceId: 4, weight: 1}, {resourceId: 1, weight: 1}]
		},
		{
			id: 4,
			number: 'OUT 1.5',
			title: 'Preventive Care Opportunities Missed',
			summary: 'How well we are doing in identifying and acting on preventive care opportunities.',
			alignments: [{resourceId: 8, weight: 3}]
		},
		{
			id: 5,
			number: 'OUT 1.6',
			title: 'Time-to Fill for Prescriptions',
			summary: 'How timely are our prescription fills.',
			alignments: []
		}
	];

	return {
		all: function () {
			return outcomes;
		},
		remove: function (outcome) {
			outcomes.splice(outcomes.indexOf(outcome), 1);
		},
		get: function (outcomeId) {
			for (var i = 0; i < outcomes.length; i++) {
				if (outcomes[i].id === parseInt(outcomeId)) {
					return outcomes[i];
				}
			}
			return null;
		}
	};
});
