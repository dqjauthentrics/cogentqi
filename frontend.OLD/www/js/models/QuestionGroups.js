/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('QuestionGroups', []).service('QuestionGroups', function ($q, $resource, $http, Utility) {
	var svc = this;
	svc.items = null;

	svc.get = function () {
		if (svc.items == null) {
			return $http.get('/api3/instrument/questionGroups').then(function (result) {
																		 if (result.data.status !== 1) {
																			 return $q.reject(result.data);
																		 }
																		 var response = result.data; // Cogent standard
																		 svc.items = response.data;
																		 return svc;
																	 },
																	 function (error) {
																		 $q.reject(error);
																	 });
		}
		else {
			return $q.when(svc);
		}
	};
	svc.find = function (groupId) {
		for (var i = 0; i < svc.items.length; i++) {
			if (svc.items[i].id == groupId) {
				return svc.items[i];
			}
		}
		return null;
	};
	svc.markQuestions = function (questions, property) {
		svc.items.forEach(function (group) {
			group.questions.forEach(function (question) {
				question[property] = questions[question.id] === true;
			});
		});
	}
});
