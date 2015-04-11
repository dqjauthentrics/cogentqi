'use strict';

angular.module('Quizzes', []).factory('Quizzes', function () {
	var passingScore = 3;
	var questions = [
		{
			question: "What is the best way to verify a medication dosage?",
			options: ["Read the Label", "Compare the Label to the Computer Result", "Ask the Pharmacist", "All of the Above"],
			answer: 1
		},
		{
			question: "Approximately how many medications are there?",
			options: ["10,000", "20,000", "100,000", "Over a million"],
			answer: 2
		},
		{
			question: "How do you assess a patient for allergies?",
			options: ["Ask the Patient", "Look it up on the computer", "Look for Symptoms"],
			answer: 0
		}
	];

	return {
		getPassingScore: function () {
			return passingScore;
		},
		getQuestion: function (id) {
			return (id < questions.length) ? questions[id] : false;
		}
	};
})
;