/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('ResourceAnalysis', []).service('ResourceAnalysis',
		function ($q, $http, QuestionGroups, Resources) {
	var svc = this;
	svc.resources = [];
    svc.questionNames = [];

	svc.get = function () {
		var promises = [];
		promises.push(QuestionGroups.get());
		promises.push(Resources.loadAll(function(){}));
		return $q.all(promises)
				.then(
						function(response) {
							var questionGroups = response[0].items;
                            var resources = response[1].data;
                            var questionCount = 0;
                            var questionIdToIndex = {};
                            questionGroups.forEach(function(group) {
                                group.questions.forEach(function(question) {
                                    questionIdToIndex[question.id] = questionCount;
                                    questionCount++;
                                    svc.questionNames.push(question.n);
                                })
                            });
                            resources.forEach(function(resource) {
                                var weights = [];
                                for (var i = 0; i < questionCount; i++) {
                                    weights.push(0);
                                }
                                resource.alignments.forEach(function(alignment) {
                                    weights[questionIdToIndex[alignment.qi]] = alignment.wt;
                                });
                                svc.resources.push({
                                    name: resource.n,
                                    data: weights
                                });
                            });
                            return svc;
						},
						function(error) {
							return $q.reject(error);
						});
	};
});