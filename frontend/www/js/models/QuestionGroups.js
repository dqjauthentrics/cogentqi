/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('QuestionGroups', []).service('QuestionGroups', function ($cookieStore, $resource, $http, Utility) {
	var svc = this;
	svc.items = null;

	svc.execute = function(callback) {
		if (svc.items == null) {
			return $http.get('/api2/questiongroup').then(function(response) {
						svc.items = response.data;
						callback(svc);
					},
					function(error) {
						failure(error);
					});
		}
		else {
			callback(svc);
			return $q.when();
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
	svc.markQuestions = function(questions, property) {
		svc.items.forEach(function(group) {
			group.questions.forEach(function(question) {
				question[property] = questions[question.id]=== true;
			});
		});
	}
});
