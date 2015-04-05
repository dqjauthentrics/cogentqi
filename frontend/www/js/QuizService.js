'use strict';

angular.module('app.quiz', []).factory('Quiz', function () {
	var questions = [
		{
			question: "What is the best way to verify a medication dosage?",
			options: ["Read the Label", "Compare the Label to the Computer Result", "Ask the Pharmacist", "All of the Above"],
			answer: 2
		},
		{
			question: "Approximately how many medications are there?",
			options: ["10,000", "20,000", "100,000", "Over a million"],
			answer: 2
		},
		{
			question: "How do you assess a patient for allergies?",
			options: ["Ask", "Look them up on the computer", "Look for Symptoms"],
			answer: 0
		}
	];

	return {
		getQuestion: function (id) {
			if (id < questions.length) {
				return questions[id];
			}
			else {
				return false;
			}
		}
	};
});