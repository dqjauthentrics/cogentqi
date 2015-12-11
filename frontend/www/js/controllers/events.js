/**
 * @author     Greg Emerson
 * @copyright  CogentQI.com, 2015.  All rights reserved.
 */
'use strict';

angular.module('EventControllers', [])

	.controller(
		'EventEditCtrl',
		function ($scope, $stateParams, Utility, Events) {
            Events.execute(function (events) {
                $scope.event = events.find($stateParams.eventId);
            });
            $scope.save = function() {
                Events.saveEvent($scope.event, function(success, data) {
                    alert('not implemented');
                });
            }
		})

	.controller(
		'EventCatalogCtrl',
		function ($cookieStore, $scope, $stateParams, Utility, Events) {
			$scope.data = {isLoading: true, searchFilter: ''};
			$scope.user = $cookieStore.get('user');
            Events.execute(function (events) {
                $scope.Events = events;
                $scope.data.isLoading = false;
                $scope.eventFilter = function (event) {
                    return Events.filterer(event, $scope.data.searchFilter);
                };
                $scope.createEvent = function() {
                    Events.createEvent();
                };
            });
		})

	.controller(
		'EventAlignmentCtrl',
		function ($scope, $stateParams, Utility, Events, QuestionGroups) {
			Events.execute(function (events) {
				$scope.event = events.find($stateParams.eventId);
			},
            function(error) {
                alert('error loading Events not implemented');
            }) // execute returns a promise w/null response
            .then(function(response) {
                QuestionGroups.execute(function(questionGroups) {
                    $scope.questionGroups = questionGroups;
                },
                function(error) {
                    alert('error loading QuestionGroups not implemented');
                })  // execute returns a promise w/null response
            .then(function(response) {
                $scope.questionGroups.items.forEach(function(group) {
                    group.isOpen = false;
                });
                $scope.toggleOpen = function(group) {
                    group.isOpen = !group.isOpen;
                }
                var alignmentQuestions = $scope.event.getAlignmentQuestions();
                $scope.questionGroups.markQuestions(alignmentQuestions, 'isAligned');
                $scope.save = function() {
                    var questions = [];
                    $scope.questionGroups.items.forEach(function(group) {
                        group.questions.forEach(function(question) {
                            if (question.isAligned) {
                                questions.push(question.id);
                            }
                        });
                    });
                    Events.saveAlignments($scope.event, questions, function(success, data) {
                        alert('not implemented');
                    });
                }
            });});
		});